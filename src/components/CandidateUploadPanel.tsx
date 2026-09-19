import React, { useRef, useState } from 'react';
import { Users, UploadCloud, File, Trash2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { CandidateCV } from '../types';

interface CandidateUploadPanelProps {
  candidates: CandidateCV[];
  onAddCandidates: (newCandidates: CandidateCV[]) => void;
  onRemoveCandidate: (id: string) => void;
  onClearCandidates: () => void;
  onLoadSamples: () => void;
  isProcessing: boolean;
}

export const CandidateUploadPanel: React.FC<CandidateUploadPanelProps> = ({
  candidates,
  onAddCandidates,
  onRemoveCandidate,
  onClearCandidates,
  onLoadSamples,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualText, setManualText] = useState('');

  const processFiles = (files: FileList | File[]) => {
    const newItems: CandidateCV[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const lowerName = file.name.toLowerCase();
      if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.docx') && !lowerName.endsWith('.doc') && !lowerName.endsWith('.txt')) {
        continue;
      }

      const cleanCandidateName = file.name
        .replace(/\.(pdf|docx|doc|txt)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/(resume|cv|biodata)/gi, '')
        .trim() || 'Candidate';

      newItems.push({
        id: `cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: cleanCandidateName,
        fileName: file.name,
        content: '', // Will be extracted on server from the buffer or read locally if txt
        file,
        source: 'uploaded'
      });
    }

    if (newItems.length > 0) {
      onAddCandidates(newItems);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const name = manualName.trim() || 'Candidate';
    onAddCandidates([
      {
        id: `cv-manual-${Date.now()}`,
        name,
        fileName: `${name.replace(/\s+/g, '_')}_Resume.txt`,
        content: manualText.trim(),
        source: 'pasted'
      }
    ]);

    setManualName('');
    setManualText('');
    setIsManualModalOpen(false);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                2. Candidate Resumes &amp; CVs
              </h2>
              <span className="text-xs px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 font-bold">
                {candidates.length} candidate{candidates.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Batch upload PDF, DOCX, TXT files or use pre-loaded sample applicants
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onLoadSamples}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Load 5 Sample Profiles</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Paste CV Text</span>
          </button>

          {candidates.length > 0 && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClearCandidates}
              className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1 disabled:opacity-50 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt"
        disabled={isProcessing}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-amber-500 bg-amber-50/70 scale-[0.99]'
            : 'border-slate-200 hover:border-amber-400 hover:bg-slate-50/70'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              Drag &amp; drop CV files here, or <span className="text-amber-600 underline">browse files</span>
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Supports PDF, DOCX, and TXT • Batch up to 50 files per evaluation run
            </p>
          </div>
        </div>
      </div>

      {/* Candidate List chips / cards */}
      {candidates.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>No CVs added yet. Click &quot;Load 5 Sample Profiles&quot; to test immediately, or upload files above.</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Ready for screening ({candidates.length})</span>
            <span>Batch total: {candidates.length} file{candidates.length === 1 ? '' : 's'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                    <File className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {cand.name}
                    </p>
                    <p className="text-[10px] text-slate-600 truncate">
                      {cand.fileName}
                      {cand.source === 'sample' && (
                        <span className="ml-1.5 px-1 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                          Sample
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCandidate(cand.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors ml-1"
                  title="Remove candidate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Paste Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900">
              Paste Candidate Resume Text
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Anand Mahindra"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resume Content
                </label>
                <textarea
                  rows={8}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste experience, skills, education, certifications..."
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-200 focus:border-amber-500 outline-none resize-y"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddManual}
                disabled={!manualText.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
