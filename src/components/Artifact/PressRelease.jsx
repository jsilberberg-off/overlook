import React, { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { ARCHETYPES } from '../../constants/data';

const compact = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');
const placeholder = (value, fallback) => (compact(value) ? compact(value) : fallback);

const evidenceStrengthLabel = (value) => {
  const map = {
    randomized_trial: 'Randomized trial',
    quasi_experimental: 'Quasi-experimental',
    observational: 'Observational',
    internal_analytics: 'Internal analytics',
    anecdotal: 'Anecdotal',
    none: 'Not specified'
  };
  return map[value] || 'Not specified';
};

const buildPressReleaseText = (data) => {
  const archetypeLabel = (ARCHETYPES.find((item) => item.id === data.archetype) || ARCHETYPES[0])?.label;
  const currentYear = new Date().getFullYear();
  const location = placeholder(data.location, '[Location]');
  const futureDate = placeholder(data.futureDate, '[Target date]');
  const programName = placeholder(data.programName, '[Grant investment]');
  const beneficiary = placeholder(data.beneficiary, '[Beneficiary]');
  const granteeOrg = compact(data.granteeOrg);
  const granteeFocus = compact(data.granteeFocus);
  const problem = placeholder(data.problem, '[Current reality]');
  const mechanism = placeholder(data.solution, '[Mechanism of change]');
  const scale = placeholder(data.scaleMechanism, '[Mechanism of scale]');

  return [
    'Internal Draft - Future Retrospective',
    'Not for distribution',
    `Archetype: ${archetypeLabel || 'Grant investment'}`,
    '',
    placeholder(data.headline, '[Future headline]'),
    placeholder(data.subheadline, '[Optional subheadline]'),
    '',
    `${location} - ${futureDate} - Today, the Foundation marked the successful conclusion of ${programName}, an investment that changed outcomes for ${beneficiary}.`,
    granteeOrg ? `The work was led by ${granteeOrg}${granteeFocus ? `, focused on ${granteeFocus}` : ''}.` : '',
    '',
    `The Challenge (${currentYear})`,
    problem,
    '',
    'The Mechanism',
    mechanism,
    '',
    'How It Scaled',
    scale,
    '',
    compact(data.evidence) ? `Undeniable Proof: ${compact(data.evidence)}` : '',
    compact(data.evidenceSummary) ? `Evidence Summary: ${compact(data.evidenceSummary)}` : '',
    compact(data.keyUncertainties) ? `Key Uncertainties: ${compact(data.keyUncertainties)}` : '',
    compact(data.internalQuote) ? `"${compact(data.internalQuote)}" - ${placeholder(data.internalSpeaker, 'Internal speaker')}` : '',
    compact(data.externalQuote) ? `"${compact(data.externalQuote)}" - ${placeholder(data.externalSpeaker, 'External speaker')}` : '',
    '',
    compact(data.decisionToInform) ? `Decision to inform: ${compact(data.decisionToInform)}` : '',
    compact(data.keyRisks) ? `Top risks: ${compact(data.keyRisks)}` : '',
    compact(data.killCriteria) ? `Kill criteria: ${compact(data.killCriteria)}` : '',
    compact(data.nextExperiment) ? `Next experiment: ${compact(data.nextExperiment)}` : ''
  ]
    .filter(Boolean)
    .join('\n');
};

export default function PressReleaseArtifact({ data, onClose, onToast }) {
  const archetypeLabel = (ARCHETYPES.find((item) => item.id === data.archetype) || ARCHETYPES[0])?.label;
  const currentYear = new Date().getFullYear();
  const location = placeholder(data.location, '[Location]');
  const futureDate = placeholder(data.futureDate, '[Target date]');
  const programName = placeholder(data.programName, '[Grant investment]');
  const beneficiary = placeholder(data.beneficiary, '[Beneficiary]');
  const granteeOrg = compact(data.granteeOrg);
  const granteeFocus = compact(data.granteeFocus);

  useEffect(() => {
    document.body.classList.add('artifact-open');
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('artifact-open');
    };
  }, [onClose]);

  const copyToClipboard = async (text, successMsg) => {
    try {
      await navigator.clipboard.writeText(text);
      onToast?.(successMsg || 'Copied to clipboard.');
    } catch {
      onToast?.("Could not copy automatically. Please copy manually.", 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-md p-4 md:p-6 overflow-y-auto">
      <div className="mx-auto max-w-6xl min-h-[90vh] bg-white rounded-3xl shadow-2xl border border-white/40 flex flex-col md:flex-row overflow-hidden">
        <aside className="md:w-80 bg-slate-950 text-slate-100 p-6 md:p-7 relative border-b md:border-b-0 md:border-r border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-6">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300 mb-5 border-b border-slate-800 pb-2">
            Impact Summary
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Scope</div>
              <div className="text-xl font-semibold text-white">{placeholder(data.problemScope, '-')}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Success Metric</div>
              <div className="text-lg font-semibold text-teal-200">{placeholder(data.successMetric, '-')}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Mechanism of Scale</div>
              <div className="text-sm leading-relaxed text-slate-300">{placeholder(data.scaleMechanism, '-')}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Evidence Strength</div>
              <div className="text-sm leading-relaxed text-slate-300">{evidenceStrengthLabel(data.evidenceStrength)}</div>
            </div>
            {compact(data.effectRange) && (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Effect Range</div>
                <div className="text-sm leading-relaxed text-slate-300">{compact(data.effectRange)}</div>
              </div>
            )}
          </div>

          {(compact(data.decisionToInform) || compact(data.keyRisks) || compact(data.killCriteria) || compact(data.nextExperiment)) && (
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Decision Notes</div>
              {compact(data.decisionToInform) && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Decision</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{compact(data.decisionToInform)}</div>
                </div>
              )}
              {compact(data.keyRisks) && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Risks</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{compact(data.keyRisks)}</div>
                </div>
              )}
              {compact(data.killCriteria) && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Kill Criteria</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{compact(data.killCriteria)}</div>
                </div>
              )}
              {compact(data.nextExperiment) && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">Next 90 Days</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{compact(data.nextExperiment)}</div>
                </div>
              )}
            </div>
          )}
        </aside>

        <section className="flex-1 bg-[#fcfbf8] p-7 md:p-10 overflow-y-auto artifact-scroll">
          <div className="mb-8 pb-5 border-b-2 border-slate-900/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Internal Draft - Future Retrospective</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 mt-1">Not for distribution</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 mt-1">Archetype: {archetypeLabel}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => copyToClipboard(data.headline || '', 'Headline copied.')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-teal-200"
              >
                Copy headline
              </button>
              <button
                onClick={() => copyToClipboard(buildPressReleaseText(data), 'Press release copied.')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-teal-200"
              >
                Copy full text
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:opacity-90"
              >
                Print / PDF
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900">
            {placeholder(data.headline, '[Future Headline Goes Here]')}
          </h1>
          <h2 className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed italic">
            {placeholder(data.subheadline, '[Optional subheadline: add scale + mechanism + time window]')}
          </h2>

          <article className="mt-8 space-y-8 text-[17px] leading-relaxed text-slate-700">
            <p>
              <span className="uppercase text-[11px] tracking-[0.18em] font-bold text-slate-500 mr-2">
                {location} - {futureDate} -
              </span>
              Today, the Foundation marked the successful conclusion of <strong>{programName}</strong>, an investment that changed outcomes for {beneficiary}.
              {granteeOrg && (
                <>
                  {' '}
                  The work was led by <strong>{granteeOrg}</strong>
                  {granteeFocus ? <> and focused on {granteeFocus}</> : null}.
                </>
              )}
            </p>

            {compact(data.internalQuote) && (
              <blockquote className="border-l-4 border-teal-500 pl-5 italic text-xl text-slate-800">
                "{compact(data.internalQuote)}"
                {compact(data.internalSpeaker) && (
                  <div className="not-italic text-xs uppercase tracking-widest font-bold text-slate-500 mt-3">- {compact(data.internalSpeaker)}</div>
                )}
              </blockquote>
            )}

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">The Challenge ({currentYear})</h3>
              <p>{placeholder(data.problem, '[Add current reality]')}</p>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">The Mechanism</h3>
              <p>{placeholder(data.solution, '[Add mechanism of change]')}</p>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">How It Scaled</h3>
              <p>{placeholder(data.scaleMechanism, '[Add mechanism of scale]')}</p>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.16em] font-bold text-teal-700 mb-1">Undeniable Proof</h4>
                <p className="text-2xl font-semibold text-slate-900">{placeholder(data.evidence, '[Add the single most convincing proof point]')}</p>
              </div>
              {compact(data.evidenceSummary) && (
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.16em] font-bold text-slate-500 mb-1">Evidence Summary</h4>
                  <p className="text-base text-slate-700">{compact(data.evidenceSummary)}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-1">Evidence Strength</div>
                  <div>{evidenceStrengthLabel(data.evidenceStrength)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-1">Effect Range</div>
                  <div>{placeholder(data.effectRange, 'Not specified')}</div>
                </div>
              </div>
              {compact(data.keyUncertainties) && (
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.16em] font-bold text-slate-500 mb-1">Key Uncertainties</h4>
                  <p className="text-sm text-slate-700">{compact(data.keyUncertainties)}</p>
                </div>
              )}
            </section>

            {compact(data.externalQuote) && (
              <blockquote className="border-l-4 border-slate-300 pl-5 italic text-xl text-slate-700">
                "{compact(data.externalQuote)}"
                {compact(data.externalSpeaker) && (
                  <div className="not-italic text-xs uppercase tracking-widest font-bold text-slate-500 mt-3">- {compact(data.externalSpeaker)}</div>
                )}
              </blockquote>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
