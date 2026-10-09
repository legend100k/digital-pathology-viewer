import React, { useState } from 'react';
import { 
  Hand, 
  ZoomIn, 
  ZoomOut, 
  MapPin, 
  Square, 
  Pentagon, 
  Pencil, 
  Ruler, 
  Minus,
  Type,
  RotateCw, 
  RotateCcw,
  RefreshCw, 
  Check
} from 'lucide-react';
import { useViewerStore } from '../../store/useViewerStore';
import { ViewerTool } from '../../types/viewer';
import { ClinicalCategory } from '../../types/annotation';

const CLINICAL_CATEGORIES: { 
  category: ClinicalCategory; 
  label: string; 
  color: string; 
  description: string;
}[] = [
  { category: 'malignant', label: 'Malignant / Tumor', color: '#ef4444', description: 'Invasive carcinoma, atypical nests' },
  { category: 'suspicious', label: 'Suspicious / Atypia', color: '#f59e0b', description: 'Dysplasia, border zones' },
  { category: 'benign', label: 'Benign / Normal', color: '#10b981', description: 'Normal tissue, reactive centers' },
  { category: 'mitosis', label: 'Mitotic Figure', color: '#eab308', description: 'Chromatin condensation, spindles' },
  { category: 'necrosis', label: 'Necrosis', color: '#8b5cf6', description: 'Infarction, karyorrhexis' },
  { category: 'stroma', label: 'Stroma / Connective', color: '#06b6d4', description: 'Desmoplasia, collagen fibers' },
  { category: 'measurement', label: 'Margin / Measurement', color: '#3b82f6', description: 'Surgical clearance, tumor size' },
];

export const PrimaryToolbar: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool, 
    activeCategory, 
    setActiveCategory, 
    activeColor, 
    setActiveColor, 
    activeViewportId,
    updateViewportTransform,
    viewports,
    resetViewportView,
    rotateViewport
  } = useViewerStore();

  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const activeVp = viewports.find((v) => v.id === activeViewportId) || viewports[0];

  const handleZoom = (factor: number) => {
    const currentZoom = activeVp.transform.zoom;
    const newZoom = Math.min(40, Math.max(0.8, currentZoom * factor));
    updateViewportTransform(activeViewportId, { zoom: newZoom });
  };

  const handleSelectCategory = (cat: typeof CLINICAL_CATEGORIES[0]) => {
    setActiveCategory(cat.category);
    setActiveColor(cat.color);
    setColorPickerOpen(false);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-1.5 space-x-1 select-none text-slate-200">
      {/* Navigation Tools */}
      <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-800">
        <button
          onClick={() => setActiveTool('pan')}
          title="Pan / Navigate Tool (Spacebar or Drag)"
          className={`p-2 rounded-lg transition-all flex items-center justify-center ${
            activeTool === 'pan'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Hand className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(1.35)}
          title="Zoom In (+)"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(0.74)}
          title="Zoom Out (-)"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Pathology Annotation & Measurement Tools */}
      <div className="flex items-center space-x-1 px-1.5 border-r border-slate-800">
        <button
          onClick={() => setActiveTool('point')}
          title="Point Marker (P) — Mitosis, Calcification, Single Cell"
          className={`p-2 rounded-lg transition-all relative ${
            activeTool === 'point'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span 
            className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 border border-slate-900" 
            style={{ backgroundColor: activeColor }}
          />
        </button>

        <button
          onClick={() => setActiveTool('rectangle')}
          title="Rectangle Region (R) — Bounding Box with Width & Height"
          className={`p-2 rounded-lg transition-all relative ${
            activeTool === 'rectangle'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Square className="w-4 h-4" />
          <span 
            className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 border border-slate-900" 
            style={{ backgroundColor: activeColor }}
          />
        </button>

        <button
          onClick={() => setActiveTool('polygon')}
          title="Polygon Perimeter (L) — Multi-vertex Area (Click points, Double-click to finish)"
          className={`p-2 rounded-lg transition-all relative ${
            activeTool === 'polygon'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Pentagon className="w-4 h-4" />
          <span 
            className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 border border-slate-900" 
            style={{ backgroundColor: activeColor }}
          />
        </button>

        <button
          onClick={() => setActiveTool('freehand')}
          title="Freehand Contour (F) — Smooth Pen for Tumor Margins"
          className={`p-2 rounded-lg transition-all relative ${
            activeTool === 'freehand'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Pencil className="w-4 h-4" />
          <span 
            className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 border border-slate-900" 
            style={{ backgroundColor: activeColor }}
          />
        </button>

        <button
          onClick={() => setActiveTool('line')}
          title="Line Segment — Direct Distance Vector"
          className={`p-2 rounded-lg transition-all relative ${
            activeTool === 'line'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Minus className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 bg-cyan-400 border border-slate-900" />
        </button>

        <button
          onClick={() => setActiveTool('ruler')}
          title="Calibrated Caliper Ruler (M) — Measure in µm / mm"
          className={`p-2 rounded-lg transition-all relative ${
            activeTool === 'ruler'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 bg-blue-400 border border-slate-900" />
        </button>

        <button
          onClick={() => setActiveTool('text')}
          title="Text Note (T) — Place Clinical Finding Callout"
          className={`p-2 rounded-lg transition-all relative ${
            activeTool === 'text'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Type className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 bg-amber-400 border border-slate-900" />
        </button>
      </div>

      {/* Clinical Taxonomy & Color Selector */}
      <div className="relative px-1 border-r border-slate-800">
        <button
          onClick={() => setColorPickerOpen(!colorPickerOpen)}
          title={`Annotation Class: ${activeCategory.toUpperCase()} (Click to change)`}
          className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/60 transition-colors"
        >
          <span
            className="w-3.5 h-3.5 rounded-full shadow-sm border border-white/20"
            style={{ backgroundColor: activeColor }}
          />
          <span className="capitalize font-medium text-[11px] hidden sm:inline">
            {activeCategory}
          </span>
        </button>

        {/* Dropdown Menu for Categories */}
        {colorPickerOpen && (
          <div className="absolute top-12 left-0 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-200">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 py-1 mb-1">
              Pathology Classification
            </div>
            <div className="space-y-1">
              {CLINICAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => handleSelectCategory(cat)}
                  className={`w-full flex items-start space-x-2.5 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    activeCategory === cat.category
                      ? 'bg-slate-800 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 border border-white/30"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs flex items-center justify-between">
                      <span>{cat.label}</span>
                      {activeCategory === cat.category && (
                        <Check className="w-3 h-3 text-cyan-400" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {cat.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rotation & Reset Controls */}
      <div className="flex items-center space-x-1 pl-1">
        <button
          onClick={() => rotateViewport(activeViewportId, -90)}
          title="Rotate 90° Counter-Clockwise"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => rotateViewport(activeViewportId, 90)}
          title="Rotate 90° Clockwise"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => resetViewportView(activeViewportId)}
          title="Reset View to Overview (Esc)"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
