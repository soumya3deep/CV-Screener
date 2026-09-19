import React, { useRef } from 'react';
import { FileText, Upload, Sparkles, X, CheckCircle } from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTIONS, SampleJobDescription } from '../sampleData';

interface JobDescriptionPanelProps {
  jdText: string;
  onChangeJdText: (text: string) => void;
  jdFile: File | null;
  onSelectJdFile: (file: File | null) => void;
  isProcessing: boolean;
}

export const JobDescriptionPanel: React.FC<JobDescriptionPanelProps> = ({
  jdText,
  onChangeJdText,
  jdFile,
  onSelectJdFile,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onSelectJdFile(file);

    // If it's a plain text file or markdown, read immediately into text area
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) onChangeJdText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSelectPreset = (preset: SampleJobDescription) => {
    onSelectJdFile(null);
    onChangeJdText(preset.text);
  };

  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;
  const charCount = jdText.length;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              1. Job Description (Target Role)
            </h2>
            <p className="text-xs text-slate-600">
              Paste JD text or upload PDF/DOCX/TXT specification
            </p>
          </div>
        </div>

        {/* Quick JD Preset dropdown/buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Roles:
          </span>
          {SAMPLE_JOB_DESCRIPTIONS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSelectPreset(preset)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors disabled:opacity-50"
            >
              {preset.title.split('-')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* File attachment indicator or upload button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          disabled={isProcessing}
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>{jdFile ? 'Replace JD File' : 'Upload JD File (PDF, DOCX, TXT)'}</span>
        </button>

        {jdFile && (
          <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
            <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium truncate max-w-xs">{jdFile.name}</span>
            <button
              type="button"
              onClick={() => {
                onSelectJdFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-amber-700 hover:text-amber-900 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          rows={8}
          disabled={isProcessing}
          value={jdText}
          onChange={(e) => onChangeJdText(e.target.value)}
          placeholder="Paste full Job Description text here (responsibilities, required skills, certifications, tools, experience level)..."
          className="w-full text-xs font-mono p-3 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 bg-white placeholder-slate-400 resize-y leading-relaxed outline-none"
        />
        {jdText.trim() && (
          <button
            type="button"
            onClick={() => onChangeJdText('')}
            className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded bg-white/80"
            title="Clear text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Footer Counters */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
        <div>
          {wordCount > 0 ? (
            <span>
              {wordCount} words • {charCount} characters
            </span>
          ) : (
            <span className="text-amber-600 font-semibold">
              * Job Description is required to run candidate evaluation
            </span>
          )}
        </div>
        <div>
          {jdText.length > 5000 && (
            <span className="text-amber-600">
              Note: Long JDs will be efficiently summarized for scoring.
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
