import OpenSeadragon from 'openseadragon';
import { Point2D } from '../types/annotation';

// Ensure OpenSeadragon is accessible globally
if (typeof window !== 'undefined') {
  (window as any).OpenSeadragon = OpenSeadragon;
}

export interface SlideDimensions {
  width: number;
  height: number;
}

export interface ViewportBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Transforms native Slide Image Pixel coordinates to Client Screen pixels
 * using the active OpenSeadragon viewer instance.
 */
export function imageToScreenOSD(
  imagePoint: Point2D,
  osdViewer: any,
  dimensions: SlideDimensions
): Point2D {
  if (!osdViewer || !osdViewer.viewport) {
    return { x: 0, y: 0 };
  }

  try {
    // 1. Try high-precision TiledImage API if available
    const tiledImage = osdViewer.world && osdViewer.world.getItemCount() > 0
      ? osdViewer.world.getItemAt(0)
      : null;

    if (tiledImage && typeof tiledImage.imageToViewerElementCoordinates === 'function') {
      const osdPt = new OpenSeadragon.Point(imagePoint.x, imagePoint.y);
      const pixel = tiledImage.imageToViewerElementCoordinates(osdPt);
      return { x: pixel.x, y: pixel.y };
    }

    // 2. Viewport API fallback
    const osdPt = new OpenSeadragon.Point(imagePoint.x, imagePoint.y);
    const vpPoint = osdViewer.viewport.imageToViewportCoordinates(osdPt);
    const pixel = osdViewer.viewport.pixelFromPoint(vpPoint, true);
    return { x: pixel.x, y: pixel.y };
  } catch (err) {
    // 3. Mathematical fallback if OSD is in transient layout transition
    const zoom = osdViewer.viewport.getZoom(true) || 1.0;
    const center = osdViewer.viewport.getCenter(true) || { x: 0.5, y: 0.5 };
    const containerSize = osdViewer.viewport.getContainerSize() || { x: 800, y: 600 };

    const normX = imagePoint.x / dimensions.width;
    const normY = imagePoint.y / dimensions.width;
    const screenX = (normX - center.x) * zoom * containerSize.x + containerSize.x / 2;
    const screenY = (normY - center.y) * zoom * containerSize.x + containerSize.y / 2;
    return { x: screenX, y: screenY };
  }
}

/**
 * Transforms Client Screen pixels (relative to viewer container) to native Slide Image Pixels.
 */
export function screenToImageOSD(
  screenPoint: Point2D,
  osdViewer: any,
  dimensions: SlideDimensions
): Point2D {
  if (!osdViewer || !osdViewer.viewport) {
    return { x: 0, y: 0 };
  }

  try {
    const osdPixel = new OpenSeadragon.Point(screenPoint.x, screenPoint.y);

    // 1. Try high-precision TiledImage API if available
    const tiledImage = osdViewer.world && osdViewer.world.getItemCount() > 0
      ? osdViewer.world.getItemAt(0)
      : null;

    if (tiledImage && typeof tiledImage.viewerElementToImageCoordinates === 'function') {
      const imgPoint = tiledImage.viewerElementToImageCoordinates(osdPixel);
      return {
        x: Math.max(0, Math.min(dimensions.width, imgPoint.x)),
        y: Math.max(0, Math.min(dimensions.height, imgPoint.y)),
      };
    }

    // 2. Viewport API fallback
    const vpPoint = osdViewer.viewport.pointFromPixel(osdPixel, true);
    const imgPoint = osdViewer.viewport.viewportToImageCoordinates(vpPoint);

    return {
      x: Math.max(0, Math.min(dimensions.width, imgPoint.x)),
      y: Math.max(0, Math.min(dimensions.height, imgPoint.y)),
    };
  } catch (err) {
    // 3. Mathematical fallback
    const zoom = osdViewer.viewport.getZoom(true) || 1.0;
    const center = osdViewer.viewport.getCenter(true) || { x: 0.5, y: 0.5 };
    const containerSize = osdViewer.viewport.getContainerSize() || { x: 800, y: 600 };

    const normX = (screenPoint.x - containerSize.x / 2) / (zoom * containerSize.x) + center.x;
    const normY = (screenPoint.y - containerSize.y / 2) / (zoom * containerSize.x) + center.y;

    return {
      x: Math.max(0, Math.min(dimensions.width, normX * dimensions.width)),
      y: Math.max(0, Math.min(dimensions.height, normY * dimensions.width)),
    };
  }
}

/**
 * Calculates Euclidean distance in image pixel space.
 */
export function calculatePixelDistance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates physically calibrated distance in micrometers (µm)
 * considering anisotropic sensor pixel pitch (mppX vs mppY).
 */
export function calculateCalibratedDistanceMicrons(
  p1: Point2D,
  p2: Point2D,
  mppX: number,
  mppY: number = mppX
): number {
  const dx = (p2.x - p1.x) * mppX;
  const dy = (p2.y - p1.y) * mppY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates calibrated polygon area using Shoelace formula in square micrometers (µm²).
 */
export function calculateCalibratedAreaMicrons(
  points: Point2D[],
  mppX: number,
  mppY: number = mppX
): number {
  if (points.length < 3) return 0;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  const pixelArea = Math.abs(area) / 2;
  return pixelArea * (mppX * mppY);
}

/**
 * Formats calibrated distance according to standard pathology conventions.
 * If distance >= 1000 µm, renders in millimeters (mm).
 */
export function formatMetricDistance(
  microns: number,
  isCalibrated: boolean = true
): string {
  if (!isCalibrated) {
    return `${Math.round(microns)} px`;
  }
  if (microns >= 1000) {
    return `${(microns / 1000).toFixed(2)} mm`;
  }
  return `${microns < 10 ? microns.toFixed(2) : Math.round(microns)} µm`;
}

/**
 * Formats calibrated area according to standard pathology conventions.
 */
export function formatMetricArea(
  areaMicrons2: number,
  isCalibrated: boolean = true
): string {
  if (!isCalibrated) {
    return `${Math.round(areaMicrons2).toLocaleString()} px²`;
  }
  if (areaMicrons2 >= 1_000_000) {
    return `${(areaMicrons2 / 1_000_000).toFixed(2)} mm²`;
  }
  return `${Math.round(areaMicrons2).toLocaleString()} µm²`;
}
