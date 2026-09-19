import React from 'react';
import { Sliders, Sparkles, Binary, Server, RefreshCw, Info } from 'lucide-react';
import { ScreeningSettings, ScoringMethod, HealthResponse } from '../types';

interface SidebarConfigProps {
  settings: ScreeningSettings;
  onChangeSettings: (newSettings: ScreeningSettings) => void;
  health: HealthResponse | null;
  onResetSampleData: () => void;
  onClearAll: () => void;
  isProcessing: boolean;
}

export const SidebarConfig: React.FC<SidebarConfigProps> = ({
  settings,
  onChangeSettings,
  health,
  onResetSampleData,
  onClearAll,
  isProcessing
}) => {
  const handleTier1Change = (val: number) => {
    // Ensure Tier 1 is always greater than Tier 2
    const tier1 = Math.max(val, settings.tierThresholds.tier2_min + 0.05);
    onChangeSettings({
      ...settings,
      tierThresholds: {
        ...settings.tierThresholds,
        tier1_min: Math.round(tier1 * 100) / 100
      }
    });
  };

  const handleTier2Change = (val: number) => {
    // Ensure Tier 2 is always less than Tier 1
    const tier2 = Math.min(val, settings.tierThresholds.tier1_min - 0.05);
    onChangeSettings({
      ...settings,
      tierThresholds: {
        ...settings.tierThresholds,
        tier2_min: Math.round(tier2 * 100) / 100
      }
    });
  };

  const handleMethodChange = (method: ScoringMethod) => {
    onChangeSettings({
      ...settings,
      method
    });
  };

  const handleTopKChange = (topK: number) => {
    onChangeSettings({
      ...settings,
      topK
    });
  };

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-semibold">
          <Sliders className="w-4 h-4 text-amber-600" />
          <span>Screening Parameters</span>
        </div>
        <span className="text-xs text-slate-600 font-medium">Config</span>
      </div>

      {/* 1. Funnel Thresholds */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Tier 1 Threshold (Interview Shortlist)</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            ≥ {Math.round(settings.tierThresholds.tier1_min * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="95"
          step="1"
          disabled={isProcessing}
          value={Math.round(settings.tierThresholds.tier1_min * 100)}
          onChange={(e) => handleTier1Change(Number(e.target.value) / 100)}
          className="w-full accent-emerald-600 cursor-pointer disabled:opacity-50"
        />

        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pt-1">
          <span>Tier 2 Threshold (Technical Screen)</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
            ≥ {Math.round(settings.tierThresholds.tier2_min * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="74"
          step="1"
          disabled={isProcessing}
          value={Math.round(settings.tierThresholds.tier2_min * 100)}
          onChange={(e) => handleTier2Change(Number(e.target.value) / 100)}
          className="w-full accent-amber-600 cursor-pointer disabled:opacity-50"
        />

        <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Tier 3 (&lt; {Math.round(settings.tierThresholds.tier2_min * 100)}%) candidates are tagged for reserve talent pools or future openings.
          </span>
        </div>
      </div>

      {/* 2. Scoring Method */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-700">
          Evaluation Engine
        </label>
        <div className="space-y-2">
          {/* Gemini AI */}
          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              settings.method === 'gemini_ai'
                ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <input
              type="radio"
              name="method"
              disabled={isProcessing}
              checked={settings.method === 'gemini_ai'}
              onChange={() => handleMethodChange('gemini_ai')}
              className="mt-1 accent-amber-600"
            />
            <div className="text-xs">
              <div className="font-semibold flex items-center gap-1.5 text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Gemini 2.5 Flash AI</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">Recommended</span>
              </div>
              <p className="text-slate-600 mt-0.5 text-[11px]">
                Contextual qualification reasoning, nuance detection, and automated recruiter pros/cons.
              </p>
            </div>
          </label>

          {/* TF-IDF Baseline */}
          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              settings.method === 'tfidf'
                ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <input
              type="radio"
              name="method"
              disabled={isProcessing}
              checked={settings.method === 'tfidf'}
              onChange={() => handleMethodChange('tfidf')}
              className="mt-1 accent-amber-600"
            />
            <div className="text-xs">
              <div className="font-semibold flex items-center gap-1.5 text-slate-900">
                <Binary className="w-3.5 h-3.5 text-indigo-600" />
                <span>TF-IDF + Cosine Baseline</span>
              </div>
              <p className="text-slate-600 mt-0.5 text-[11px]">
                Deterministic mathematical term frequency vectorizer. Zero external API calls, 100% offline.
              </p>
            </div>
          </label>

          {/* Ollama */}
          <label
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
              health?.ollamaAvailable
                ? 'cursor-pointer'
                : 'opacity-65 cursor-not-allowed bg-slate-50'
            } ${
              settings.method === 'ollama'
                ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <input
              type="radio"
              name="method"
              disabled={isProcessing || !health?.ollamaAvailable}
              checked={settings.method === 'ollama'}
              onChange={() => handleMethodChange('ollama')}
              className="mt-1 accent-amber-600"
            />
            <div className="text-xs">
              <div className="font-semibold flex items-center gap-1.5 text-slate-900">
                <Server className="w-3.5 h-3.5 text-blue-600" />
                <span>Local Ollama</span>
                {!health?.ollamaAvailable && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">Offline</span>
                )}
              </div>
              <p className="text-slate-600 mt-0.5 text-[11px]">
                {health?.ollamaAvailable
                  ? 'Connected to local Ollama runtime on port 11434.'
                  : 'Ollama not detected on 127.0.0.1:11434 (TF-IDF fallback active).'}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* 3. Top-K Skills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Top-K Skills to Extract</span>
          <span className="font-bold text-slate-900">{settings.topK}</span>
        </div>
        <input
          type="range"
          min="5"
          max="20"
          step="1"
          disabled={isProcessing}
          value={settings.topK}
          onChange={(e) => handleTopKChange(Number(e.target.value))}
          className="w-full accent-amber-600 cursor-pointer disabled:opacity-50"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>5 skills</span>
          <span>10 (standard)</span>
          <span>20 skills</span>
        </div>
      </div>

      {/* 4. Reset & Presets */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        <button
          type="button"
          onClick={onResetSampleData}
          disabled={isProcessing}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
          <span>Reload Sample Scenario (5 CVs)</span>
        </button>

        <button
          type="button"
          onClick={onClearAll}
          disabled={isProcessing}
          className="w-full px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Clear Workspace
        </button>
      </div>
    </aside>
  );
};
