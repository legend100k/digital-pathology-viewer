import React from 'react';
import { formatMicrons } from '../../utils/geometry';

interface ScaleBarProps {
  zoom: number;
  micronsPerPixel: number;
  viewportWidth: number;
}

export const ScaleBar: React.FC<ScaleBarProps> = ({ zoom, micronsPerPixel, viewportWidth }) => {
  // Approximate slide dimension displayed in canvas
  // When zoom = 1, current scale spans base dimension (~viewportWidth * 0.85)
  const effectiveMpp = micronsPerPixel / zoom;

  // We want a scale bar that is roughly 80 to 140 pixels wide on screen
  const targetPixels = 100;
  const targetMicrons = targetPixels * effectiveMpp;

  // Nice round numbers for scale: 10, 20, 50, 100, 250, 500, 1000, 2500, 5000, etc.
  const niceSteps = [
    5, 10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000
  ];

  let selectedMicrons = niceSteps[0];
  for (const step of niceSteps) {
    if (step <= targetMicrons) {
      selectedMicrons = step;
    } else {
      break;
    }
  }

  // Calculate actual pixel width for this round number
  const barPixelWidth = Math.max(30, Math.min(200, selectedMicrons / effectiveMpp));

  return (
    <div className="absolute bottom-4 left-4 z-10 select-none pointer-events-none bg-slate-900/85 backdrop-blur-sm border border-slate-700/70 rounded-md px-2.5 py-1 text-slate-200 shadow-lg">
      <div className="flex flex-col items-center">
        <div className="text-[10px] font-mono font-semibold text-slate-300 mb-0.5 tracking-wider">
          {formatMicrons(selectedMicrons)}
        </div>
        <div
          className="h-1 bg-white border-x-2 border-white relative"
          style={{ width: `${barPixelWidth}px` }}
        />
      </div>
    </div>
  );
};
