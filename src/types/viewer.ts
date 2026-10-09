export type ViewerLayout = '1x1' | '1x2' | '2x2';

export type ViewerTool = 
  | 'pan' 
  | 'zoomIn' 
  | 'zoomOut' 
  | 'point' 
  | 'rectangle' 
  | 'polygon' 
  | 'line'
  | 'freehand' 
  | 'ruler'
  | 'text';

export interface ViewportTransform {
  zoom: number; // 1.0 = fit slide, up to 40x
  center: { x: number; y: number }; // normalized 0 to 1
  rotation: number; // degrees 0, 90, 180, 270 or arbitrary
}

export interface ImageFilters {
  brightness: number; // 50 to 150 (default 100)
  contrast: number;   // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  gamma: number;      // 0.5 to 2.0 (default 1.0)
  invert: boolean;    // false
}

export interface ViewportInstance {
  id: string; // e.g., 'viewport-1', 'viewport-2', etc.
  slideId: string;
  transform: ViewportTransform;
  filters: ImageFilters;
  isLoading: boolean;
}
