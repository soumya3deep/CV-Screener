import React, { useState, useEffect } from 'react';
import { Play, Sparkles, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { SidebarConfig } from './components/SidebarConfig';
import { JobDescriptionPanel } from './components/JobDescriptionPanel';
import { CandidateUploadPanel } from './components/CandidateUploadPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import {
  CandidateCV,
  CandidateResult,
  ScreeningSettings,
  HealthResponse,
  ScreeningResponse
} from './types';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_CANDIDATES } from './sampleData';

export function App() {
  // State
  const [jdText, setJdText] = useState<string>(SAMPLE_JOB_DESCRIPTIONS[0].text);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [candidates, setCandidates] = useState<CandidateCV[]>(SAMPLE_CANDIDATES);
  const [settings, setSettings] = useState<ScreeningSettings>({
    tierThresholds: {
      tier1_min: 0.75,
      tier2_min: 0.50
    },
    method: 'gemini_ai',
    topK: 10
  });

  const [results, setResults] = useState<CandidateResult[] | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);

  // Health check on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: HealthResponse) => {
        setHealth(data);
      })
      .catch((err) => {
        console.warn('Could not check health endpoint:', err);
      });
  }, []);

  // Candidate management handlers
  const handleAddCandidates = (newItems: CandidateCV[]) => {
    setCandidates((prev) => [...prev, ...newItems]);
    setErrorMessage(null);
  };

  const handleRemoveCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearCandidates = () => {
    setCandidates([]);
  };

  const handleLoadSamples = () => {
    setCandidates(SAMPLE_CANDIDATES);
    setErrorMessage(null);
  };

  const handleResetSampleData = () => {
    setJdText(SAMPLE_JOB_DESCRIPTIONS[0].text);
    setJdFile(null);
    setCandidates(SAMPLE_CANDIDATES);
    setResults(null);
    setErrorMessage(null);
  };

  const handleClearAll = () => {
    setJdText('');
    setJdFile(null);
    setCandidates([]);
    setResults(null);
    setErrorMessage(null);
  };

  // Run screening request to backend
  const handleRunScreening = async () => {
    if (!jdText.trim() && !jdFile) {
      setErrorMessage('Please provide a Job Description (paste text or upload file).');
      return;
    }

    if (candidates.length === 0) {
      setErrorMessage('Please upload or load at least one candidate CV to evaluate.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingProgress('Preparing Job Description and candidate files...');

    try {
      // Check if there are binary files that need multipart upload
      const hasBinaryFiles = Boolean(jdFile || candidates.some((c) => c.file));

      let response: Response;

      if (hasBinaryFiles) {
        setProcessingProgress('Uploading documents for text extraction & scoring...');
        const formData = new FormData();
        if (jdText.trim()) formData.append('jd_text', jdText.trim());
        if (jdFile) formData.append('jd_file', jdFile);

        formData.append('tier1_min', String(settings.tierThresholds.tier1_min));
        formData.append('tier2_min', String(settings.tierThresholds.tier2_min));
        formData.append('method', settings.method);
        formData.append('top_k', String(settings.topK));

        // Append candidate files
        candidates.forEach((cand) => {
          if (cand.file) {
            formData.append('cv_files', cand.file);
          }
        });

        // Also pass any text/sample candidates in cv_list
        const inlineCandidates = candidates
          .filter((c) => !c.file && c.content)
          .map((c) => ({
            name: c.name,
            fileName: c.fileName,
            content: c.content
          }));

        if (inlineCandidates.length > 0) {
          formData.append('cv_list', JSON.stringify(inlineCandidates));
        }

        response = await fetch('/api/screen', {
          method: 'POST',
          body: formData
        });
      } else {
        // Fast JSON payload
        setProcessingProgress('Evaluating candidate profiles with AI ranker...');
        const payload = {
          jd_text: jdText.trim(),
          tier1_min: settings.tierThresholds.tier1_min,
          tier2_min: settings.tierThresholds.tier2_min,
          method: settings.method,
          top_k: settings.topK,
          cv_list: candidates.map((c) => ({
            name: c.name,
            fileName: c.fileName,
            content: c.content
          }))
        };

        response = await fetch('/api/screen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Screening failed' }));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data: ScreeningResponse = await response.json();
      setResults(data.results || []);
      setProcessingProgress('');

      // Scroll smoothly down to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error running screening:', err);
      setErrorMessage(err.message || 'An error occurred during screening');
    } finally {
      setIsProcessing(false);
      setProcessingProgress('');
    }
  };

  // Export Excel report
  const handleExportExcel = async () => {
    if (!results || results.length === 0) return;

    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results })
      });

      if (!response.ok) {
        throw new Error('Failed to generate Excel report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sunjet_talent_funnel_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Failed to export Excel report: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <Header health={health} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-800 font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top 2-Column Section: Left Sidebar Config, Right JD + Upload Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Sidebar Config (1 col on desktop) */}
          <div className="lg:col-span-1">
            <SidebarConfig
              settings={settings}
              onChangeSettings={setSettings}
              health={health}
              onResetSampleData={handleResetSampleData}
              onClearAll={handleClearAll}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right Column: Workflow Steps (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Job Description */}
            <JobDescriptionPanel
              jdText={jdText}
              onChangeJdText={setJdText}
              jdFile={jdFile}
              onSelectJdFile={setJdFile}
              isProcessing={isProcessing}
            />

            {/* Step 2: Candidates */}
            <CandidateUploadPanel
              candidates={candidates}
              onAddCandidates={handleAddCandidates}
              onRemoveCandidate={handleRemoveCandidate}
              onClearCandidates={handleClearCandidates}
              onLoadSamples={handleLoadSamples}
              isProcessing={isProcessing}
            />

            {/* Run Screening Action Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 text-center sm:text-left">
                <span className="font-bold text-slate-900 block sm:inline sm:mr-1">
                  Ready to Screen:
                </span>
                <span>
                  {candidates.length} Candidate{candidates.length === 1 ? '' : 's'} vs 1 Job Specification
                </span>
              </div>

              <button
                type="button"
                id="run-screening-btn"
                disabled={isProcessing || (!jdText.trim() && !jdFile) || candidates.length === 0}
                onClick={handleRunScreening}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{processingProgress || 'Evaluating Candidates...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Talent Screening</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div id="results-section" className="pt-4">
            <ResultsDashboard
              results={results}
              thresholds={settings.tierThresholds}
              onExportExcel={handleExportExcel}
              isExporting={isExporting}
              onSelectCandidate={setSelectedCandidate}
            />
          </div>
        )}
      </main>

      {/* Candidate Dossier Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Sunjet Energy Pvt. Ltd. • Human Resources &amp; Technical Talent Acquisition</p>
          <p className="text-slate-600 font-medium">In-Memory Zero PII Retention • Compliant with Indian DPDP Act 2023</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
