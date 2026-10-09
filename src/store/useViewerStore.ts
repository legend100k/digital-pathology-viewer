import { create } from 'zustand';
import { ViewerLayout, ViewerTool, ViewportInstance, ImageFilters } from '../types/viewer';
import { ClinicalCategory } from '../types/annotation';

export const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  gamma: 1.0,
  invert: false,
};

interface ViewerState {
  // Layout & Tool
  layout: ViewerLayout;
  activeTool: ViewerTool;
  activeCategory: ClinicalCategory;
  activeColor: string;
  isSynchronized: boolean;

  // Viewports
  viewports: ViewportInstance[];
  activeViewportId: string;

  // UI Panels & Modals
  theme: 'dark' | 'light';
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activeRightTab: 'annotations' | 'metadata' | 'adjustments';
  caseBrowserOpen: boolean;
  reportModalOpen: boolean;
  shortcutsModalOpen: boolean;
  isFullscreen: boolean;

  // Actions
  setLayout: (layout: ViewerLayout) => void;
  setActiveTool: (tool: ViewerTool) => void;
  setActiveCategory: (category: ClinicalCategory) => void;
  setActiveColor: (color: string) => void;
  toggleSynchronized: () => void;
  setActiveViewportId: (id: string) => void;
  
  // Viewport transforms
  updateViewportTransform: (
    viewportId: string,
    transformUpdates: Partial<ViewportInstance['transform']>
  ) => void;
  setViewportSlide: (viewportId: string, slideId: string) => void;
  updateViewportFilters: (viewportId: string, filterUpdates: Partial<ImageFilters>) => void;
  resetViewportFilters: (viewportId: string) => void;
  resetViewportView: (viewportId: string) => void;
  rotateViewport: (viewportId: string, degrees: number) => void;

  // UI state actions
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setActiveRightTab: (tab: 'annotations' | 'metadata' | 'adjustments') => void;
  setCaseBrowserOpen: (open: boolean) => void;
  setReportModalOpen: (open: boolean) => void;
  setShortcutsModalOpen: (open: boolean) => void;
  setIsFullscreen: (full: boolean) => void;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  layout: '1x1',
  activeTool: 'pan',
  activeCategory: 'malignant',
  activeColor: '#ef4444',
  isSynchronized: false,

  viewports: [
    {
      id: 'viewport-1',
      slideId: 'slide-jp2k',
      transform: { zoom: 1.0, center: { x: 0.5, y: 0.5 }, rotation: 0 },
      filters: { ...DEFAULT_FILTERS },
      isLoading: false,
    },
    {
      id: 'viewport-2',
      slideId: 'slide-002',
      transform: { zoom: 1.0, center: { x: 0.5, y: 0.5 }, rotation: 0 },
      filters: { ...DEFAULT_FILTERS },
      isLoading: false,
    },
    {
      id: 'viewport-3',
      slideId: 'slide-003',
      transform: { zoom: 1.0, center: { x: 0.5, y: 0.5 }, rotation: 0 },
      filters: { ...DEFAULT_FILTERS },
      isLoading: false,
    },
    {
      id: 'viewport-4',
      slideId: 'slide-004',
      transform: { zoom: 1.0, center: { x: 0.5, y: 0.5 }, rotation: 0 },
      filters: { ...DEFAULT_FILTERS },
      isLoading: false,
    },
  ],
  activeViewportId: 'viewport-1',

  theme: 'dark',
  leftSidebarOpen: false,
  rightSidebarOpen: true,
  activeRightTab: 'annotations',
  caseBrowserOpen: false,
  reportModalOpen: false,
  shortcutsModalOpen: false,
  isFullscreen: false,

  setLayout: (layout) => set({ layout }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setActiveColor: (activeColor) => set({ activeColor }),
  toggleSynchronized: () => set((s) => ({ isSynchronized: !s.isSynchronized })),
  setActiveViewportId: (activeViewportId) => set({ activeViewportId }),

  updateViewportTransform: (viewportId, transformUpdates) => {
    const { isSynchronized, viewports } = get();
    if (isSynchronized) {
      // Sync across all viewports!
      set({
        viewports: viewports.map((vp) => ({
          ...vp,
          transform: { ...vp.transform, ...transformUpdates },
        })),
      });
    } else {
      set({
        viewports: viewports.map((vp) =>
          vp.id === viewportId
            ? { ...vp, transform: { ...vp.transform, ...transformUpdates } }
            : vp
        ),
      });
    }
  },

  setViewportSlide: (viewportId, slideId) =>
    set((state) => ({
      viewports: state.viewports.map((vp) =>
        vp.id === viewportId ? { ...vp, slideId } : vp
      ),
    })),

  updateViewportFilters: (viewportId, filterUpdates) =>
    set((state) => ({
      viewports: state.viewports.map((vp) =>
        vp.id === viewportId
          ? { ...vp, filters: { ...vp.filters, ...filterUpdates } }
          : vp
      ),
    })),

  resetViewportFilters: (viewportId) =>
    set((state) => ({
      viewports: state.viewports.map((vp) =>
        vp.id === viewportId ? { ...vp, filters: { ...DEFAULT_FILTERS } } : vp
      ),
    })),

  resetViewportView: (viewportId) => {
    const resetTransform = { zoom: 1.0, center: { x: 0.5, y: 0.5 }, rotation: 0 };
    const { isSynchronized, viewports } = get();
    if (isSynchronized) {
      set({
        viewports: viewports.map((vp) => ({ ...vp, transform: resetTransform })),
      });
    } else {
      set({
        viewports: viewports.map((vp) =>
          vp.id === viewportId ? { ...vp, transform: resetTransform } : vp
        ),
      });
    }
  },

  rotateViewport: (viewportId, degrees) => {
    const { isSynchronized, viewports } = get();
    if (isSynchronized) {
      set({
        viewports: viewports.map((vp) => ({
          ...vp,
          transform: {
            ...vp.transform,
            rotation: (vp.transform.rotation + degrees) % 360,
          },
        })),
      });
    } else {
      set({
        viewports: viewports.map((vp) =>
          vp.id === viewportId
            ? {
                ...vp,
                transform: {
                  ...vp.transform,
                  rotation: (vp.transform.rotation + degrees) % 360,
                },
              }
            : vp
        ),
      });
    }
  },

  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: next };
    }),

  setTheme: (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  toggleLeftSidebar: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightSidebar: () => set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  setActiveRightTab: (activeRightTab) =>
    set({ activeRightTab, rightSidebarOpen: true }),
  setCaseBrowserOpen: (caseBrowserOpen) => set({ caseBrowserOpen }),
  setReportModalOpen: (reportModalOpen) => set({ reportModalOpen }),
  setShortcutsModalOpen: (shortcutsModalOpen) => set({ shortcutsModalOpen }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
}));
