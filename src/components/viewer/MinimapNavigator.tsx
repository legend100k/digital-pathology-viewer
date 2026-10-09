import React, { useRef } from 'react';
import { SlideMetadata } from '../../types/slide';
import { ViewportTransform } from '../../types/viewer';

interface MinimapNavigatorProps {
  slide: SlideMetadata;
  transform: ViewportTransform;
  onNavigate: (newCenter: { x: number; y: number }) => void;
}

export const MinimapNavigator: React.FC<MinimapNavigatorProps> = ({
  slide,
  transform,
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport box dimensions in percentage:
  // When zoom = 1, viewport shows entire slide (100% width/height)
  // When zoom = 10, viewport shows 10% of slide
  const boxWidthPercent = Math.min(100, Math.max(8, 100 / transform.zoom));
  const boxHeightPercent = Math.min(100, Math.max(8, 100 / transform.zoom));

  // The center is in normalized (0 to 1) coordinates
  const boxLeftPercent = Math.min(
    100 - boxWidthPercent,
    Math.max(0, transform.center.x * 100 - boxWidthPercent / 2)
  );
  const boxTopPercent = Math.min(
    100 - boxHeightPercent,
    Math.max(0, transform.center.y * 100 - boxHeightPercent / 2)
  );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;
    onNavigate({
      x: Math.max(0, Math.min(1, clickX)),
      y: Math.max(0, Math.min(1, clickY)),
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      title="Slide Minimap Overview — Click or drag to jump"
      className="absolute bottom-4 right-4 z-10 w-36 h-28 bg-slate-900/90 border border-slate-700/80 rounded-lg shadow-xl overflow-hidden cursor-crosshair select-none group backdrop-blur-sm"
    >
      {/* Background slide thumbnail / organic specimen contour */}
      <div className="w-full h-full relative bg-slate-950 flex items-center justify-center p-1">
        {/* Mock Macro Slide Layout */}
        <div className="w-full h-full rounded border border-slate-800 bg-slate-900 relative overflow-hidden flex items-center justify-center">
          {/* Label area on left */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-slate-800 border-r border-slate-700/50 flex items-center justify-center">
            <span className="text-[7px] font-mono text-slate-400 rotate-90 uppercase">
              WSI
            </span>
          </div>

          {/* Tissue mass thumbnail */}
          <div className="w-16 h-14 rounded-full bg-pink-900/40 border border-pink-700/50 blur-[0.5px] transform translate-x-2" />
        </div>

        {/* Dynamic Viewport Highlight Box */}
        <div
          className="absolute border-2 border-red-500 bg-red-500/20 rounded-sm pointer-events-none transition-all duration-75 shadow-sm"
          style={{
            left: `${boxLeftPercent}%`,
            top: `${boxTopPercent}%`,
            width: `${boxWidthPercent}%`,
            height: `${boxHeightPercent}%`,
          }}
        >
          <div className="w-1.5 h-1.5 bg-red-500 absolute -top-1 -left-1 rounded-full" />
          <div className="w-1.5 h-1.5 bg-red-500 absolute -bottom-1 -right-1 rounded-full" />
        </div>
      </div>

      {/* Label overlay */}
      <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-mono text-slate-300">
        NAVIGATOR
      </div>
    </div>
  );
};
