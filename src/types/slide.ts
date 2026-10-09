export interface SlideMetadata {
  id: string;
  caseId: string;
  slideName: string;
  patientId: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  tissueSite: string;
  clinicalDiagnosis: string;
  stainType: 'H&E' | 'IHC HER2' | 'IHC Ki-67' | 'PAS' | 'Trichrome' | 'Special';
  objectiveMagnification: '40x' | '20x' | '60x';
  scanDate: string;
  scannerModel: string;
  dimensions: {
    width: number;
    height: number;
  };
  micronsPerPixel: number; // e.g. 0.25 µm/px for 40x
  studyUid: string;
  seriesUid: string;
  sopInstanceUid: string;
  thumbnailUrl: string;
  dziUrl?: string; // Deep zoom image XML/JSON URL if available
  description: string;
  findings: string[];
}
