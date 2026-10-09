import React from 'react';
import { useSlideStore } from '../../store/useSlideStore';
import { 
  FileText, 
  User, 
  Calendar, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Copy,
  Hash
} from 'lucide-react';

export const MetadataPanel: React.FC = () => {
  const { getActiveSlide } = useSlideStore();
  const slide = getActiveSlide();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 select-none text-slate-200">
      {/* Patient & Specimen Card */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center space-x-2 text-cyan-400">
          <User className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Case & Patient Profile
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Case ID</div>
            <div className="font-mono font-semibold text-slate-200">{slide.caseId}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Patient ID</div>
            <div className="font-mono font-semibold text-slate-200">{slide.patientId}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Age / Gender</div>
            <div className="text-slate-200">{slide.patientAge} Years • {slide.patientGender}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Specimen Site</div>
            <div className="text-slate-200 truncate">{slide.tissueSite}</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[10px] text-slate-500 uppercase">Clinical Diagnosis</div>
          <div className="text-xs font-semibold text-cyan-300 mt-0.5">
            {slide.clinicalDiagnosis}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {slide.description}
          </div>
        </div>
      </div>

      {/* Optical & Whole Slide Image Parameters */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center space-x-2 text-fuchsia-400">
          <Layers className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Optical & WSI Acquisition
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Stain Type</div>
            <div className="font-semibold text-fuchsia-300">{slide.stainType}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Objective Power</div>
            <div className="font-mono font-semibold text-cyan-300">{slide.objectiveMagnification}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Native Dimensions</div>
            <div className="font-mono text-slate-300 text-[11px]">
              {slide.dimensions.width.toLocaleString()} × {slide.dimensions.height.toLocaleString()} px
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Resolution (MPP)</div>
            <div className="font-mono text-slate-300">{slide.micronsPerPixel} µm/px</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] text-slate-500 uppercase">Scanner Model</div>
            <div className="text-slate-300 text-xs">{slide.scannerModel}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] text-slate-500 uppercase">Scan Timestamp</div>
            <div className="text-slate-400 font-mono text-[11px]">{slide.scanDate}</div>
          </div>
        </div>
      </div>

      {/* DICOMWeb & PACS UIDs */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center space-x-2 text-emerald-400">
          <Hash className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            DICOM Hierarchy UIDs
          </h3>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase">
              <span>Study Instance UID</span>
              <button
                onClick={() => handleCopy(slide.studyUid)}
                className="hover:text-slate-200 transition-colors"
                title="Copy UID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 truncate bg-slate-900 px-2 py-1 rounded mt-0.5 border border-slate-800">
              {slide.studyUid}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase">
              <span>Series Instance UID</span>
              <button
                onClick={() => handleCopy(slide.seriesUid)}
                className="hover:text-slate-200 transition-colors"
                title="Copy UID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 truncate bg-slate-900 px-2 py-1 rounded mt-0.5 border border-slate-800">
              {slide.seriesUid}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase">
              <span>SOP Instance UID</span>
              <button
                onClick={() => handleCopy(slide.sopInstanceUid)}
                className="hover:text-slate-200 transition-colors"
                title="Copy UID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 truncate bg-slate-900 px-2 py-1 rounded mt-0.5 border border-slate-800">
              {slide.sopInstanceUid}
            </div>
          </div>
        </div>
      </div>

      {/* Histopathological Findings */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400">
          <Activity className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Pathological Findings
          </h3>
        </div>

        <ul className="space-y-1.5 text-xs text-slate-300">
          {slide.findings.map((finding, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span className="leading-snug">{finding}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
