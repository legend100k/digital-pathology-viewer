import React from 'react';
import { 
  Microscope, 
  Grid2X2, 
  Columns, 
  Square, 
  Link2, 
  Link2Off, 
  Maximize2, 
  Minimize2, 
  Moon, 
  Sun, 
  FileText, 
  FolderOpen, 
  HelpCircle,
  FolderSync
} from 'lucide-react';
import { useViewerStore } from '../../store/useViewerStore';
import { useSlideStore } from '../../store/useSlideStore';
import { ViewerLayout } from '../../types/viewer';

export const TopHeader: React.FC = () => {
  const { 
    layout, 
    setLayout, 
    isSynchronized, 
    toggleSynchronized, 
    theme, 
    toggleTheme, 
    isFullscreen, 
    setIsFullscreen,
    setCaseBrowserOpen,
    setReportModalOpen,
    setShortcutsModalOpen,
    toggleLeftSidebar
  } = useViewerStore();

  const { getActiveSlide } = useSlideStore();
  const activeSlide = getActiveSlide();

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => console.error(err));
    }
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 select-none text-slate-200">
      {/* Brand & Left Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleLeftSidebar}
          title="Toggle Case Library"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-2 border border-slate-700/60"
        >
          <FolderOpen className="w-4 h-4" />
          <span className="text-xs font-medium pr-1 hidden sm:inline">Cases</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-900/20">
            <Microscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wide text-white">PathoView</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono font-medium">
                CLINICAL WSI
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <span className="font-mono text-cyan-300">{activeSlide.caseId}</span>
              <span>•</span>
              <span className="truncate max-w-[200px] text-slate-300">{activeSlide.clinicalDiagnosis}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Active Slide Quick Badges */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="text-xs text-slate-400">Specimen:</span>
        <span className="text-xs font-medium text-slate-200">{activeSlide.tissueSite}</span>
        <span className="text-slate-600">|</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/60">
          {activeSlide.stainType}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
          {activeSlide.objectiveMagnification}
        </span>
        <span className="text-xs text-slate-400 font-mono">
          {activeSlide.micronsPerPixel} µm/px
        </span>
      </div>

      {/* Right Controls: Layout, Sync, Report, Theme, Fullscreen */}
      <div className="flex items-center space-x-2">
        {/* Layout Switcher (1x1, 1x2, 2x2) */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setLayout('1x1')}
            title="Single Slide View (1x1)"
            className={`p-1.5 rounded-md transition-all ${
              layout === '1x1'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout('1x2')}
            title="Side-by-Side Dual View (1x2)"
            className={`p-1.5 rounded-md transition-all ${
              layout === '1x2'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Columns className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout('2x2')}
            title="Quad Grid View (2x2)"
            className={`p-1.5 rounded-md transition-all ${
              layout === '2x2'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Lock Toggle (Synchronized Navigation) */}
        <button
          onClick={toggleSynchronized}
          title={isSynchronized ? 'Synchronized Pan & Zoom: ACTIVE (Click to unlock)' : 'Synchronize Viewports (Click to lock)'}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all border ${
            isSynchronized
              ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300 shadow-sm shadow-emerald-900/30'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          {isSynchronized ? (
            <>
              <Link2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Sync Locked</span>
            </>
          ) : (
            <>
              <Link2Off className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync Off</span>
            </>
          )}
        </button>

        {/* Diagnostic Report Button */}
        <button
          onClick={() => setReportModalOpen(true)}
          title="Clinical Diagnostic Report"
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/80 hover:text-indigo-200 transition-colors flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Report</span>
        </button>

        {/* Shortcuts Reference */}
        <button
          onClick={() => setShortcutsModalOpen(true)}
          title="Keyboard Shortcuts Reference"
          className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Dark / Light Clinical Theme */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Clinical Light Mode' : 'Switch to Dark Reading Room Mode'}
          className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={handleFullscreenToggle}
          title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Enter Full Screen'}
          className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
