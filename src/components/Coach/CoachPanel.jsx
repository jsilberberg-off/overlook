import React, { useMemo, useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { getHeuristicCoachFeedback } from '../../utils/coachHeuristics';
import { fetchAICoachFeedback, isAICoachEnabled } from '../../services/aiCoach';

function normalizeArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  return [String(v)];
}

export default function CoachPanel({ stepId, data, missingFields = [] }) {
  const [open, setOpen] = useState(stepId !== 'frame');
  const [ai, setAi] = useState({ loading: false, error: null, result: null });

  const heuristic = useMemo(() => getHeuristicCoachFeedback(stepId, data), [stepId, data]);

  const requiredMissing = useMemo(() => (missingFields || []).map((f) => f.label), [missingFields]);

  const requestAI = async () => {
    setAi({ loading: true, error: null, result: null });
    try {
      const result = await fetchAICoachFeedback({ stepId, data });
      setAi({ loading: false, error: null, result });
    } catch (e) {
      setAi({ loading: false, error: e?.message || 'AI coach error', result: null });
    }
  };

  // Don’t show on the final “What Now?” step unless users open it.
  const show = stepId !== 'next' ? true : open;

  if (!show) return null;

  return (
    <div className="mt-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center px-5 py-4 rounded-2xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900/90 text-teal-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="font-extrabold text-slate-900">Coach</div>
            <div className="text-xs text-slate-500">Quality checks + optional AI feedback</div>
          </div>
        </div>
      </button>

      {open && (
        <div className="mt-4 glass-panel rounded-3xl p-6 space-y-6">
          {requiredMissing.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-teal-50/80 border border-teal-100">
              <AlertTriangle className="w-5 h-5 text-teal-700 mt-0.5" />
              <div>
                <div className="font-bold text-teal-900 text-sm">Missing required fields</div>
                <div className="text-xs text-teal-800 mt-1">{requiredMissing.join(', ')}</div>
              </div>
            </div>
          )}

          {/* Heuristic warnings */}
          {heuristic.warnings.length > 0 ? (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Credibility flags</div>
              <div className="space-y-3">
                {heuristic.warnings.slice(0, 6).map((w, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-slate-200/60">
                    <div className="font-bold text-slate-900 text-sm">{w.title}</div>
                    {w.detail && <div className="text-xs text-slate-600 mt-1">{w.detail}</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <div className="text-sm font-bold text-emerald-900">No obvious credibility gaps detected in this step.</div>
            </div>
          )}

          {/* Heuristic suggestions */}
          {heuristic.suggestions.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Next-level improvements</div>
              <ul className="space-y-2">
                {heuristic.suggestions.slice(0, 5).map((s, idx) => (
                  <li key={idx} className="text-sm text-slate-700">
                    <span className="font-bold">{s.title}</span>
                    {s.detail ? <span className="text-slate-500"> — {s.detail}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI feedback */}
          <div className="pt-2 border-t border-white/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optional AI feedback</div>
                <div className="text-xs text-slate-500 mt-1">
                  Uses your configured endpoint; should not add facts you didn’t provide.
                </div>
              </div>
              <button
                onClick={requestAI}
                disabled={!isAICoachEnabled() || ai.loading}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                  !isAICoachEnabled() || ai.loading
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:scale-[1.02] shadow-lg'
                }`}
                title={!isAICoachEnabled() ? 'Set VITE_AI_COACH_ENDPOINT to enable.' : 'Request AI feedback'}
              >
                <RefreshCcw className={`w-4 h-4 ${ai.loading ? 'animate-spin' : ''}`} />
                {ai.loading ? 'Asking…' : 'Ask AI'}
              </button>
            </div>

            {!isAICoachEnabled() && (
              <div className="mt-3 text-xs text-slate-500 bg-white/60 border border-white/60 px-4 py-3 rounded-2xl">
                To enable: set <span className="font-mono font-bold">VITE_AI_COACH_ENDPOINT</span> in your environment.
              </div>
            )}

            {ai.error && (
              <div className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-100 px-4 py-3 rounded-2xl">
                {ai.error}
              </div>
            )}

            {ai.result && (
              <div className="mt-4 space-y-4">
                {normalizeArray(ai.result.improvements).length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI improvements</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {normalizeArray(ai.result.improvements).slice(0, 6).map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {normalizeArray(ai.result.risks).length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI risks / red flags</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {normalizeArray(ai.result.risks).slice(0, 6).map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Flexible fallback rendering */}
                {!ai.result.improvements && !ai.result.risks && (
                  <pre className="text-xs bg-slate-950 text-slate-100 rounded-2xl p-4 overflow-x-auto">
                    {JSON.stringify(ai.result, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
