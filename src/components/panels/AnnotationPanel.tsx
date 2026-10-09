import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  Search, 
  MapPin, 
  Square, 
  Pentagon, 
  Pencil, 
  Ruler, 
  Check, 
  X,
  Filter
} from 'lucide-react';
import { useAnnotationStore } from '../../store/useAnnotationStore';
import { useSlideStore } from '../../store/useSlideStore';
import { useViewerStore } from '../../store/useViewerStore';
import { Annotation, ClinicalCategory } from '../../types/annotation';
import { formatMicrons, formatArea } from '../../utils/geometry';
import { 
  exportAnnotationsToJson, 
  exportAnnotationsToGeoJson, 
  parseImportedAnnotations 
} from '../../utils/exportImport';

export const AnnotationPanel: React.FC = () => {
  const { 
    annotations, 
    selectedAnnotationId, 
    setSelectedAnnotationId,
    toggleVisibility, 
    toggleAllVisibility, 
    deleteAnnotation, 
    updateAnnotation,
    importAnnotations,
    filter, 
    setFilter 
  } = useAnnotationStore();

  const { getActiveSlide } = useSlideStore();
  const activeSlide = getActiveSlide();
  const { updateViewportTransform, activeViewportId } = useViewerStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Slide specific annotations
  const slideAnnotations = annotations.filter((a) => a.slideId === activeSlide.id);
  
  const filteredAnnotations = slideAnnotations.filter((a) => {
    if (filter.visibleOnly && !a.isVisible) return false;
    if (filter.category !== 'all' && a.category !== filter.category) return false;
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchLabel = a.label.toLowerCase().includes(q);
      const matchNotes = a.notes?.toLowerCase().includes(q) ?? false;
      if (!matchLabel && !matchNotes) return false;
    }
    return true;
  });

  const handleStartEdit = (ann: Annotation) => {
    setEditingId(ann.id);
    setEditLabel(ann.label);
    setEditNotes(ann.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    updateAnnotation(id, { label: editLabel, notes: editNotes });
    setEditingId(null);
  };

  const handleFocusAnnotation = (ann: Annotation) => {
    setSelectedAnnotationId(ann.id);
    // Pan viewport to annotation location
    if (ann.points.length > 0) {
      const pt = ann.points[0];
      const normX = pt.x / activeSlide.dimensions.width;
      const normY = pt.y / activeSlide.dimensions.height;
      updateViewportTransform(activeViewportId, {
        center: { x: normX, y: normY },
        zoom: Math.max(4, 10),
      });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const imported = parseImportedAnnotations(content, activeSlide.id);
        importAnnotations(imported);
      } catch (err: any) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  };

  const getTypeIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'point': return <MapPin className="w-3.5 h-3.5" />;
      case 'rectangle': return <Square className="w-3.5 h-3.5" />;
      case 'polygon': return <Pentagon className="w-3.5 h-3.5" />;
      case 'freehand': return <Pencil className="w-3.5 h-3.5" />;
      case 'ruler': return <Ruler className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col h-full select-none text-slate-200">
      {/* Search and Category Filter */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            placeholder="Search annotations..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[11px]">
          {(['all', 'malignant', 'mitosis', 'necrosis', 'benign', 'measurement'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter({ category: cat })}
              className={`px-2 py-0.5 rounded-full capitalize whitespace-nowrap transition-colors ${
                filter.category === cat
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Global Visibility & Export Actions */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={() => toggleAllVisibility(activeSlide.id)}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Toggle Visibility</span>
          </button>

          <span className="text-[11px] font-mono text-cyan-400">
            {filteredAnnotations.length} / {slideAnnotations.length} Markings
          </span>
        </div>
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredAnnotations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No annotations found for this slide.
            <div className="mt-1 text-[11px] text-slate-600">
              Use the toolbar tools (Pin, Rect, Poly, Pen, Ruler) to mark regions.
            </div>
          </div>
        ) : (
          filteredAnnotations.map((ann) => {
            const isSelected = selectedAnnotationId === ann.id;
            const isEditing = editingId === ann.id;

            return (
              <div
                key={ann.id}
                onClick={() => handleFocusAnnotation(ann)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: ann.color }}
                    />
                    <span className="text-slate-400">{getTypeIcon(ann.type)}</span>
                    <span className="font-semibold text-xs text-slate-100 truncate max-w-[140px]">
                      {ann.label}
                    </span>
                  </div>

                  {/* Actions: Visibility, Edit, Delete */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(ann.id);
                      }}
                      title={ann.isVisible ? 'Hide Annotation' : 'Show Annotation'}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {ann.isVisible ? (
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(ann);
                      }}
                      title="Edit Note / Label"
                      className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnnotation(ann.id);
                      }}
                      title="Delete Annotation"
                      className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Measurements badge */}
                {(ann.lengthMicrons || ann.areaMicronsSquare) && (
                  <div className="mt-1.5 flex items-center space-x-2 text-[10px] font-mono text-cyan-300">
                    {ann.lengthMicrons && (
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        Dist: {formatMicrons(ann.lengthMicrons)}
                      </span>
                    )}
                    {ann.areaMicronsSquare && (
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        Area: {formatArea(ann.areaMicronsSquare)}
                      </span>
                    )}
                  </div>
                )}

                {/* Notes */}
                {ann.notes && !isEditing && (
                  <div className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                    {ann.notes}
                  </div>
                )}

                {/* Inline Editing Form */}
                {isEditing && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 pt-2 border-t border-slate-800 space-y-1.5"
                  >
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Annotation Title"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Clinical diagnosis / note..."
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                    />
                    <div className="flex justify-end space-x-1.5">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-0.5 rounded text-[11px] text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(ann.id)}
                        className="px-2 py-0.5 rounded bg-cyan-600 text-white text-[11px] font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Export & Import Footers */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => exportAnnotationsToJson(slideAnnotations, activeSlide.slideName)}
            className="flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => exportAnnotationsToGeoJson(slideAnnotations, activeSlide.slideName)}
            className="flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>QuPath GeoJSON</span>
          </button>
        </div>

        <label className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors border border-slate-800 cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>Import Annotations File</span>
          <input
            type="file"
            accept=".json,.geojson"
            onChange={handleImportFile}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
