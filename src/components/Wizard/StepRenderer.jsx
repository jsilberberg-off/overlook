import React, { useMemo } from 'react';
import { Telescope, ShieldCheck, FileText, CalendarClock } from 'lucide-react';
import { ARCHETYPES, JARGON_LIST } from '../../constants/data';
import { generateHeadlineCandidates, generateSubheadlineCandidates } from '../../utils/pressReleaseDrafts';
import { headlineLint } from '../../utils/headlineLint';

// Helper for Jargon Warning
const yearFromDate = (dateStr) => {
  if (!dateStr) return '';
  const year = new Date(dateStr).getFullYear();
  return Number.isFinite(year) ? year : '';
};

const JargonWarning = ({ text, year }) => {
  const foundJargon = JARGON_LIST.filter(word => text?.toLowerCase().includes(word));
  if (foundJargon.length === 0) return null;
  return (
    <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <span className="font-bold">⚠️ {year || 'Future'} Language Check:</span> 
      Avoid corporate speak like "{foundJargon.join(', ')}". Be human.
    </div>
  );
};

export default function StepRenderer({ stepId, data, onChange, onPreview, missingFields = [], showValidation = false }) {
  const futureYear = useMemo(() => yearFromDate(data?.futureDate), [data?.futureDate]);
  const inputClass = "w-full p-6 glass-panel rounded-3xl outline-none focus:ring-2 focus:ring-teal-500 text-lg transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2";
  const isMissing = (key) => missingFields.some(field => field.key === key);
  const errorClass = "border border-teal-400/60 ring-1 ring-teal-200/80 focus:ring-teal-400";
  const errorTextClass = "text-xs text-teal-600 mt-2";
  const shouldShowMissing = (key) => showValidation && isMissing(key);
  const programNameLabel = data?.archetype === 'grant' ? 'Grant / investment name (optional)' : 'Portfolio bet name (optional)';
  const programNamePlaceholder = data?.archetype === 'grant' ? 'Grant / investment name (optional)' : 'Portfolio bet name (optional)';
  const scalePlaceholder = data?.archetype === 'grant'
    ? 'How this scales beyond a single grantee (distribution channel, replication, policy…)'
    : 'How this scales at system level (policy, procurement, adoption…)';

  const headlineLintResult = useMemo(() => headlineLint({
    headline: data?.headline,
    successMetric: data?.successMetric,
    beneficiary: data?.beneficiary,
    problemScope: data?.problemScope,
    futureDate: data?.futureDate,
    location: data?.location
  }), [data?.headline, data?.successMetric, data?.beneficiary, data?.problemScope, data?.futureDate, data?.location]);

  switch (stepId) {
    case 'frame': return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Telescope className="w-8 h-8"/>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Setup</h3>
          <p className="text-slate-500 mt-2">Select the archetype and commit to outcome-first writing.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-5">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Archetype</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {ARCHETYPES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onChange('archetype', item.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    data?.archetype === item.id
                      ? 'bg-teal-50 border-teal-200 text-teal-900'
                      : 'bg-white/60 border-white/60 hover:bg-white hover:border-teal-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/70 rounded-2xl border border-white/60 p-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">How to use in 5 minutes</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>1) Set horizon.</li>
              <li>2) Draft headline + metric + population.</li>
              <li>3) Preview the artifact.</li>
              <li className="text-slate-500">Optional: backfill proof, mechanism, and voices.</li>
            </ul>
          </div>
        </div>

      </div>
    );

    case 'context': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="text-center py-6">
             <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><CalendarClock className="w-8 h-8"/></div>
             <h3 className="text-2xl font-bold text-slate-800">Horizon</h3>
             <p className="text-slate-500 mt-2">Anchor the future moment the board will measure against.</p>
           </div>
           <div className="text-xs text-slate-400 bg-white/60 border border-white/60 rounded-2xl p-4">
             Before writing the old reality, define who the grantee is and what they are trying to change.
           </div>
           <div>
             <label className={labelClass}>Target Success Date</label>
             <input type="date" value={data.futureDate} onChange={e => onChange('futureDate', e.target.value)} className={`${inputClass} text-center text-3xl font-serif font-bold ${shouldShowMissing('futureDate') ? errorClass : ''}`} />
             {shouldShowMissing('futureDate') && (
               <p className={errorTextClass}>Please choose a target date.</p>
             )}
           </div>
           <div>
             <label className={labelClass}>Location</label>
             <input value={data.location} onChange={e => onChange('location', e.target.value)} className={`w-full p-4 glass-panel rounded-xl outline-none text-center font-bold tracking-widest ${shouldShowMissing('location') ? errorClass : ''}`} />
             {shouldShowMissing('location') && (
               <p className={errorTextClass}>Add the location of success.</p>
             )}
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className={labelClass}>Grantee Organization</label>
               <input
                 value={data.granteeOrg}
                 onChange={e => onChange('granteeOrg', e.target.value)}
                 placeholder="e.g., Brightline Learning Collaborative"
                 className={`w-full p-4 glass-panel rounded-xl outline-none ${shouldShowMissing('granteeOrg') ? errorClass : ''}`}
               />
               {shouldShowMissing('granteeOrg') && (
                 <p className={errorTextClass}>Name the grantee organization.</p>
               )}
             </div>
             <div>
               <label className={labelClass}>What They Focus On</label>
               <input
                 value={data.granteeFocus}
                 onChange={e => onChange('granteeFocus', e.target.value)}
                 placeholder="e.g., improving early literacy in rural districts"
                 className={`w-full p-4 glass-panel rounded-xl outline-none ${shouldShowMissing('granteeFocus') ? errorClass : ''}`}
               />
               {shouldShowMissing('granteeFocus') && (
                 <p className={errorTextClass}>Describe the core focus area.</p>
               )}
             </div>
           </div>
        </div>
    );

    case 'problem': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          {(data.granteeOrg || data.granteeFocus) && (
            <div className="text-xs text-slate-500 bg-white/70 border border-white/60 rounded-2xl p-4">
              <b className="text-slate-700">Context anchor:</b>{' '}
              {data.granteeOrg ? <span>{data.granteeOrg}</span> : <span>[Grantee organization]</span>}
              {' '}focused on{' '}
              {data.granteeFocus ? <span>{data.granteeFocus}</span> : <span>[focus area]</span>}.
            </div>
          )}
          <div>
            <label className={labelClass}>The "Old" Reality (Current State)</label>
            <textarea value={data.problem} onChange={e => onChange('problem', e.target.value)} placeholder="What was the specific friction or failure point?" className={`${inputClass} h-40 ${shouldShowMissing('problem') ? errorClass : ''}`} />
            {shouldShowMissing('problem') && (
              <p className={errorTextClass}>Describe the current reality.</p>
            )}
            <JargonWarning text={data.problem} year={futureYear} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Denominator: Included</label>
              <input placeholder="Who is counted? (e.g. All K–8 rural students in US public schools)" value={data.denominatorIncluded} onChange={e => onChange('denominatorIncluded', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('denominatorIncluded') ? errorClass : ''}`} />
              {shouldShowMissing('denominatorIncluded') && (
                <p className={errorTextClass}>Define who is included.</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Denominator: Excluded</label>
              <input placeholder="Who is explicitly not included? (e.g. private schools; homeschool)" value={data.denominatorExcluded} onChange={e => onChange('denominatorExcluded', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none" />
            </div>
          </div>
        </div>
    );

    case 'solution': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-xs text-slate-400 bg-white/60 border border-white/60 rounded-2xl p-4">
            <b className="text-slate-600">Guardrail:</b> This is <b>not</b> a list of activities. It's the <b>single mechanism</b> that made scale unavoidable.
          </div>

          <div>
             <label className={labelClass}>The Mechanism of Change</label>
             <textarea value={data.solution} onChange={e => onChange('solution', e.target.value)} placeholder="The specific intervention that broke the pattern..." className={`${inputClass} h-40 ${shouldShowMissing('solution') ? errorClass : ''}`} />
             {shouldShowMissing('solution') && (
               <p className={errorTextClass}>Describe the mechanism that changed outcomes.</p>
             )}
             <JargonWarning text={data.solution} year={futureYear} />
          </div>

          <div>
            <label className={labelClass}>Mechanism of scale</label>
            <input placeholder={scalePlaceholder} value={data.scaleMechanism} onChange={e => onChange('scaleMechanism', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('scaleMechanism') ? errorClass : ''}`} />
            {shouldShowMissing('scaleMechanism') && (
              <p className={errorTextClass}>Explain how it scaled.</p>
            )}
          </div>

          <div className="text-xs text-slate-400 bg-white/60 border border-white/60 rounded-2xl p-4">
             <b className="text-slate-600">Sinatra Test:</b> If this one result disappeared, no serious observer would believe the solution worked nationally.
          </div>

          <div>
             <label className={labelClass}>The Undeniable Proof</label>
             <textarea value={data.evidence} onChange={e => onChange('evidence', e.target.value)} placeholder="What data point proved the skeptics wrong?" className={`${inputClass} h-40 ${shouldShowMissing('evidence') ? errorClass : ''}`} />
             {shouldShowMissing('evidence') && (
               <p className={errorTextClass}>Add the proof point.</p>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className={labelClass}>Who would dispute this?</label>
               <input placeholder="Skeptic (e.g. State superintendent; union; researchers)" value={data.sinatraSkeptic} onChange={e => onChange('sinatraSkeptic', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none" />
             </div>
             <div>
               <label className={labelClass}>Why can't they?</label>
               <input placeholder="What makes it portable / undeniable?" value={data.sinatraWhyUndeniable} onChange={e => onChange('sinatraWhyUndeniable', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('sinatraWhyUndeniable') ? errorClass : ''}`} />
               {shouldShowMissing('sinatraWhyUndeniable') && (
                 <p className={errorTextClass}>Clarify why it can't be disputed.</p>
               )}
             </div>
           </div>
        </div>
    );
    case 'stakeholder': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-xs text-slate-400 bg-white/60 border border-white/60 rounded-2xl p-4">
            These two quotes should <b className="text-slate-600">contrast in tone</b> but not truth: <b className="text-slate-600">Internal</b> = systemic / inevitable; <b className="text-slate-600">External</b> = lived / specific.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className={labelClass}>Internal Reflection</label>
              <textarea placeholder="Looking back, we realized..." value={data.internalQuote} onChange={e => onChange('internalQuote', e.target.value)} className={`w-full p-4 h-40 glass-panel rounded-2xl outline-none text-sm italic ${shouldShowMissing('internalQuote') ? errorClass : ''}`} />
              {shouldShowMissing('internalQuote') && (
                <p className={errorTextClass}>Add the internal reflection.</p>
              )}
              <input placeholder="Speaker Name/Title" value={data.internalSpeaker} onChange={e => onChange('internalSpeaker', e.target.value)} className="w-full p-3 glass-panel rounded-xl text-xs" />
            </div>
            <div className="space-y-3">
              <label className={labelClass}>Beneficiary Voice</label>
              <textarea placeholder="Before this program, I used to..." value={data.externalQuote} onChange={e => onChange('externalQuote', e.target.value)} className={`w-full p-4 h-40 glass-panel rounded-2xl outline-none text-sm italic border-l-4 border-teal-500 ${shouldShowMissing('externalQuote') ? errorClass : ''}`} />
              {shouldShowMissing('externalQuote') && (
                <p className={errorTextClass}>Add the beneficiary quote.</p>
              )}
              <input placeholder="Speaker Name/Title" value={data.externalSpeaker} onChange={e => onChange('externalSpeaker', e.target.value)} className="w-full p-3 glass-panel rounded-xl text-xs" />
            </div>
          </div>
        </div>
    );

    case 'headline': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headline inputs</div>
              <div className="text-xs text-slate-500 mt-1">These fields drive your headline and reduce redundancy later.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Success metric</label>
                <input
                  placeholder="e.g., 95% retention"
                  value={data.successMetric}
                  onChange={e => onChange('successMetric', e.target.value)}
                  className={`w-full p-4 glass-panel rounded-2xl outline-none text-teal-700 font-bold ${shouldShowMissing('successMetric') ? errorClass : ''}`}
                />
                {shouldShowMissing('successMetric') && (
                  <p className={errorTextClass}>Include the key metric.</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Beneficiary</label>
                <input
                  placeholder="Who benefits? (e.g., rural students)"
                  value={data.beneficiary}
                  onChange={e => onChange('beneficiary', e.target.value)}
                  className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('beneficiary') ? errorClass : ''}`}
                />
                {shouldShowMissing('beneficiary') && (
                  <p className={errorTextClass}>Name who benefits.</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Problem scope (optional)</label>
                <input
                  placeholder="Scale or count (e.g., 2 million)"
                  value={data.problemScope}
                  onChange={e => onChange('problemScope', e.target.value)}
                  className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('problemScope') ? errorClass : ''}`}
                />
                {shouldShowMissing('problemScope') && (
                  <p className={errorTextClass}>Add the scale or count.</p>
                )}
              </div>
              <div>
                <label className={labelClass}>{programNameLabel}</label>
                <input
                  placeholder={programNamePlaceholder}
                  value={data.programName}
                  onChange={e => onChange('programName', e.target.value)}
                  className="w-full p-4 glass-panel rounded-2xl outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-white/60 border border-white/60 rounded-2xl p-4">
            Formula: <b className="text-slate-600">Outcome</b> + <b className="text-slate-600">Metric</b> + <b className="text-slate-600">Population</b> + <b className="text-slate-600">Date</b>. Keep it board-ready.
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headline quality checks</div>
                <div className="text-xs text-slate-500 mt-1">Avoid process language and surface the outcome.</div>
              </div>
            </div>
            {headlineLintResult.flags.length > 0 ? (
              <div className="space-y-3">
                {headlineLintResult.flags.slice(0, 3).map((flag) => (
                  <div key={flag.id} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-sm">
                    <div className="font-bold text-amber-900">{flag.title}</div>
                    {flag.detail && <div className="text-xs text-amber-800 mt-1">{flag.detail}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-3 py-2 rounded-2xl">
                No obvious headline issues detected.
              </div>
            )}
            {headlineLintResult.rewrites.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quick rewrites</div>
                <div className="space-y-2">
                  {headlineLintResult.rewrites.slice(0, 3).map((rewrite, idx) => (
                    <button
                      key={`${rewrite.label}-${idx}`}
                      onClick={() => onChange('headline', rewrite.headline)}
                      className="w-full text-left px-4 py-3 rounded-2xl border bg-white/60 border-white/60 hover:bg-white hover:border-teal-200 text-slate-700"
                    >
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{rewrite.label}</div>
                      <div className="font-bold text-sm leading-snug mt-1">{rewrite.headline}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Draft suggestions pulled forward from earlier inputs */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auto-drafts from your inputs</div>
                <div className="text-xs text-slate-500 mt-1">Click a suggestion to use it (no new claims).</div>
              </div>
            </div>

            <div className="space-y-3">
              {generateHeadlineCandidates(data).slice(0, 5).map((h, idx) => (
                <button
                  key={`h-${idx}`}
                  onClick={() => onChange('headline', h)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border transition-all ${
                    (data.headline || '').trim() === h
                      ? 'bg-teal-50 border-teal-200 text-teal-900'
                      : 'bg-white/60 border-white/60 hover:bg-white hover:border-teal-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm leading-snug">{h}</div>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subheadline options</div>
              <div className="space-y-2">
                {generateSubheadlineCandidates(data).slice(0, 3).map((s, idx) => (
                  <button
                    key={`s-${idx}`}
                    onClick={() => onChange('subheadline', s)}
                    className={`w-full text-left px-4 py-3 rounded-2xl border transition-all ${
                      (data.subheadline || '').trim() === s
                        ? 'bg-teal-50 border-teal-200 text-teal-900'
                        : 'bg-white/60 border-white/60 hover:bg-white hover:border-teal-200 text-slate-700'
                    }`}
                  >
                    <div className="text-sm italic leading-snug">{s}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>The Press Release Headline</label>
            <textarea value={data.headline} onChange={e => onChange('headline', e.target.value)} placeholder="Catalyst + Verb + Metric + Population" className={`w-full p-8 text-3xl font-serif font-bold glass-panel rounded-[2.5rem] outline-none focus:ring-2 focus:ring-teal-500 leading-tight ${shouldShowMissing('headline') ? errorClass : ''}`} />
            {shouldShowMissing('headline') && (
              <p className={errorTextClass}>Write the headline before moving on.</p>
            )}
          </div>
          <input placeholder="Subheadline context..." value={data.subheadline} onChange={e => onChange('subheadline', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none italic text-slate-500" />

          <div className="text-center">
            <button onClick={onPreview} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto ring-4 ring-slate-100">
              <FileText className="w-5 h-5" /> Preview press release
            </button>
          </div>
        </div>
    );

    case 'review': return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center pt-8">
            <div className="inline-block p-6 bg-green-50 rounded-full mb-6 border border-green-100 shadow-xl"><ShieldCheck className="w-12 h-12 text-green-600" /></div>
            <h3 className="text-3xl font-bold mb-2 text-slate-900">Finalize</h3>
            <p className="text-slate-500 mb-2 max-w-md mx-auto">Finalize the artifact, then capture decision notes for board prep.</p>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <label className={labelClass}>Confidence Check</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={typeof data.confidence === 'number' ? data.confidence : 70}
                onChange={e => onChange('confidence', Number(e.target.value))}
                className="w-full"
              />
              <div className="w-16 text-right font-bold text-slate-700">{typeof data.confidence === 'number' ? data.confidence : 70}/100</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Low confidence usually means the denominator is fuzzy, the scale mechanism is unclear, or the Sinatra proof is weak.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Internal decision notes</div>
            <div className="text-xs text-slate-500">
              Optional, but useful for turning this press-release draft into a funding or strategy tool.
            </div>

            <div>
              <label className={labelClass}>Decision this should inform</label>
              <textarea
                value={data.decisionToInform}
                onChange={e => onChange('decisionToInform', e.target.value)}
                placeholder="e.g., Fund a 12-month build phase; pause if implementation burden is too high; seek a district distribution partner"
                className="w-full p-4 glass-panel rounded-2xl outline-none text-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Top risks / failure modes</label>
                <textarea
                  value={data.keyRisks}
                  onChange={e => onChange('keyRisks', e.target.value)}
                  placeholder="3 bullets is enough. What would make the headline untrue?"
                  className="w-full p-4 glass-panel rounded-2xl outline-none text-sm"
                  rows={4}
                />
              </div>
              <div>
                <label className={labelClass}>Kill criteria</label>
                <textarea
                  value={data.killCriteria}
                  onChange={e => onChange('killCriteria', e.target.value)}
                  placeholder="If by [date] we don't see [leading indicator], we stop/pivot…"
                  className="w-full p-4 glass-panel rounded-2xl outline-none text-sm"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Next experiment (90 days)</label>
              <textarea
                value={data.nextExperiment}
                onChange={e => onChange('nextExperiment', e.target.value)}
                placeholder="Smallest credible test that would update belief (what, where, who, how measured)."
                className="w-full p-4 glass-panel rounded-2xl outline-none text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="text-center">
            <button onClick={onPreview} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto ring-4 ring-slate-100">
              <FileText className="w-5 h-5" /> View Press Release
            </button>
            <p className="text-xs text-slate-500 mt-3">Export, copy, or print from the press release preview.</p>
          </div>
        </div>
    );

    default: return null;
  }
}

