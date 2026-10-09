import React from 'react';
import { useViewerStore } from '../../store/useViewerStore';
import { Sliders, RotateCcw, Sun, Contrast, Droplets, FlipHorizontal } from 'lucide-react';

export const ImageAdjustments: React.FC = () => {
  const { 
    activeViewportId, 
    viewports, 
    updateViewportFilters, 
    resetViewportFilters 
  } = useViewerStore();

  const activeVp = viewports.find((v) => v.id === activeViewportId) || viewports[0];
  const { filters } = activeVp;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5 select-none text-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Sliders className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Microscope Optics & Contrast
          </h3>
        </div>
        <button
          onClick={() => resetViewportFilters(activeViewportId)}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
          title="Reset to default"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Brightness */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Brightness</span>
          </span>
          <span className="font-mono text-cyan-400 text-xs">{filters.brightness}%</span>
        </div>
        <input
          type="range"
          min="40"
          max="160"
          value={filters.brightness}
          onChange={(e) =>
            updateViewportFilters(activeViewportId, {
              brightness: parseInt(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Contrast className="w-3.5 h-3.5 text-indigo-400" />
            <span>Contrast</span>
          </span>
          <span className="font-mono text-cyan-400 text-xs">{filters.contrast}%</span>
        </div>
        <input
          type="range"
          min="40"
          max="180"
          value={filters.contrast}
          onChange={(e) =>
            updateViewportFilters(activeViewportId, {
              contrast: parseInt(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      {/* Saturation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Droplets className="w-3.5 h-3.5 text-pink-400" />
            <span>Stain Saturation</span>
          </span>
          <span className="font-mono text-cyan-400 text-xs">{filters.saturation}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={filters.saturation}
          onChange={(e) =>
            updateViewportFilters(activeViewportId, {
              saturation: parseInt(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      {/* Invert Staining (E.g. darkfield / fluorescence visualization) */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-300 flex items-center space-x-1.5">
          <FlipHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Invert Color Channels</span>
        </span>
        <button
          onClick={() =>
            updateViewportFilters(activeViewportId, {
              invert: !filters.invert,
            })
          }
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
            filters.invert
              ? 'bg-cyan-600 border-cyan-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          {filters.invert ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};
