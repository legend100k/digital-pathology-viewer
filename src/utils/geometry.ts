import { Point2D } from '../types/annotation';

export function calculateDistanceMicrons(p1: Point2D, p2: Point2D, mpp: number): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const pixelDist = Math.sqrt(dx * dx + dy * dy);
  return pixelDist * mpp;
}

export function formatMicrons(microns: number): string {
  if (microns >= 1000) {
    return `${(microns / 1000).toFixed(2)} mm`;
  }
  return `${Math.round(microns)} µm`;
}

export function formatArea(areaSquareMicrons: number): string {
  if (areaSquareMicrons >= 1_000_000) {
    return `${(areaSquareMicrons / 1_000_000).toFixed(2)} mm²`;
  }
  return `${Math.round(areaSquareMicrons).toLocaleString()} µm²`;
}

// Shoelace formula for polygon area
export function calculatePolygonAreaMicrons(points: Point2D[], mpp: number): number {
  if (points.length < 3) return 0;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  const pixelArea = Math.abs(area) / 2;
  return pixelArea * (mpp * mpp);
}

export function calculateRectDimensions(p1: Point2D, p2: Point2D, mpp: number) {
  const widthPx = Math.abs(p2.x - p1.x);
  const heightPx = Math.abs(p2.y - p1.y);
  const widthMicrons = widthPx * mpp;
  const heightMicrons = heightPx * mpp;
  const areaMicronsSquare = widthMicrons * heightMicrons;
  return {
    widthMicrons,
    heightMicrons,
    areaMicronsSquare,
    topLeft: {
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y)
    },
    bottomRight: {
      x: Math.max(p1.x, p2.x),
      y: Math.max(p1.y, p2.y)
    }
  };
}
