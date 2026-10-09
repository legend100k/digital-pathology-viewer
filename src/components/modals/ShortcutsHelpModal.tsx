import React from 'react';
import { useViewerStore } from '../../store/useViewerStore';
import { X, Keyboard, Hand, ZoomIn, MapPin, Square, Pentagon, Pencil, Ruler, RotateCw, RefreshCw } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Space / H', description: 'Pan & navigate slide (Click & drag)', icon: <Hand className="w-4 h-4 text-cyan-400" /> },
  { key: '+ / -', description: 'Zoom In / Zoom Out with smooth transition', icon: <ZoomIn className="w-4 h-4 text-cyan-400" /> },
  { key: 'Scroll Wheel', description: 'Cursor-centered micro-step zoom', icon: <ZoomIn className="w-4 h-4 text-cyan-400" /> },
  { key: 'P', description: 'Point Marker tool (Pins & Mitotic count)', icon: <MapPin className="w-4 h-4 text-cyan-400" /> },
  { key: 'R', description: 'Rectangle Region tool (Bounding box)', icon: <Square className="w-4 h-4 text-cyan-400" /> },
  { key: 'L', description: 'Polygon tool (Multi-vertex area)', icon: <Pentagon className="w-4 h-4 text-cyan-400" /> },
  { key: 'F', description: 'Freehand contour (Tumor infiltration pencil)', icon: <Pencil className="w-4 h-4 text-cyan-400" /> },
  { key: 'M', description: 'Calibrated Measurement Ruler (in µm / mm)', icon: <Ruler className="w-4 h-4 text-cyan-400" /> },
  { key: 'Esc', description: 'Reset magnification & slide position', icon: <RefreshCw className="w-4 h-4 text-cyan-400" /> },
  { key: 'S', description: 'Toggle Synchronized Navigation (Lock/Unlock)', icon: <Keyboard className="w-4 h-4 text-cyan-400" /> },
  { key: 'F11', description: 'Toggle Immersive Full Screen mode', icon: <Keyboard className="w-4 h-4 text-cyan-400" /> },
];

export const ShortcutsHelpModal: React.FC = () => {
  const { shortcutsModalOpen, setShortcutsModalOpen } = useViewerStore();

  if (!shortcutsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Microscope & Viewer Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 divide-y divide-slate-800/80 max-h-[70vh] overflow-y-auto">
          {SHORTCUTS.map((s, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                {s.icon}
                <span className="text-slate-300">{s.description}</span>
              </div>
              <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md font-mono text-[11px] font-semibold text-cyan-300 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-400">
          Tip: Press any tool hotkey at any time during whole slide examination.
        </div>
      </div>
    </div>
  );
};
