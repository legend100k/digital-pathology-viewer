import { SlideMetadata } from '../types/slide';

export const SAMPLE_SLIDES: SlideMetadata[] = [
  {
    id: 'slide-jp2k',
    caseId: 'CAS-APERIO-33003',
    slideName: 'JP2K-33003-1.svs',
    patientId: 'PT-A2819-F',
    patientAge: 58,
    patientGender: 'Female',
    tissueSite: 'Human Biopsy (Aperio Whole Slide)',
    clinicalDiagnosis: 'Aperio Diagnostic WSI - Converted via libvips',
    stainType: 'H&E',
    objectiveMagnification: '40x',
    scanDate: '2026-09-28 18:15 EST',
    scannerModel: 'Aperio ScanScope (SS1283)',
    dimensions: {
      width: 15374,
      height: 17497
    },
    micronsPerPixel: 0.2498,
    studyUid: '1.2.840.113619.2.33003.20260928.1',
    seriesUid: '1.2.840.113619.2.33003.20260928.2',
    sopInstanceUid: '1.2.840.113619.2.33003.20260928.3.1',
    thumbnailUrl: '/slides/converted/JP2K-33003-1/slide_files/8/0_0.jpg',
    dziUrl: '/slides/converted/JP2K-33003-1/slide.dzi',
    description: 'Authentic Aperio Whole Slide Image converted into 16-level Deep Zoom pyramid using libvips. Features calibrated 0.2498 µm/px resolution and sub-pixel annotation overlay.',
    findings: [
      'Genuine Aperio WSI pyramidal layers (Levels 0 through 15)',
      'Converted via libvips dzsave with JPEG tiles at Q=85',
      'Accurate 0.2498 µm/px optical calibration from Aperio header',
      'Supports calibrated sub-micron measurements and polygon tracing'
    ]
  },
  {
    id: 'slide-001',
    caseId: 'CAS-2026-081',
    slideName: 'Breast_InvasiveDuctal_HE_40x.svs',
    patientId: 'PT-8942-F',
    patientAge: 54,
    patientGender: 'Female',
    tissueSite: 'Left Breast, Upper Outer Quadrant',
    clinicalDiagnosis: 'Invasive Ductal Carcinoma (NST), Grade 3',
    stainType: 'H&E',
    objectiveMagnification: '40x',
    scanDate: '2026-09-18 09:24 EST',
    scannerModel: 'Aperio GT 450 (Leica Biosystems)',
    dimensions: {
      width: 76800,
      height: 52400
    },
    micronsPerPixel: 0.252,
    studyUid: '1.2.840.113619.2.345.19842.20260918.1',
    seriesUid: '1.2.840.113619.2.345.19842.20260918.2',
    sopInstanceUid: '1.2.840.113619.2.345.19842.20260918.3.1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
    description: 'High-grade invasive carcinoma with prominent nuclear pleomorphism, brisk mitotic activity (>15 per 10 HPF), and extensive desmoplastic stromal response with focal tumor necrosis.',
    findings: [
      'Infiltrating cohesive cords and solid syncytial sheets',
      'Marked nuclear enlargement with vesicular chromatin',
      'Multiple atypical mitotic figures in high-power fields',
      'Prominent tumor-infiltrating lymphocytes (TILs) at stromal boundary'
    ]
  },
  {
    id: 'slide-002',
    caseId: 'CAS-2026-104',
    slideName: 'Kidney_ClearCellRCC_PAS_40x.svs',
    patientId: 'PT-5120-M',
    patientAge: 61,
    patientGender: 'Male',
    tissueSite: 'Right Kidney, Lower Pole',
    clinicalDiagnosis: 'Clear Cell Renal Cell Carcinoma (ccRCC), ISUP Grade 2',
    stainType: 'PAS',
    objectiveMagnification: '40x',
    scanDate: '2026-09-22 14:15 EST',
    scannerModel: 'Hamamatsu NanoZoomer S360',
    dimensions: {
      width: 64200,
      height: 48600
    },
    micronsPerPixel: 0.246,
    studyUid: '1.2.840.113619.2.781.44192.20260922.1',
    seriesUid: '1.2.840.113619.2.781.44192.20260922.2',
    sopInstanceUid: '1.2.840.113619.2.781.44192.20260922.3.1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80',
    description: 'Nests and alveolar clusters of malignant epithelial cells with abundant optically clear cytoplasm, surrounded by an intricate delicate network of thin-walled sinusoidal capillaries.',
    findings: [
      'Classic chicken-wire vascular network',
      'Lipid- and glycogen-rich clear cytoplasm',
      'ISUP/WHO Grade 2 nucleoli (inconspicuous at 10x, visible at 40x)',
      'Intact renal pseudocapsule without perinephric fat invasion'
    ]
  },
  {
    id: 'slide-003',
    caseId: 'CAS-2026-149',
    slideName: 'LymphNode_FollicularHyperplasia_HE_40x.svs',
    patientId: 'PT-3309-F',
    patientAge: 32,
    patientGender: 'Female',
    tissueSite: 'Left Axillary Lymph Node',
    clinicalDiagnosis: 'Reactive Follicular Hyperplasia (Benign)',
    stainType: 'H&E',
    objectiveMagnification: '40x',
    scanDate: '2026-09-25 11:05 EST',
    scannerModel: 'Philips IntelliSite Ultra Fast Scanner',
    dimensions: {
      width: 82000,
      height: 61000
    },
    micronsPerPixel: 0.250,
    studyUid: '1.2.840.113619.2.912.11029.20260925.1',
    seriesUid: '1.2.840.113619.2.912.11029.20260925.2',
    sopInstanceUid: '1.2.840.113619.2.912.11029.20260925.3.1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
    description: 'Enlarged secondary lymphoid follicles with prominent germinal centers showing distinct polarization (dark and light zones), surrounded by well-defined mantle zones.',
    findings: [
      'Numerous tingible body macrophages with starry-sky appearance',
      'Abundant apoptotic debris in active germinal centers',
      'Well-demarcated mantle and marginal zones',
      'No clonal expansion or effacement of nodal architecture'
    ]
  },
  {
    id: 'slide-004',
    caseId: 'CAS-2026-218',
    slideName: 'Lung_Adenocarcinoma_HER2_20x.svs',
    patientId: 'PT-7814-M',
    patientAge: 68,
    patientGender: 'Male',
    tissueSite: 'Right Upper Lobe Lung Needle Core',
    clinicalDiagnosis: 'Lung Adenocarcinoma, Acinar & Micropapillary Pattern',
    stainType: 'IHC HER2',
    objectiveMagnification: '20x',
    scanDate: '2026-09-30 16:40 EST',
    scannerModel: 'Aperio AT2 DX (Leica Biosystems)',
    dimensions: {
      width: 54000,
      height: 42000
    },
    micronsPerPixel: 0.504,
    studyUid: '1.2.840.113619.2.664.99281.20260930.1',
    seriesUid: '1.2.840.113619.2.664.99281.20260930.2',
    sopInstanceUid: '1.2.840.113619.2.664.99281.20260930.3.1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
    description: 'Invasive adenocarcinoma of pulmonary origin exhibiting malignant glandular formations and non-attached micropapillary tufts with moderate nuclear atypia.',
    findings: [
      'Membranous HER2 brown chromogen positivity in >10% tumor cells (Score 2+)',
      'Micropapillary clusters associated with high metastatic potential',
      'Intra-alveolar tumor spread (STAS) identified at periphery'
    ]
  },
  {
    id: 'slide-005',
    caseId: 'CAS-2026-305',
    slideName: 'Brain_Glioblastoma_HE_40x.svs',
    patientId: 'PT-9931-F',
    patientAge: 59,
    patientGender: 'Female',
    tissueSite: 'Left Temporal Lobe Resection',
    clinicalDiagnosis: 'Glioblastoma, IDH-wildtype, WHO CNS Grade 4',
    stainType: 'H&E',
    objectiveMagnification: '40x',
    scanDate: '2026-10-02 10:18 EST',
    scannerModel: 'Hamamatsu NanoZoomer S360',
    dimensions: {
      width: 88000,
      height: 66000
    },
    micronsPerPixel: 0.245,
    studyUid: '1.2.840.113619.2.883.33291.20261002.1',
    seriesUid: '1.2.840.113619.2.883.33291.20261002.2',
    sopInstanceUid: '1.2.840.113619.2.883.33291.20261002.3.1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80',
    description: 'Markedly cellular astrocytic neoplasm exhibiting nuclear pleomorphism, microvascular proliferation (glomeruloid tufts), and geographic pseudopalisading necrosis.',
    findings: [
      'Pseudopalisading necrosis with hypercellular tumor rim',
      'Microvascular endothelial proliferation forming glomeruloid bodies',
      'Extensive mitotic figures and marked cytologic anaplasia',
      'Infiltration into adjacent cerebral cortex'
    ]
  }
];
