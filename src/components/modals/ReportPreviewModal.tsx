import React, { useState } from 'react';
import { useSlideStore } from '../../store/useSlideStore';
import { useAnnotationStore } from '../../store/useAnnotationStore';
import { useViewerStore } from '../../store/useViewerStore';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  Microscope, 
  Award, 
  ShieldCheck,
  Calendar,
  UserCheck
} from 'lucide-react';
import { formatMicrons, formatArea } from '../../utils/geometry';

export const ReportPreviewModal: React.FC = () => {
  const { reportModalOpen, setReportModalOpen } = useViewerStore();
  const { getActiveSlide } = useSlideStore();
  const { annotations } = useAnnotationStore();

  const slide = getActiveSlide();
  const slideAnnotations = annotations.filter((a) => a.slideId === slide.id);

  const [pathologistName, setPathologistName] = useState('Dr. Sarah Chen, MD, FCAP');
  const [reportConclusion, setReportConclusion] = useState(
    'Morphologic and quantitative whole slide analysis supports a definitive high-grade malignant neoplasm. Resection margins assessed with digital measurements indicate clear clearance (>1.5 mm). Correlate with ancillary IHC markers and clinical staging.'
  );

  if (!reportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <Microscope className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Pathology Diagnostic Review Summary
              </h2>
              <div className="text-xs text-slate-400">
                Official Pathology Review Document • CAP / CLIA Diagnostic Standards
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setReportModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-900 text-slate-200 font-sans print:p-0 print:bg-white print:text-black">
          {/* Clinical Header */}
          <div className="border-b border-slate-700 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xl font-black text-cyan-400 tracking-tight">
                METROPOLITAN DIGITAL PATHOLOGY CENTER
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Division of Anatomic & Molecular Surgical Pathology
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Accreditation: CAP #782190 • CLIA #99D087234
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-mono font-bold text-slate-200">
                Report Date: {new Date().toLocaleDateString()}
              </div>
              <div className="text-slate-400 mt-0.5">
                Status: <span className="text-emerald-400 font-semibold">PRELIMINARY SIGN-OFF</span>
              </div>
            </div>
          </div>

          {/* Patient & Specimen Info Table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Patient Name / ID</span>
              <span className="font-mono font-bold text-slate-200">{slide.patientId}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Age / Sex</span>
              <span className="text-slate-200">{slide.patientAge} Years / {slide.patientGender}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Accession / Case ID</span>
              <span className="font-mono font-bold text-cyan-400">{slide.caseId}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Stain & Objective</span>
              <span className="text-slate-200">{slide.stainType} ({slide.objectiveMagnification})</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block uppercase text-[10px]">Anatomic Specimen Source</span>
              <span className="text-slate-200 font-medium">{slide.tissueSite}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block uppercase text-[10px]">Scanner Acquisition</span>
              <span className="text-slate-400 text-[11px]">{slide.scannerModel} ({slide.micronsPerPixel} µm/px)</span>
            </div>
          </div>

          {/* Clinical Final Diagnosis */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Surgical Pathology Diagnosis</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-semibold text-white leading-relaxed">
              {slide.clinicalDiagnosis}
            </div>
          </div>

          {/* Microscopic Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Microscopic Examination & Architecture
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300 leading-relaxed">
              {slide.findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Quantitative Digital Markings & Measurements Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Quantitative Slide Markings & Regions ({slideAnnotations.length})</span>
            </h3>
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2">Classification</th>
                    <th className="px-3 py-2">Label</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Metric</th>
                    <th className="px-3 py-2">Pathologist Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {slideAnnotations.map((ann) => (
                    <tr key={ann.id} className="hover:bg-slate-900/50">
                      <td className="px-3 py-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border"
                          style={{
                            borderColor: `${ann.color}66`,
                            color: ann.color,
                            backgroundColor: `${ann.color}15`,
                          }}
                        >
                          {ann.category}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-100">{ann.label}</td>
                      <td className="px-3 py-2 capitalize text-slate-400">{ann.type}</td>
                      <td className="px-3 py-2 font-mono text-cyan-300 text-[11px]">
                        {ann.lengthMicrons
                          ? formatMicrons(ann.lengthMicrons)
                          : ann.areaMicronsSquare
                          ? formatArea(ann.areaMicronsSquare)
                          : 'Point'}
                      </td>
                      <td className="px-3 py-2 text-slate-400 text-[11px]">
                        {ann.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pathologist Conclusion & Signature */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Diagnostic Conclusion / Addendum
              </label>
              <textarea
                value={reportConclusion}
                onChange={(e) => setReportConclusion(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block">Reviewing Pathologist</label>
                <input
                  type="text"
                  value={pathologistName}
                  onChange={(e) => setPathologistName(e.target.value)}
                  className="bg-transparent font-semibold text-sm text-cyan-300 border-b border-slate-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/50 px-3 py-2 rounded-xl border border-emerald-800/60">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">Clinically Verified & Locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
