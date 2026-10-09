import { Annotation } from '../types/annotation';

export const INITIAL_ANNOTATIONS: Annotation[] = [
  // Slide 1: Breast IDC
  {
    id: 'ann-001',
    slideId: 'slide-001',
    type: 'freehand',
    label: 'Primary Tumor Margin',
    category: 'malignant',
    color: '#ef4444',
    notes: 'Infiltrative invasive ductal carcinoma border advancing into adjacent mammary fat pad.',
    points: [
      { x: 32000, y: 21000 },
      { x: 35000, y: 21500 },
      { x: 38000, y: 23000 },
      { x: 41000, y: 26000 },
      { x: 40500, y: 31000 },
      { x: 37000, y: 34000 },
      { x: 33000, y: 33500 },
      { x: 31000, y: 28000 },
      { x: 32000, y: 21000 }
    ],
    areaMicronsSquare: 112500000,
    isVisible: true,
    createdAt: '2026-09-18 10:15 EST',
    updatedAt: '2026-09-18 10:15 EST'
  },
  {
    id: 'ann-002',
    slideId: 'slide-001',
    type: 'point',
    label: 'Atypical Mitotic Figure',
    category: 'mitosis',
    color: '#eab308',
    notes: 'Tripolar mitotic spindle identified in high-power field (40x objective).',
    points: [{ x: 36500, y: 27200 }],
    isVisible: true,
    createdAt: '2026-09-18 10:22 EST',
    updatedAt: '2026-09-18 10:22 EST'
  },
  {
    id: 'ann-003',
    slideId: 'slide-001',
    type: 'rectangle',
    label: 'Central Comedonecrosis Zone',
    category: 'necrosis',
    color: '#8b5cf6',
    notes: 'Eosinophilic amorphous cellular debris with karyorrhectic nuclear dust.',
    points: [
      { x: 34000, y: 25000 },
      { x: 37500, y: 28000 }
    ],
    widthMicrons: 882,
    heightMicrons: 756,
    areaMicronsSquare: 666792,
    isVisible: true,
    createdAt: '2026-09-18 10:28 EST',
    updatedAt: '2026-09-18 10:28 EST'
  },
  {
    id: 'ann-004',
    slideId: 'slide-001',
    type: 'ruler',
    label: 'Distance to Surgical Margin',
    category: 'measurement',
    color: '#06b6d4',
    notes: 'Clear radial margin of resection measured from leading tumor cell to inked surface.',
    points: [
      { x: 41000, y: 26000 },
      { x: 48500, y: 24500 }
    ],
    lengthMicrons: 1928,
    isVisible: true,
    createdAt: '2026-09-18 10:35 EST',
    updatedAt: '2026-09-18 10:35 EST'
  },

  // Slide 2: Kidney ccRCC
  {
    id: 'ann-005',
    slideId: 'slide-002',
    type: 'polygon',
    label: 'Clear Cell Nests with Capillary Mesh',
    category: 'malignant',
    color: '#ef4444',
    notes: 'Abundant lipid-laden clear cytoplasm enclosed by delicate capillary network.',
    points: [
      { x: 28000, y: 19000 },
      { x: 33000, y: 18500 },
      { x: 36000, y: 22000 },
      { x: 34000, y: 26000 },
      { x: 29000, y: 25000 },
      { x: 27500, y: 21500 }
    ],
    areaMicronsSquare: 82500000,
    isVisible: true,
    createdAt: '2026-09-22 15:10 EST',
    updatedAt: '2026-09-22 15:10 EST'
  },
  {
    id: 'ann-006',
    slideId: 'slide-002',
    type: 'ruler',
    label: 'Maximum Nest Diameter',
    category: 'measurement',
    color: '#06b6d4',
    notes: 'Tumor nest width across sinusoidal network.',
    points: [
      { x: 30000, y: 20000 },
      { x: 34500, y: 23500 }
    ],
    lengthMicrons: 1402,
    isVisible: true,
    createdAt: '2026-09-22 15:14 EST',
    updatedAt: '2026-09-22 15:14 EST'
  },

  // Slide 3: Reactive Lymph Node
  {
    id: 'ann-007',
    slideId: 'slide-003',
    type: 'polygon',
    label: 'Polarized Germinal Center',
    category: 'benign',
    color: '#10b981',
    notes: 'Preserved light and dark zones with starry sky tingible-body macrophages.',
    points: [
      { x: 38000, y: 26000 },
      { x: 44000, y: 25000 },
      { x: 47000, y: 30000 },
      { x: 43000, y: 35000 },
      { x: 37000, y: 32000 }
    ],
    areaMicronsSquare: 98000000,
    isVisible: true,
    createdAt: '2026-09-25 11:40 EST',
    updatedAt: '2026-09-25 11:40 EST'
  }
];
