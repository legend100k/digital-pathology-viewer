import { create } from 'zustand';
import { SlideMetadata } from '../types/slide';
import { SAMPLE_SLIDES } from '../data/sampleSlides';

interface SlideState {
  slides: SlideMetadata[];
  activeSlideId: string;
  getActiveSlide: () => SlideMetadata;
  getSlideById: (id: string) => SlideMetadata | undefined;
  setActiveSlideId: (id: string) => void;
  addSlide: (slide: SlideMetadata) => void;
}

export const useSlideStore = create<SlideState>((set, get) => ({
  slides: SAMPLE_SLIDES,
  activeSlideId: SAMPLE_SLIDES[0].id,

  getActiveSlide: () => {
    const { slides, activeSlideId } = get();
    return slides.find((s) => s.id === activeSlideId) || slides[0];
  },

  getSlideById: (id: string) => {
    return get().slides.find((s) => s.id === id);
  },

  setActiveSlideId: (id: string) => {
    set({ activeSlideId: id });
  },

  addSlide: (slide: SlideMetadata) => {
    set((state) => ({
      slides: [slide, ...state.slides],
      activeSlideId: slide.id,
    }));
  },
}));
