import React, { useState } from 'react';
import { useSlideStore } from '../../store/useSlideStore';
import { useViewerStore } from '../../store/useViewerStore';
import { 
  FolderOpen, 
  Search, 
  Plus, 
  X, 
  ChevronRight, 
  Tag, 
  FileCheck2,
  Calendar,
  Layers
} from 'lucide-react';
import { SlideMetadata } from '../../types/slide';

export const LeftSidebar: React.FC = () => {
  const { slides, activeSlideId, setActiveSlideId, addSlide } = useSlideStore();
  const { 
    leftSidebarOpen, 
    toggleLeftSidebar, 
    setViewportSlide, 
    activeViewportId 
  } = useViewerStore();

  const [searchQuery, setSearchQuery] = useState('');

  if (!leftSidebarOpen) return null;

  const filteredSlides = slides.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.caseId.toLowerCase().includes(q) ||
      s.clinicalDiagnosis.toLowerCase().includes(q) ||
      s.tissueSite.toLowerCase().includes(q) ||
      s.stainType.toLowerCase().includes(q)
    );
  });

  const handleSelectSlide = (slide: SlideMetadata) => {
    setActiveSlideId(slide.id);
    setViewportSlide(activeViewportId, slide.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newSlide: SlideMetadata = {
      id: `custom-slide-${Date.now()}`,
      caseId: `CAS-UPLOAD-${Math.floor(100 + Math.random() * 900)}`,
      slideName: file.name,
      patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}-X`,
      patientAge: 45,
      patientGender: 'Other',
      tissueSite: 'Clinical Specimen (Custom Upload)',
      clinicalDiagnosis: 'Pathology Review In Progress',
      stainType: 'H&E',
      objectiveMagnification: '40x',
      scanDate: new Date().toLocaleDateString(),
      scannerModel: 'Standard Digital Scanner',
      dimensions: { width: 70000, height: 50000 },
      micronsPerPixel: 0.25,
      studyUid: `1.2.840.custom.${Date.now()}`,
      seriesUid: `1.2.840.custom.${Date.now()}.1`,
      sopInstanceUid: `1.2.840.custom.${Date.now()}.2`,
      thumbnailUrl: '',
      description: `Uploaded digital whole slide file: ${file.name}`,
      findings: ['Custom slide loaded into viewer workspace for clinical analysis.'],
    };

    addSlide(newSlide);
    setViewportSlide(activeViewportId, newSlide.id);
  };

  return (
    <aside className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 select-none text-slate-200 shadow-2xl">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Slide Case Library
          </h2>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-cyan-300 font-mono">
            {slides.length}
          </span>
        </div>
        <button
          onClick={toggleLeftSidebar}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Upload Button */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases, organs, stains..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Local File Upload button */}
        <label className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Custom Slide (.svs / .tif / img)</span>
          <input
            type="file"
            accept=".svs,.tif,.tiff,.jpg,.jpeg,.png,.ndpi"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Slide List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredSlides.map((slide) => {
          const isSelected = slide.id === activeSlideId;

          return (
            <div
              key={slide.id}
              onClick={() => handleSelectSlide(slide)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {slide.caseId}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/60 font-medium">
                  {slide.stainType}
                </span>
              </div>

              <div className="mt-1 text-xs font-semibold text-slate-100 line-clamp-1">
                {slide.clinicalDiagnosis}
              </div>

              <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-400">
                <span>{slide.tissueSite}</span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">
                  {slide.objectiveMagnification}
                </span>
                <span>{slide.patientId}</span>
                <span>{slide.patientAge}y • {slide.patientGender[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
