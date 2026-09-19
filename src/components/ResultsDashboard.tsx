import React, { useState, useMemo } from 'react';
import { Download, Search, CheckCircle2, AlertCircle, Clock, ChevronRight, UserCheck, Sparkles, Filter } from 'lucide-react';
import { CandidateResult, TierThresholds } from '../types';

interface ResultsDashboardProps {
  results: CandidateResult[];
  thresholds: TierThresholds;
  onExportExcel: () => void;
  isExporting: boolean;
  onSelectCandidate: (candidate: CandidateResult) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  thresholds,
  onExportExcel,
  isExporting,
  onSelectCandidate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'name'>('score_desc');

  // Tier counts
  const tier1Count = results.filter((r) => r.tier === 1).length;
  const tier2Count = results.filter((r) => r.tier === 2).length;
  const tier3Count = results.filter((r) => r.tier === 3).length;
  const totalCount = results.length;

  const tier1Pct = totalCount > 0 ? Math.round((tier1Count / totalCount) * 100) : 0;
  const tier2Pct = totalCount > 0 ? Math.round((tier2Count / totalCount) * 100) : 0;
  const tier3Pct = totalCount > 0 ? Math.round((tier3Count / totalCount) * 100) : 0;

  // Filtered and sorted results
  const filteredResults = useMemo(() => {
    return results
      .filter((candidate) => {
        // Tier filter
        if (selectedTierFilter !== 'all' && candidate.tier !== selectedTierFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = candidate.candidateName.toLowerCase().includes(q);
          const matchFile = candidate.fileName.toLowerCase().includes(q);
          const matchSkills = candidate.matchedSkills.some((s) => s.toLowerCase().includes(q));
          const matchAction = candidate.nextAction.toLowerCase().includes(q);
          if (!matchName && !matchFile && !matchSkills && !matchAction) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') return b.score - a.score;
        if (sortBy === 'score_asc') return a.score - b.score;
        return a.candidateName.localeCompare(b.candidateName);
      });
  }, [results, selectedTierFilter, searchQuery, sortBy]);

  return (
    <section className="space-y-6">
      {/* Top Banner & Export Action */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Screening Results &amp; Talent Funnel
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              {totalCount} Candidates Evaluated
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Ranked by relevance against requirements • Tier 1: Interview • Tier 2: Screen • Tier 3: Reserve
          </p>
        </div>

        <button
          type="button"
          onClick={onExportExcel}
          disabled={isExporting || totalCount === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-black transition-all shadow-xs disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{isExporting ? 'Generating Excel...' : 'Export Styled Excel Report (.xlsx)'}</span>
        </button>
      </div>

      {/* 3-Tier Funnel KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 Card */}
        <div
          onClick={() => setSelectedTierFilter(selectedTierFilter === 1 ? 'all' : 1)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedTierFilter === 1
              ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-400/30'
              : 'border-slate-200 bg-white hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Tier 1 • Top Pick
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{tier1Count}</span>
            <span className="text-xs font-semibold text-slate-600">
              candidates ({tier1Pct}%)
            </span>
          </div>

          <p className="text-[11px] text-slate-600 mt-1 font-medium">
            Score ≥ {Math.round(thresholds.tier1_min * 100)}% • Ready for Stage 1 Technical / Leadership Interview
          </p>
        </div>

        {/* Tier 2 Card */}
        <div
          onClick={() => setSelectedTierFilter(selectedTierFilter === 2 ? 'all' : 2)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedTierFilter === 2
              ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/30'
              : 'border-slate-200 bg-white hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
              Tier 2 • Technical Screen
            </span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{tier2Count}</span>
            <span className="text-xs font-semibold text-slate-600">
              candidates ({tier2Pct}%)
            </span>
          </div>

          <p className="text-[11px] text-slate-600 mt-1 font-medium">
            Score {Math.round(thresholds.tier2_min * 100)}% – {Math.round(thresholds.tier1_min * 100) - 1}% • Recommended for targeted technical test
          </p>
        </div>

        {/* Tier 3 Card */}
        <div
          onClick={() => setSelectedTierFilter(selectedTierFilter === 3 ? 'all' : 3)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedTierFilter === 3
              ? 'border-slate-400 bg-slate-100 shadow-xs ring-2 ring-slate-400/30'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
              Tier 3 • Future Reserve
            </span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{tier3Count}</span>
            <span className="text-xs font-semibold text-slate-600">
              candidates ({tier3Pct}%)
            </span>
          </div>

          <p className="text-[11px] text-slate-600 mt-1 font-medium">
            Score &lt; {Math.round(thresholds.tier2_min * 100)}% • Retain on file for junior or alternate pipelines
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, matched skills, or keywords..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 outline-none"
          />
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setSelectedTierFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedTierFilter === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter(1)}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedTierFilter === 1
                ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            Tier 1 ({tier1Count})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter(2)}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedTierFilter === 2
                ? 'bg-amber-600 text-white font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            Tier 2 ({tier2Count})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter(3)}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedTierFilter === 3
                ? 'bg-slate-700 text-white font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            Tier 3 ({tier3Count})
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-500 font-semibold text-slate-700"
          >
            <option value="score_desc">Score: Highest to Lowest</option>
            <option value="score_asc">Score: Lowest to Highest</option>
            <option value="name">Candidate Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Candidate List / Cards */}
      {filteredResults.length === 0 ? (
        <div className="p-8 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">No candidates match your current filter.</p>
          <p className="text-slate-600">Try clearing the search text or switching tier filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((candidate, idx) => {
            const scorePct = Math.round(candidate.score * 100);

            const isTier1 = candidate.tier === 1;
            const isTier2 = candidate.tier === 2;

            return (
              <div
                key={candidate.fileName + idx}
                onClick={() => onSelectCandidate(candidate)}
                className="group bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs rounded-xl p-4 transition-all cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Rank circle */}
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    #{idx + 1}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {candidate.candidateName}
                      </h3>

                      {/* Tier Badge */}
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-bold border ${
                          isTier1
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isTier2
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        Tier {candidate.tier} • {isTier1 ? 'Shortlist' : isTier2 ? 'Screen' : 'Reserve'}
                      </span>

                      <span className="text-[11px] text-slate-600 font-mono">
                        {candidate.fileName}
                      </span>
                    </div>

                    {/* Matched & Missing Skills preview */}
                    <div className="flex items-center flex-wrap gap-1.5 text-xs">
                      {candidate.matchedSkills.slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-100"
                        >
                          ✓ {skill}
                        </span>
                      ))}

                      {candidate.missingSkills.slice(0, 2).map((gap, gIdx) => (
                        <span
                          key={gIdx}
                          className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[10px] font-semibold border border-rose-100"
                        >
                          ✕ {gap}
                        </span>
                      ))}

                      {candidate.matchedSkills.length > 4 && (
                        <span className="text-[10px] text-slate-600 font-medium">
                          +{candidate.matchedSkills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Recruiter Action */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">Next Action:</span>
                      <span className="truncate">{candidate.nextAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score & View Details Button */}
                <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xl font-black text-slate-900">
                        {scorePct}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium block">
                      Match Score
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                    <span>View Dossier</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
