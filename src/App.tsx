import React, { useEffect } from 'react';
import { TopHeader } from './components/header/TopHeader';
import { LeftSidebar } from './components/panels/LeftSidebar';
import { RightSidebar } from './components/panels/RightSidebar';
import { ViewerWorkspace } from './components/viewer/ViewerWorkspace';
import { ReportPreviewModal } from './components/modals/ReportPreviewModal';
import { ShortcutsHelpModal } from './components/modals/ShortcutsHelpModal';
import { useViewerStore } from './store/useViewerStore';

export const App: React.FC = () => {
  const { 
    setActiveTool, 
    toggleSynchronized, 
    resetViewportView, 
    activeViewportId 
  } = useViewerStore();

  // Global hotkeys listener for seamless microscope workflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'h':
          e.preventDefault();
          setActiveTool('pan');
          break;
        case 'p':
          setActiveTool('point');
          break;
        case 'r':
          setActiveTool('rectangle');
          break;
        case 'l':
          setActiveTool('polygon');
          break;
        case 'f':
          setActiveTool('freehand');
          break;
        case 'm':
          setActiveTool('ruler');
          break;
        case 's':
          toggleSynchronized();
          break;
        case 'escape':
          resetViewportView(activeViewportId);
          setActiveTool('pan');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool, toggleSynchronized, resetViewportView, activeViewportId]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Clinical Header */}
      <TopHeader />

      {/* Main Workspace with Panels */}
      <div className="flex flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden relative">
        <LeftSidebar />
        <ViewerWorkspace />
        <RightSidebar />
      </div>

      {/* Clinical Diagnostic Report & Help Modals */}
      <ReportPreviewModal />
      <ShortcutsHelpModal />
    </div>
  );
};

export default App;
