import React, { useRef, useEffect, useState, useCallback } from 'react';
import OpenSeadragon from 'openseadragon';
import { ViewportInstance } from '../../types/viewer';
import { useSlideStore } from '../../store/useSlideStore';
import { useViewerStore } from '../../store/useViewerStore';
import { createSlideTileSource } from '../../utils/tileSourceFactory';
import { AnnotationOverlay } from './AnnotationOverlay';
import { MinimapNavigator } from './MinimapNavigator';
import { ScaleBar } from './ScaleBar';
import { Loader2, ChevronDown, Check } from 'lucide-react';

interface WsiViewportProps {
  viewport: ViewportInstance;
  isMultiView: boolean;
  isActive: boolean;
}

export const WsiViewport: React.FC<WsiViewportProps> = ({
  viewport,
  isMultiView,
  isActive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osdContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  const { slides, getSlideById } = useSlideStore();
  const slide = getSlideById(viewport.slideId) || slides[0];

  const {
    activeTool,
    updateViewportTransform,
    setActiveViewportId,
    setViewportSlide,
  } = useViewerStore();

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [osdViewer, setOsdViewer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);
  const [viewportTick, setViewportTick] = useState(0);

  // ResizeObserver to track container dimension changes
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize OpenSeadragon Viewer
  useEffect(() => {
    if (!osdContainerRef.current) return;

    setIsLoading(true);

    const viewer = OpenSeadragon({
      element: osdContainerRef.current,
      prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images/',
      tileSources: createSlideTileSource(slide),
      showNavigationControl: false,
      showNavigator: false,
      animationTime: 0.25,
      springStiffness: 14.0,
      blendTime: 0.1,
      constrainDuringPan: true,
      visibilityRatio: 0.85,
      minZoomLevel: 0.4,
      maxZoomPixelRatio: 4.0,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: false,
      },
    });

    viewerRef.current = viewer;
    setOsdViewer(viewer);

    viewer.addHandler('open', () => {
      setIsLoading(false);
      // Fit to initial view
      const zoom = viewer.viewport.getZoom(true);
      const center = viewer.viewport.getCenter(true);
      updateViewportTransform(viewport.id, {
        zoom: zoom || 1.0,
        center: { x: center.x || 0.5, y: center.y || 0.5 },
      });
      setViewportTick((t) => t + 1);
    });

    viewer.addHandler('update-viewport', () => {
      const zoom = viewer.viewport.getZoom(true);
      const center = viewer.viewport.getCenter(true);
      updateViewportTransform(viewport.id, {
        zoom: zoom,
        center: { x: center.x, y: center.y },
      });
      setViewportTick((t) => t + 1);
    });

    viewer.addHandler('animation', () => {
      setViewportTick((t) => t + 1);
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
      setOsdViewer(null);
    };
  }, [viewport.id]);

  // Handle slide change
  useEffect(() => {
    if (viewerRef.current && slide) {
      setIsLoading(true);
      viewerRef.current.open(createSlideTileSource(slide));
    }
  }, [slide.id]);

  // Toggle navigation mode depending on active tool
  useEffect(() => {
    if (!viewerRef.current) return;
    const isPanTool = activeTool === 'pan';
    viewerRef.current.setMouseNavEnabled(isPanTool);
  }, [activeTool]);

  // Handle rotation
  useEffect(() => {
    if (!viewerRef.current || !viewerRef.current.viewport) return;
    viewerRef.current.viewport.setRotation(viewport.transform.rotation);
  }, [viewport.transform.rotation]);

  // CSS Image Filters for clinical enhancements
  const filterStyle: React.CSSProperties = {
    filter: `
      brightness(${viewport.filters.brightness}%)
      contrast(${viewport.filters.contrast}%)
      saturate(${viewport.filters.saturation}%)
      ${viewport.filters.invert ? 'invert(100%)' : ''}
    `,
  };

  return (
    <div
      ref={containerRef}
      onClick={() => setActiveViewportId(viewport.id)}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none transition-all ${
        isActive && isMultiView ? 'ring-2 ring-cyan-500 z-10' : ''
      }`}
    >
      {/* Comparative Viewport Header */}
      {isMultiView && (
        <div className="absolute top-2 left-2 z-20 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
          <div className="relative">
            <button
              onClick={() => setSlideMenuOpen(!slideMenuOpen)}
              className="flex items-center space-x-1.5 text-xs font-medium text-slate-200 hover:text-white"
            >
              <span className="truncate max-w-[150px]">{slide.caseId}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800">
                {slide.stainType}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {slideMenuOpen && (
              <div className="absolute top-7 left-0 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 z-50 text-slate-200">
                {slides.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setViewportSlide(viewport.id, s.id);
                      setSlideMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-xs hover:bg-slate-800 ${
                      s.id === slide.id ? 'bg-slate-800 font-semibold text-cyan-300' : ''
                    }`}
                  >
                    <div>
                      <div className="font-mono">{s.caseId}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.tissueSite}</div>
                    </div>
                    {s.id === slide.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-2 select-none">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs font-medium text-slate-300 tracking-wide">
            Streaming High-Resolution DZI Tiles...
          </span>
        </div>
      )}

      {/* OpenSeadragon Native Viewport Container */}
      <div
        ref={osdContainerRef}
        style={filterStyle}
        className="w-full h-full block bg-slate-950"
      />

      {/* Sub-Pixel Vector Annotation & Measurement Layer */}
      <AnnotationOverlay
        slide={slide}
        transform={viewport.transform}
        viewportWidth={dimensions.width}
        viewportHeight={dimensions.height}
        activeTool={activeTool}
        osdViewer={osdViewer}
        viewportTick={viewportTick}
      />

      {/* Calibrated Metric Scale Bar */}
      <ScaleBar
        zoom={viewport.transform.zoom}
        micronsPerPixel={slide.micronsPerPixel}
        viewportWidth={dimensions.width}
      />

      {/* Synchronized Slide Minimap Navigator */}
      <MinimapNavigator
        slide={slide}
        transform={viewport.transform}
        onNavigate={(newCenter) => {
          if (viewerRef.current && viewerRef.current.viewport) {
            viewerRef.current.viewport.panTo(
              new OpenSeadragon.Point(newCenter.x, newCenter.y),
              false
            );
          }
          updateViewportTransform(viewport.id, { center: newCenter });
        }}
      />
    </div>
  );
};
