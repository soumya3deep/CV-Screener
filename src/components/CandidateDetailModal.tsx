import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight, Copy, Check, Sparkles, Binary } from 'lucide-react';
import { CandidateResult } from '../types';

interface CandidateDetailModalProps {
  candidate: CandidateResult | null;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({ candidate, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!candidate) return null;

  const scorePct = Math.round(candidate.score * 100);

  const getTierColor = (tier: number) => {
    if (tier === 1) return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', label: 'Tier 1 • High Priority Shortlist' };
    if (tier === 2) return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', label: 'Tier 2 • Technical Screen' };
    return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', label: 'Tier 3 • Future Reserve' };
  };

  const tierStyle = getTierColor(candidate.tier);

  const handleCopyBrief = () => {
    const brief = `SUNJET ENERGY RECRUITER CANDIDATE BRIEF
-----------------------------------------
Candidate: ${candidate.candidateName}
File: ${candidate.fileName}
Match Score: ${scorePct}% (Tier ${candidate.tier})
Recommended Action: ${candidate.nextAction}

KEY STRENGTHS:
${candidate.pros.map((p) => `• ${p}`).join('\n')}

NOTABLE GAPS / AREAS TO PROBE:
${candidate.cons.map((c) => `• ${c}`).join('\n')}

MATCHED SKILLS:
${candidate.matchedSkills.join(', ') || 'N/A'}

MISSING JD REQUIREMENTS:
${candidate.missingSkills.join(', ') || 'None identified'}

Evaluation Method: ${candidate.rawBreakdown?.method || 'N/A'}
`;

    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-lg shadow-2xs">
              {scorePct}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {candidate.candidateName}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                  {tierStyle.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                {candidate.fileName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Action Callout */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-xs">
                Recommended Recruiter Next Action
              </p>
              <p className="text-amber-900 font-medium text-xs mt-0.5">
                {candidate.nextAction}
              </p>
            </div>
          </div>

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Key Candidate Strengths</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                {candidate.pros.map((pro, idx) => (
                  <li key={idx} className="leading-normal">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons / Gaps */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Qualification Gaps / Risks</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                {candidate.cons.map((con, idx) => (
                  <li key={idx} className="leading-normal">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Matched Skills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Verified Matched Competencies ({candidate.matchedSkills.length})
              </span>
            </div>
            {candidate.matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {candidate.matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 italic">No direct term overlap detected with Job Description.</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Missing Job Requirements ({candidate.missingSkills.length})
              </span>
            </div>
            {candidate.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {candidate.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]"
                  >
                    ✕ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 italic">Candidate demonstrates coverage across all primary keywords.</p>
            )}
          </div>

          {/* Technical Audit Breakdown */}
          {candidate.rawBreakdown && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                {candidate.rawBreakdown.method === 'gemini_ai' ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Binary className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span>Technical Audit Trail</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600 pt-1">
                <div>
                  <span className="text-slate-600">Method: </span>
                  <span className="font-mono font-bold text-slate-800">{candidate.rawBreakdown.method}</span>
                </div>
                {candidate.rawBreakdown.model && (
                  <div>
                    <span className="text-slate-600">Model: </span>
                    <span className="font-mono font-bold text-slate-800">{candidate.rawBreakdown.model}</span>
                  </div>
                )}
                {candidate.rawBreakdown.similarity !== undefined && (
                  <div>
                    <span className="text-slate-600">Raw Sim: </span>
                    <span className="font-mono font-bold text-slate-800">{candidate.rawBreakdown.similarity}</span>
                  </div>
                )}
              </div>
              {candidate.rawBreakdown.details && (
                <p className="text-slate-600 pt-1 border-t border-slate-200/60 mt-1">
                  {candidate.rawBreakdown.details}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyBrief}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Recruiter Brief'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
