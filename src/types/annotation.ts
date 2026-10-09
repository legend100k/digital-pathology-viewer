export type AnnotationType = 
  | 'point' 
  | 'rectangle' 
  | 'polygon' 
  | 'line' 
  | 'ruler' 
  | 'freehand' 
  | 'text';

export type ClinicalCategory = 
  | 'malignant' 
  | 'suspicious' 
  | 'benign' 
  | 'stroma' 
  | 'necrosis' 
  | 'mitosis' 
  | 'measurement'
  | 'general';

export interface Point2D {
  x: number; // In baseline slide image coordinates [0, width]
  y: number; // In baseline slide image coordinates [0, height]
}

export interface CalibrationProfile {
  mppX: number;
  mppY: number;
  isCalibrated: boolean;
  source: 'SCANNER_METADATA' | 'RETICLE_MANUAL' | 'DEFAULT_FALLBACK';
}

export interface Annotation {
  id: string;
  slideId: string;
  type: AnnotationType;
  label: string;
  category: ClinicalCategory;
  color: string;
  notes?: string;
  points: Point2D[]; // In native image pixel coordinates
  isVisible: boolean;
  isLocked?: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Text label support
  textContent?: string;
  fontSize?: number;

  // Calibrated measurements
  pixelDistance?: number;
  lengthMicrons?: number; // Line / ruler measurement in µm
  lengthMillimeters?: number; // In mm
  areaMicronsSquare?: number; // For polygon, rect, freehand in µm²
  areaMillimetersSquare?: number;
  widthMicrons?: number; // For rect in µm
  heightMicrons?: number; // For rect in µm
  isCalibrated?: boolean;
}

export interface AnnotationFilter {
  category: ClinicalCategory | 'all';
  searchQuery: string;
  visibleOnly: boolean;
  typeFilter?: AnnotationType | 'all';
}
