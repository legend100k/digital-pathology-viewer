import React from 'react';
import { useViewerStore } from '../../store/useViewerStore';
import { WsiViewport } from './WsiViewport';
import { PrimaryToolbar } from '../toolbar/PrimaryToolbar';
import { MagnificationBar } from '../toolbar/MagnificationBar';

export const ViewerWorkspace: React.FC = () => {
  const { layout, viewports, activeViewportId } = useViewerStore();

  const isMultiView = layout !== '1x1';

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
      {/* Floating Microscope Controls Toolbar */}
      <PrimaryToolbar />

      {/* Viewport Grid Container */}
      <div className="w-full h-full">
        {layout === '1x1' && (
          <div className="w-full h-full">
            <WsiViewport
              viewport={viewports[0]}
              isMultiView={false}
              isActive={true}
            />
          </div>
        )}

        {layout === '1x2' && (
          <div className="w-full h-full grid grid-cols-2 divide-x-2 divide-slate-800">
            <WsiViewport
              viewport={viewports[0]}
              isMultiView={true}
              isActive={activeViewportId === viewports[0].id}
            />
            <WsiViewport
              viewport={viewports[1]}
              isMultiView={true}
              isActive={activeViewportId === viewports[1].id}
            />
          </div>
        )}

        {layout === '2x2' && (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 divide-x-2 divide-y-2 divide-slate-800">
            <WsiViewport
              viewport={viewports[0]}
              isMultiView={true}
              isActive={activeViewportId === viewports[0].id}
            />
            <WsiViewport
              viewport={viewports[1]}
              isMultiView={true}
              isActive={activeViewportId === viewports[1].id}
            />
            <WsiViewport
              viewport={viewports[2]}
              isMultiView={true}
              isActive={activeViewportId === viewports[2].id}
            />
            <WsiViewport
              viewport={viewports[3]}
              isMultiView={true}
              isActive={activeViewportId === viewports[3].id}
            />
          </div>
        )}
      </div>

      {/* Floating Objective Magnification Bar */}
      <MagnificationBar />
    </div>
  );
};
