import { create } from 'zustand';
import { Annotation, AnnotationFilter, ClinicalCategory } from '../types/annotation';
import { INITIAL_ANNOTATIONS } from '../data/initialAnnotations';

interface AnnotationState {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  hoveredAnnotationId: string | null;
  filter: AnnotationFilter;
  
  // Actions
  setSelectedAnnotationId: (id: string | null) => void;
  setHoveredAnnotationId: (id: string | null) => void;
  setFilter: (filterUpdate: Partial<AnnotationFilter>) => void;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  toggleVisibility: (id: string) => void;
  toggleAllVisibility: (slideId: string, visible?: boolean) => void;
  importAnnotations: (imported: Annotation[]) => void;
  getSlideAnnotations: (slideId: string) => Annotation[];
  getFilteredSlideAnnotations: (slideId: string) => Annotation[];
}

export const useAnnotationStore = create<AnnotationState>((set, get) => ({
  annotations: INITIAL_ANNOTATIONS,
  selectedAnnotationId: null,
  hoveredAnnotationId: null,
  filter: {
    category: 'all',
    searchQuery: '',
    visibleOnly: false,
  },

  setSelectedAnnotationId: (id) => set({ selectedAnnotationId: id }),
  setHoveredAnnotationId: (id) => set({ hoveredAnnotationId: id }),

  setFilter: (filterUpdate) =>
    set((state) => ({ filter: { ...state.filter, ...filterUpdate } })),

  addAnnotation: (annotation) =>
    set((state) => ({
      annotations: [annotation, ...state.annotations],
      selectedAnnotationId: annotation.id,
    })),

  updateAnnotation: (id, updates) =>
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ),
    })),

  deleteAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
      selectedAnnotationId:
        state.selectedAnnotationId === id ? null : state.selectedAnnotationId,
    })),

  toggleVisibility: (id) =>
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id ? { ...a, isVisible: !a.isVisible } : a
      ),
    })),

  toggleAllVisibility: (slideId, visible) =>
    set((state) => {
      const current = state.annotations.filter((a) => a.slideId === slideId);
      const targetState = visible !== undefined ? visible : !current.every((a) => a.isVisible);
      return {
        annotations: state.annotations.map((a) =>
          a.slideId === slideId ? { ...a, isVisible: targetState } : a
        ),
      };
    }),

  importAnnotations: (imported) =>
    set((state) => {
      const existingIds = new Set(state.annotations.map((a) => a.id));
      const newItems = imported.filter((a) => !existingIds.has(a.id));
      return { annotations: [...newItems, ...state.annotations] };
    }),

  getSlideAnnotations: (slideId) => {
    return get().annotations.filter((a) => a.slideId === slideId);
  },

  getFilteredSlideAnnotations: (slideId) => {
    const { annotations, filter } = get();
    return annotations.filter((a) => {
      if (a.slideId !== slideId) return false;
      if (filter.visibleOnly && !a.isVisible) return false;
      if (filter.category !== 'all' && a.category !== filter.category) return false;
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchLabel = a.label.toLowerCase().includes(query);
        const matchNotes = a.notes?.toLowerCase().includes(query) ?? false;
        const matchCat = a.category.toLowerCase().includes(query);
        if (!matchLabel && !matchNotes && !matchCat) return false;
      }
      return true;
    });
  },
}));
