import React from 'react';
import { Sun, ShieldCheck, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { HealthResponse } from '../types';

interface HeaderProps {
  health: HealthResponse | null;
}

export const Header: React.FC<HeaderProps> = ({ health }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <Sun className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Sunjet Energy
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Talent Funnel &amp; CV Ranker
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Zero-PII Storage • In-Memory Evaluation Engine
            </p>
          </div>
        </div>

        {/* Badges & system status */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Privacy badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">DPDP Compliant (Zero Retention)</span>
          </div>

          {/* AI Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium">Gemini 2.5 Flash + TF-IDF Baseline</span>
          </div>

          {/* Ollama local status */}
          {health?.ollamaAvailable ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Ollama Local Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>TF-IDF Safe Fallback</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
