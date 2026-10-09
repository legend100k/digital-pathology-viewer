import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Annotation, Point2D } from '../../types/annotation';
import { SlideMetadata } from '../../types/slide';
import { ViewportTransform, ViewerTool } from '../../types/viewer';
import { useAnnotationStore } from '../../store/useAnnotationStore';
import { useViewerStore } from '../../store/useViewerStore';
import {
  calculatePixelDistance,
  calculateCalibratedDistanceMicrons,
  calculateCalibratedAreaMicrons,
  formatMetricDistance,
  formatMetricArea,
  imageToScreenOSD,
  screenToImageOSD,
} from '../../utils/coordinates';
import { calculateRectDimensions } from '../../utils/geometry';

interface AnnotationOverlayProps {
  slide: SlideMetadata;
  transform: ViewportTransform;
  viewportWidth: number;
  viewportHeight: number;
  activeTool: ViewerTool;
  osdViewer?: any;
  viewportTick?: number;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  slide,
  transform,
  viewportWidth,
  viewportHeight,
  activeTool,
  osdViewer,
  viewportTick,
}) => {
  const {
    annotations,
    selectedAnnotationId,
    setSelectedAnnotationId,
    hoveredAnnotationId,
    setHoveredAnnotationId,
    addAnnotation,
    deleteAnnotation,
  } = useAnnotationStore();

  const { activeCategory, activeColor } = useViewerStore();

  const [drawingPoints, setDrawingPoints] = useState<Point2D[]>([]);
  const [currentCursorPos, setCurrentCursorPos] = useState<Point2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [, setFrameTick] = useState(0);

  const svgRef = useRef<SVGSVGElement>(null);

  // Re-render overlay continuously when OpenSeadragon viewport animates or pans
  useEffect(() => {
    if (!osdViewer) return;
    const handleUpdate = () => {
      setFrameTick((t) => t + 1);
    };

    osdViewer.addHandler('update-viewport', handleUpdate);
    osdViewer.addHandler('animation', handleUpdate);

    return () => {
      osdViewer.removeHandler('update-viewport', handleUpdate);
      osdViewer.removeHandler('animation', handleUpdate);
    };
  }, [osdViewer]);

  // Convert Slide Image Pixel Coordinate -> Screen Pixel Coordinate
  const slideToScreen = useCallback(
    (slidePt: Point2D) => {
      return imageToScreenOSD(slidePt, osdViewer, slide.dimensions);
    },
    [osdViewer, slide.dimensions, viewportTick]
  );

  // Convert Screen Pixel Coordinate -> Slide Image Pixel Coordinate
  const screenToSlide = useCallback(
    (screenX: number, screenY: number): Point2D => {
      return screenToImageOSD({ x: screenX, y: screenY }, osdViewer, slide.dimensions);
    },
    [osdViewer, slide.dimensions, viewportTick]
  );

  const visibleAnnotations = annotations.filter(
    (a) => a.slideId === slide.id && a.isVisible
  );

  // Pointer Down Handler
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // If pan tool, let clicks on annotations register, else allow OSD to pan
    if (activeTool === 'pan' || activeTool === 'zoomIn' || activeTool === 'zoomOut') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const slidePt = screenToSlide(screenX, screenY);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    if (activeTool === 'point') {
      const newAnn: Annotation = {
        id: `ann-${Date.now()}`,
        slideId: slide.id,
        type: 'point',
        label: `${activeCategory.toUpperCase()} Marker`,
        category: activeCategory,
        color: activeColor,
        points: [slidePt],
        isVisible: true,
        createdAt: new Date().toLocaleTimeString(),
        updatedAt: new Date().toLocaleTimeString(),
      };
      addAnnotation(newAnn);
      setSelectedAnnotationId(newAnn.id);
      return;
    }

    if (activeTool === 'text') {
      const newAnn: Annotation = {
        id: `ann-${Date.now()}`,
        slideId: slide.id,
        type: 'text',
        label: 'Clinical Finding',
        textContent: 'Diagnostic finding noted here.',
        category: activeCategory,
        color: activeColor,
        points: [slidePt],
        fontSize: 14,
        isVisible: true,
        createdAt: new Date().toLocaleTimeString(),
        updatedAt: new Date().toLocaleTimeString(),
      };
      addAnnotation(newAnn);
      setSelectedAnnotationId(newAnn.id);
      return;
    }

    if (activeTool === 'rectangle' || activeTool === 'ruler' || activeTool === 'line') {
      setIsDrawing(true);
      setDrawingPoints([slidePt, slidePt]);
      setCurrentCursorPos(slidePt);
    } else if (activeTool === 'freehand') {
      setIsDrawing(true);
      setDrawingPoints([slidePt]);
      setCurrentCursorPos(slidePt);
    } else if (activeTool === 'polygon') {
      if (!isDrawing) {
        setIsDrawing(true);
        setDrawingPoints([slidePt]);
        setCurrentCursorPos(slidePt);
      } else {
        // Check if user clicked near first point to close
        if (drawingPoints.length >= 3) {
          const firstScreen = slideToScreen(drawingPoints[0]);
          const distToFirst = Math.hypot(screenX - firstScreen.x, screenY - firstScreen.y);
          if (distToFirst < 18) {
            // Close polygon
            finishPolygon();
            return;
          }
        }
        setDrawingPoints((prev) => [...prev, slidePt]);
      }
    }
  };

  // Pointer Move Handler
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing && activeTool !== 'polygon') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const slidePt = screenToSlide(screenX, screenY);
    setCurrentCursorPos(slidePt);

    if (activeTool === 'rectangle' || activeTool === 'ruler' || activeTool === 'line') {
      setDrawingPoints((prev) => [prev[0], slidePt]);
    } else if (activeTool === 'freehand' && isDrawing) {
      setDrawingPoints((prev) => [...prev, slidePt]);
    }
  };

  // Pointer Up Handler
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const mpp = slide.micronsPerPixel || 0.252;

    if (activeTool === 'rectangle' && drawingPoints.length >= 2) {
      const p1 = drawingPoints[0];
      const p2 = drawingPoints[1];
      const dims = calculateRectDimensions(p1, p2, mpp);

      if (dims.widthMicrons > 2 && dims.heightMicrons > 2) {
        const newAnn: Annotation = {
          id: `ann-${Date.now()}`,
          slideId: slide.id,
          type: 'rectangle',
          label: `${activeCategory.toUpperCase()} Region`,
          category: activeCategory,
          color: activeColor,
          points: [dims.topLeft, dims.bottomRight],
          widthMicrons: dims.widthMicrons,
          heightMicrons: dims.heightMicrons,
          areaMicronsSquare: dims.areaMicronsSquare,
          areaMillimetersSquare: dims.areaMicronsSquare / 1_000_000,
          isCalibrated: true,
          isVisible: true,
          createdAt: new Date().toLocaleTimeString(),
          updatedAt: new Date().toLocaleTimeString(),
        };
        addAnnotation(newAnn);
        setSelectedAnnotationId(newAnn.id);
      }
      setIsDrawing(false);
      setDrawingPoints([]);
      setCurrentCursorPos(null);
    } else if ((activeTool === 'ruler' || activeTool === 'line') && drawingPoints.length >= 2) {
      const p1 = drawingPoints[0];
      const p2 = drawingPoints[1];
      const pxDist = calculatePixelDistance(p1, p2);
      const distUm = calculateCalibratedDistanceMicrons(p1, p2, mpp);

      if (pxDist > 5) {
        const newAnn: Annotation = {
          id: `ann-${Date.now()}`,
          slideId: slide.id,
          type: activeTool,
          label: `Measurement: ${formatMetricDistance(distUm)}`,
          category: 'measurement',
          color: '#06b6d4',
          points: [p1, p2],
          pixelDistance: Math.round(pxDist),
          lengthMicrons: distUm,
          lengthMillimeters: distUm / 1000,
          isCalibrated: true,
          isVisible: true,
          createdAt: new Date().toLocaleTimeString(),
          updatedAt: new Date().toLocaleTimeString(),
        };
        addAnnotation(newAnn);
        setSelectedAnnotationId(newAnn.id);
      }
      setIsDrawing(false);
      setDrawingPoints([]);
      setCurrentCursorPos(null);
    } else if (activeTool === 'freehand' && drawingPoints.length > 5) {
      const areaUm2 = calculateCalibratedAreaMicrons(drawingPoints, mpp);
      const newAnn: Annotation = {
        id: `ann-${Date.now()}`,
        slideId: slide.id,
        type: 'freehand',
        label: `${activeCategory.toUpperCase()} Contour`,
        category: activeCategory,
        color: activeColor,
        points: drawingPoints,
        areaMicronsSquare: areaUm2,
        areaMillimetersSquare: areaUm2 / 1_000_000,
        isCalibrated: true,
        isVisible: true,
        createdAt: new Date().toLocaleTimeString(),
        updatedAt: new Date().toLocaleTimeString(),
      };
      addAnnotation(newAnn);
      setSelectedAnnotationId(newAnn.id);
      setIsDrawing(false);
      setDrawingPoints([]);
      setCurrentCursorPos(null);
    }
  };

  const finishPolygon = () => {
    if (drawingPoints.length >= 3) {
      const mpp = slide.micronsPerPixel || 0.252;
      const closedPoints = [...drawingPoints, drawingPoints[0]];
      const areaUm2 = calculateCalibratedAreaMicrons(closedPoints, mpp);

      const newAnn: Annotation = {
        id: `ann-${Date.now()}`,
        slideId: slide.id,
        type: 'polygon',
        label: `${activeCategory.toUpperCase()} Boundary`,
        category: activeCategory,
        color: activeColor,
        points: closedPoints,
        areaMicronsSquare: areaUm2,
        areaMillimetersSquare: areaUm2 / 1_000_000,
        isCalibrated: true,
        isVisible: true,
        createdAt: new Date().toLocaleTimeString(),
        updatedAt: new Date().toLocaleTimeString(),
      };
      addAnnotation(newAnn);
      setSelectedAnnotationId(newAnn.id);
    }
    setIsDrawing(false);
    setDrawingPoints([]);
    setCurrentCursorPos(null);
  };

  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (activeTool === 'polygon') {
      finishPolygon();
    }
  };

  // Keyboard shortcut: Enter or Escape to finish/cancel polygon
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && activeTool === 'polygon' && isDrawing) {
        finishPolygon();
      } else if (e.key === 'Escape') {
        setIsDrawing(false);
        setDrawingPoints([]);
        setCurrentCursorPos(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, isDrawing, drawingPoints]);

  const mpp = slide.micronsPerPixel || 0.252;

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full select-none ${
        activeTool === 'pan' ? 'pointer-events-none' : 'pointer-events-auto cursor-crosshair'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      <defs>
        <filter id="osd-glow-active" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Render Saved Annotations */}
      {visibleAnnotations.map((ann) => {
        const isSelected = selectedAnnotationId === ann.id;
        const screenPoints = ann.points.map(slideToScreen);
        if (screenPoints.length === 0) return null;

        return (
          <g
            key={ann.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAnnotationId(ann.id);
            }}
            onPointerDown={(e) => {
              if (activeTool === 'pan') {
                e.stopPropagation();
                setSelectedAnnotationId(ann.id);
              }
            }}
            onPointerEnter={() => setHoveredAnnotationId(ann.id)}
            onPointerLeave={() => setHoveredAnnotationId(null)}
            className="cursor-pointer pointer-events-auto transition-opacity"
          >
            {/* POINT MARKER */}
            {ann.type === 'point' && (
              <g transform={`translate(${screenPoints[0].x}, ${screenPoints[0].y})`}>
                <circle
                  r={isSelected ? 9 : 6}
                  fill={ann.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter={isSelected ? 'url(#osd-glow-active)' : undefined}
                />
                <circle
                  r={isSelected ? 16 : 12}
                  fill="none"
                  stroke={ann.color}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <g transform="translate(10, -8)">
                  <rect
                    rx="3"
                    ry="3"
                    x="0"
                    y="-12"
                    width={ann.label.length * 6.5 + 12}
                    height="18"
                    fill="rgba(15, 23, 42, 0.90)"
                    stroke={ann.color}
                    strokeWidth="1"
                  />
                  <text
                    x="6"
                    y="0"
                    fill="#ffffff"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {ann.label}
                  </text>
                </g>
              </g>
            )}

            {/* RECTANGLE */}
            {ann.type === 'rectangle' && screenPoints.length >= 2 && (
              (() => {
                const p1 = screenPoints[0];
                const p2 = screenPoints[1];
                const x = Math.min(p1.x, p2.x);
                const y = Math.min(p1.y, p2.y);
                const w = Math.abs(p2.x - p1.x);
                const h = Math.abs(p2.y - p1.y);

                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={ann.color}
                      fillOpacity={isSelected ? 0.30 : 0.15}
                      stroke={ann.color}
                      strokeWidth={isSelected ? 2.5 : 1.8}
                      filter={isSelected ? 'url(#osd-glow-active)' : undefined}
                    />
                    <g transform={`translate(${x + 4}, ${y - 8})`}>
                      <rect
                        rx="3"
                        ry="3"
                        x="0"
                        y="-10"
                        width={Math.max(90, ann.label.length * 6.2 + 10)}
                        height="18"
                        fill="rgba(15, 23, 42, 0.90)"
                        stroke={ann.color}
                        strokeWidth="1"
                      />
                      <text
                        x="5"
                        y="2"
                        fill="#f8fafc"
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {ann.label}
                        {ann.areaMicronsSquare
                          ? ` (${formatMetricArea(ann.areaMicronsSquare)})`
                          : ''}
                      </text>
                    </g>
                  </g>
                );
              })()
            )}

            {/* POLYGON */}
            {ann.type === 'polygon' && (
              <g>
                <polygon
                  points={screenPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill={ann.color}
                  fillOpacity={isSelected ? 0.30 : 0.15}
                  stroke={ann.color}
                  strokeWidth={isSelected ? 2.5 : 1.8}
                  filter={isSelected ? 'url(#osd-glow-active)' : undefined}
                />
                {screenPoints.length > 0 && (
                  <g transform={`translate(${screenPoints[0].x}, ${screenPoints[0].y - 8})`}>
                    <rect
                      rx="3"
                      ry="3"
                      x="0"
                      y="-10"
                      width={Math.max(80, ann.label.length * 6.2 + 10)}
                      height="18"
                      fill="rgba(15, 23, 42, 0.90)"
                      stroke={ann.color}
                      strokeWidth="1"
                    />
                    <text
                      x="5"
                      y="2"
                      fill="#f8fafc"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {ann.label}
                      {ann.areaMicronsSquare
                        ? ` • ${formatMetricArea(ann.areaMicronsSquare)}`
                        : ''}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* LINE / RULER MEASUREMENT */}
            {(ann.type === 'ruler' || ann.type === 'line') && screenPoints.length >= 2 && (
              (() => {
                const p1 = screenPoints[0];
                const p2 = screenPoints[1];
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                const distText = ann.lengthMicrons
                  ? formatMetricDistance(ann.lengthMicrons)
                  : `${ann.pixelDistance} px`;

                return (
                  <g>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={ann.color}
                      strokeWidth={isSelected ? 3 : 2}
                      strokeDasharray={ann.type === 'line' ? undefined : '5 2'}
                      filter={isSelected ? 'url(#osd-glow-active)' : undefined}
                    />
                    <circle cx={p1.x} cy={p1.y} r="3.5" fill={ann.color} stroke="#ffffff" strokeWidth="1" />
                    <circle cx={p2.x} cy={p2.y} r="3.5" fill={ann.color} stroke="#ffffff" strokeWidth="1" />
                    <g transform={`translate(${midX}, ${midY - 10})`}>
                      <rect
                        rx="3"
                        ry="3"
                        x="-50"
                        y="-10"
                        width="100"
                        height="20"
                        fill="rgba(15, 23, 42, 0.92)"
                        stroke={ann.color}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {distText}
                      </text>
                    </g>
                  </g>
                );
              })()
            )}

            {/* FREEHAND PATH */}
            {ann.type === 'freehand' && (
              <g>
                <polyline
                  points={screenPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill={ann.color}
                  fillOpacity={0.15}
                  stroke={ann.color}
                  strokeWidth={isSelected ? 3 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* TEXT NOTE */}
            {ann.type === 'text' && screenPoints.length > 0 && (
              <g transform={`translate(${screenPoints[0].x}, ${screenPoints[0].y})`}>
                <rect
                  rx="4"
                  ry="4"
                  x="0"
                  y="-18"
                  width={((ann.textContent || ann.label).length * 7.5) + 20}
                  height="26"
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke={isSelected ? '#38bdf8' : ann.color}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  x="10"
                  y="-1"
                  fill="#ffffff"
                  fontSize="12"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {ann.textContent || ann.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Render Active In-Progress Live Drawing Preview */}
      {isDrawing && drawingPoints.length > 0 && (
        (() => {
          const screenDraft = drawingPoints.map(slideToScreen);

          // Rectangle Live Preview
          if (activeTool === 'rectangle' && screenDraft.length >= 2) {
            const p1 = screenDraft[0];
            const p2 = screenDraft[screenDraft.length - 1];
            const x = Math.min(p1.x, p2.x);
            const y = Math.min(p1.y, p2.y);
            const w = Math.abs(p2.x - p1.x);
            const h = Math.abs(p2.y - p1.y);

            const imgP1 = drawingPoints[0];
            const imgP2 = drawingPoints[drawingPoints.length - 1];
            const dims = calculateRectDimensions(imgP1, imgP2, mpp);

            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={activeColor}
                  fillOpacity="0.25"
                  stroke={activeColor}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <g transform={`translate(${x + 4}, ${y - 8})`}>
                  <rect rx="3" ry="3" x="0" y="-10" width="130" height="18" fill="rgba(15, 23, 42, 0.9)" />
                  <text x="5" y="2" fill="#38bdf8" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                    {formatMetricDistance(dims.widthMicrons)} × {formatMetricDistance(dims.heightMicrons)}
                  </text>
                </g>
              </g>
            );
          }

          // Ruler / Line Live Measurement Preview
          if ((activeTool === 'ruler' || activeTool === 'line') && screenDraft.length >= 2) {
            const p1 = screenDraft[0];
            const p2 = screenDraft[screenDraft.length - 1];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            const distUm = calculateCalibratedDistanceMicrons(
              drawingPoints[0],
              drawingPoints[drawingPoints.length - 1],
              mpp
            );

            return (
              <g>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={activeColor}
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
                <circle cx={p1.x} cy={p1.y} r="4" fill={activeColor} />
                <circle cx={p2.x} cy={p2.y} r="4" fill={activeColor} />
                <g transform={`translate(${midX}, ${midY - 12})`}>
                  <rect rx="3" ry="3" x="-45" y="-10" width="90" height="20" fill="rgba(15, 23, 42, 0.95)" stroke={activeColor} strokeWidth="1" />
                  <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                    {formatMetricDistance(distUm)}
                  </text>
                </g>
              </g>
            );
          }

          // Polygon Live Preview
          if (activeTool === 'polygon') {
            const cursorScreen = currentCursorPos ? slideToScreen(currentCursorPos) : null;
            return (
              <g>
                <polyline
                  points={screenDraft.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={activeColor}
                  strokeWidth="2"
                />
                {screenDraft.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={idx === 0 ? 5 : 3.5}
                    fill={idx === 0 ? '#10b981' : activeColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}
                {cursorScreen && screenDraft.length > 0 && (
                  <line
                    x1={screenDraft[screenDraft.length - 1].x}
                    y1={screenDraft[screenDraft.length - 1].y}
                    x2={cursorScreen.x}
                    y2={cursorScreen.y}
                    stroke={activeColor}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}
              </g>
            );
          }

          // Freehand Live Preview
          if (activeTool === 'freehand') {
            return (
              <polyline
                points={screenDraft.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={activeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          }

          return null;
        })()
      )}
    </svg>
  );
};
