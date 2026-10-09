import React from 'react';
import { useViewerStore } from '../../store/useViewerStore';
import { AnnotationPanel } from './AnnotationPanel';
import { MetadataPanel } from './MetadataPanel';
import { ImageAdjustments } from './ImageAdjustments';
import { 
  Bookmark, 
  Info, 
  Sliders, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { 
    rightSidebarOpen, 
    toggleRightSidebar, 
    activeRightTab, 
    setActiveRightTab 
  } = useViewerStore();

  if (!rightSidebarOpen) {
    return (
      <button
        onClick={toggleRightSidebar}
        title="Open Side Panel"
        className="absolute top-16 right-2 z-20 p-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-cyan-400 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  return (
    <aside className="w-84 md:w-96 h-full bg-slate-900 border-l border-slate-800 flex flex-col z-20 select-none shadow-2xl text-slate-200">
      {/* Tabs Header */}
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-2 bg-slate-950/60">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveRightTab('annotations')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRightTab === 'annotations'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Markings</span>
          </button>

          <button
            onClick={() => setActiveRightTab('metadata')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRightTab === 'metadata'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Metadata</span>
          </button>

          <button
            onClick={() => setActiveRightTab('adjustments')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRightTab === 'adjustments'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Optics</span>
          </button>
        </div>

        {/* Collapse button */}
        <button
          onClick={toggleRightSidebar}
          title="Collapse Panel"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeRightTab === 'annotations' && <AnnotationPanel />}
        {activeRightTab === 'metadata' && <MetadataPanel />}
        {activeRightTab === 'adjustments' && <ImageAdjustments />}
      </div>
    </aside>
  );
};
