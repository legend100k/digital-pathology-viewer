import React from 'react';
import { useViewerStore } from '../../store/useViewerStore';

const MAGNIFICATIONS = [
  { label: '1.25x', value: 1.0, sub: 'Macro' },
  { label: '2.5x', value: 2.0, sub: 'Scan' },
  { label: '5x', value: 4.0, sub: 'Low' },
  { label: '10x', value: 8.0, sub: 'Med' },
  { label: '20x', value: 16.0, sub: 'High' },
  { label: '40x', value: 32.0, sub: 'Cellular' },
];

export const MagnificationBar: React.FC = () => {
  const { 
    activeViewportId, 
    viewports, 
    updateViewportTransform 
  } = useViewerStore();

  const activeVp = viewports.find((v) => v.id === activeViewportId) || viewports[0];
  const currentZoom = activeVp.transform.zoom;

  // Calculate approximate optical magnification string based on zoom (1.0 = 1.25x)
  const opticalMag = (currentZoom * 1.25).toFixed(1);

  const handleSetMagnification = (zoomValue: number) => {
    updateViewportTransform(activeViewportId, { zoom: zoomValue });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    updateViewportTransform(activeViewportId, { zoom: val });
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl px-3 py-1.5 space-x-3 select-none text-slate-200">
      {/* Current Objective Readout */}
      <div className="flex items-center space-x-1.5 pr-2 border-r border-slate-800">
        <span className="text-[11px] text-slate-400 font-medium">Power:</span>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/50">
          {opticalMag}x
        </span>
      </div>

      {/* Preset Objective Pills */}
      <div className="flex items-center space-x-1">
        {MAGNIFICATIONS.map((mag) => {
          // Check if current zoom is close to this preset
          const isSelected = Math.abs(currentZoom - mag.value) < 0.6;

          return (
            <button
              key={mag.label}
              onClick={() => handleSetMagnification(mag.value)}
              title={`${mag.label} (${mag.sub})`}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>{mag.label}</span>
              <span className="text-[9px] text-slate-400 ml-1 hidden md:inline">
                {mag.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Smooth Zoom Slider */}
      <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-800">
        <input
          type="range"
          min="0.8"
          max="40"
          step="0.2"
          value={currentZoom}
          onChange={handleSliderChange}
          className="w-24 cursor-pointer"
          title="Continuous Zoom Slider"
        />
      </div>

      {/* Rotation Display if non-zero */}
      {activeVp.transform.rotation !== 0 && (
        <div className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
          {activeVp.transform.rotation}°
        </div>
      )}
    </div>
  );
};
