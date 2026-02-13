import React, { useMemo } from 'react';
import { Telescope, ShieldCheck, FileText, CalendarClock, CheckCircle2 } from 'lucide-react';
import { JARGON_LIST } from '../../constants/data';
import { generateHeadlineCandidates, generateSubheadlineCandidates } from '../../utils/pressReleaseDrafts';
import { headlineLint } from '../../utils/headlineLint';

const compact = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');

const countWords = (value) => {
  const text = compact(value);
  if (!text) return 0;
  return text.split(' ').length;
};

const yearFromDate = (dateStr) => {
  if (!dateStr) return '';
  const year = new Date(dateStr).getFullYear();
  return Number.isFinite(year) ? year : '';
};

const JargonWarning = ({ text, year }) => {
  const foundJargon = JARGON_LIST.filter((word) => text?.toLowerCase().includes(word));
  if (foundJargon.length === 0) return null;

  return (
    <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mt-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <span className="font-bold">Language check ({year || 'Future'}):</span>
      Avoid corporate terms like "{foundJargon.join(', ')}". Prefer concrete language.
    </div>
  );
};

const CharacterCounter = ({ value, softLimit = 280 }) => {
  const count = (value || '').length;
  const over = count > softLimit;
  return (
    <div className={`text-xs mt-2 ${over ? 'text-amber-700' : 'text-slate-400'}`}>
      {count} characters
      {softLimit ? ` (target <= ${softLimit})` : ''}
    </div>
  );
};

export default function StepRenderer({ stepId, data, onChange, onPreview, missingFields = [], showValidation = false }) {
  const futureYear = useMemo(() => yearFromDate(data?.futureDate), [data?.futureDate]);
  const inputClass = 'w-full p-5 glass-panel rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-base text-slate-700 placeholder:text-slate-400 transition-all';
  const labelClass = 'block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2';
  const sectionKickerClass = 'text-[11px] font-bold text-slate-400 uppercase tracking-widest';
  const noteBoxClass = 'text-sm leading-relaxed text-slate-600 bg-white/70 border border-white/60 rounded-2xl p-4';
  const quoteTextareaClass = 'w-full p-4 h-40 glass-panel rounded-2xl outline-none text-base leading-relaxed italic text-slate-700 placeholder:text-slate-400';
  const isMissing = (key) => missingFields.some((field) => field.key === key);
  const errorClass = 'border border-teal-400/60 ring-1 ring-teal-200/80 focus:ring-teal-400';
  const errorTextClass = 'text-xs text-teal-600 mt-2';
  const shouldShowMissing = (key) => showValidation && isMissing(key);
  const scalePlaceholder = 'How this scales beyond a single grantee (distribution channel, replication, policy...)';

  const headlineLintResult = useMemo(
    () =>
      headlineLint({
        headline: data?.headline,
        successMetric: data?.successMetric,
        beneficiary: data?.beneficiary,
        problemScope: data?.problemScope,
        futureDate: data?.futureDate,
        location: data?.location,
        baselineMetric: data?.baselineMetric,
        comparatorMetric: data?.comparatorMetric,
        metricTimeframe: data?.metricTimeframe
      }),
    [
      data?.headline,
      data?.successMetric,
      data?.beneficiary,
      data?.problemScope,
      data?.futureDate,
      data?.location,
      data?.baselineMetric,
      data?.comparatorMetric,
      data?.metricTimeframe
    ]
  );

  const headlineWordCount = countWords(data?.headline);
  const headlineCharCount = (data?.headline || '').length;
  const headlineTooLong = headlineWordCount > 20 || headlineCharCount > 120;

  switch (stepId) {
    case 'frame':
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Telescope className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Setup</h3>
            <p className="text-slate-600 mt-2">
              This lab is built for grant investments. Write from a future success state, then pressure-test what would need
              to be true.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-5">
              <div className={sectionKickerClass}>Why This Works</div>
              <p className="text-sm text-slate-700 mt-2">It forces a shift from activity plans to outcome claims that can be tested.</p>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <div className={sectionKickerClass}>What To Produce</div>
              <p className="text-sm text-slate-700 mt-2">
                A headline-level promise, mechanism + proof, and decision notes leadership can act on.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <div className={sectionKickerClass}>How To Use It</div>
              <p className="text-sm text-slate-700 mt-2">Draft quickly, then switch to Polish mode and resolve every credibility flag.</p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <div className={sectionKickerClass}>Recommended Flow</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>1) Define the grantee and focus before writing the contrast.</li>
              <li>2) Write current reality with denominator clarity.</li>
              <li>3) Pair mechanism and proof in one pass.</li>
              <li>4) Finish with voices, headline quality checks, and decision notes.</li>
            </ul>
          </div>
        </div>
      );

    case 'context':
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CalendarClock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Horizon</h3>
            <p className="text-slate-600 mt-2">Define who this grant is for, then anchor when and where success is true.</p>
          </div>
          <div className={noteBoxClass}>
            Capture grantee identity first so every downstream claim is tied to a concrete actor and focus area.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Grantee Organization</label>
              <input
                value={data.granteeOrg}
                onChange={(e) => onChange('granteeOrg', e.target.value)}
                placeholder="e.g., Brightline Learning Collaborative"
                className={`${inputClass} ${shouldShowMissing('granteeOrg') ? errorClass : ''}`}
              />
              {shouldShowMissing('granteeOrg') && <p className={errorTextClass}>Name the grantee organization.</p>}
            </div>
            <div>
              <label className={labelClass}>What They Focus On</label>
              <input
                value={data.granteeFocus}
                onChange={(e) => onChange('granteeFocus', e.target.value)}
                placeholder="e.g., improving early literacy in rural districts"
                className={`${inputClass} ${shouldShowMissing('granteeFocus') ? errorClass : ''}`}
              />
              {shouldShowMissing('granteeFocus') && <p className={errorTextClass}>Describe the core focus area.</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Target Success Date</label>
              <input
                type="date"
                value={data.futureDate}
                onChange={(e) => onChange('futureDate', e.target.value)}
                className={`${inputClass} font-semibold ${shouldShowMissing('futureDate') ? errorClass : ''}`}
              />
              {shouldShowMissing('futureDate') && <p className={errorTextClass}>Please choose a target date.</p>}
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                value={data.location}
                onChange={(e) => onChange('location', e.target.value)}
                className={`${inputClass} font-semibold tracking-wide ${shouldShowMissing('location') ? errorClass : ''}`}
              />
              {shouldShowMissing('location') && <p className={errorTextClass}>Add the location of success.</p>}
            </div>
          </div>
        </div>
      );

    case 'problem':
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          {(data.granteeOrg || data.granteeFocus) && (
            <div className="text-xs text-slate-500 bg-white/70 border border-white/60 rounded-2xl p-4">
              <b className="text-slate-700">Context anchor:</b>{' '}
              {data.granteeOrg ? <span>{data.granteeOrg}</span> : <span>[Grantee organization]</span>} focused on{' '}
              {data.granteeFocus ? <span>{data.granteeFocus}</span> : <span>[focus area]</span>}.
            </div>
          )}
          <div>
            <label className={labelClass}>The "Old" Reality (Current State)</label>
            <textarea
              value={data.problem}
              onChange={(e) => onChange('problem', e.target.value)}
              placeholder="What was the specific friction or failure point?"
              className={`${inputClass} h-44 leading-relaxed ${shouldShowMissing('problem') ? errorClass : ''}`}
            />
            {shouldShowMissing('problem') && <p className={errorTextClass}>Describe the current reality.</p>}
            <CharacterCounter value={data.problem} softLimit={800} />
            <JargonWarning text={data.problem} year={futureYear} />
          </div>

          <div className={noteBoxClass}>
            Denominator guidance: define who is in scope, the unit (students/teachers/households), and the source used for your estimate.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Denominator: Included</label>
              <textarea
                placeholder="Who is counted? (e.g., all grade 3-8 students in Title I schools)"
                value={data.denominatorIncluded}
                onChange={(e) => onChange('denominatorIncluded', e.target.value)}
                className={`${inputClass} h-32 leading-relaxed ${shouldShowMissing('denominatorIncluded') ? errorClass : ''}`}
              />
              {shouldShowMissing('denominatorIncluded') && <p className={errorTextClass}>Define who is included.</p>}
            </div>
            <div>
              <label className={labelClass}>Denominator: Excluded</label>
              <textarea
                placeholder="Who is explicitly excluded?"
                value={data.denominatorExcluded}
                onChange={(e) => onChange('denominatorExcluded', e.target.value)}
                className={`${inputClass} h-32 leading-relaxed`}
              />
            </div>
            <div>
              <label className={labelClass}>Denominator Unit</label>
              <input
                placeholder="e.g., students, teachers, schools"
                value={data.denominatorUnit}
                onChange={(e) => onChange('denominatorUnit', e.target.value)}
                className={`${inputClass} ${shouldShowMissing('denominatorUnit') ? errorClass : ''}`}
              />
              {shouldShowMissing('denominatorUnit') && <p className={errorTextClass}>Specify the unit of analysis.</p>}
            </div>
            <div>
              <label className={labelClass}>Denominator Source</label>
              <input
                placeholder="e.g., NCES 2025 district enrollment data"
                value={data.denominatorSource}
                onChange={(e) => onChange('denominatorSource', e.target.value)}
                className={`${inputClass} ${shouldShowMissing('denominatorSource') ? errorClass : ''}`}
              />
              {shouldShowMissing('denominatorSource') && <p className={errorTextClass}>Cite where this estimate comes from.</p>}
            </div>
          </div>
        </div>
      );

    case 'solution':
      return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className={noteBoxClass}>
            <b className="text-slate-700">Guardrail:</b> This is <b>not</b> a list of activities. It is the <b>single mechanism</b> that made scale unavoidable.
          </div>

          <div>
            <label className={labelClass}>The Mechanism of Change</label>
            <textarea
              value={data.solution}
              onChange={(e) => onChange('solution', e.target.value)}
              placeholder="The specific intervention that broke the pattern..."
              className={`${inputClass} h-44 leading-relaxed ${shouldShowMissing('solution') ? errorClass : ''}`}
            />
            {shouldShowMissing('solution') && <p className={errorTextClass}>Describe the mechanism that changed outcomes.</p>}
            <CharacterCounter value={data.solution} softLimit={900} />
            <JargonWarning text={data.solution} year={futureYear} />
          </div>

          <div>
            <label className={labelClass}>Mechanism of Scale</label>
            <input
              placeholder={scalePlaceholder}
              value={data.scaleMechanism}
              onChange={(e) => onChange('scaleMechanism', e.target.value)}
              className={`${inputClass} ${shouldShowMissing('scaleMechanism') ? errorClass : ''}`}
            />
            {shouldShowMissing('scaleMechanism') && <p className={errorTextClass}>Explain how it scaled.</p>}
          </div>

          <div className={noteBoxClass}>
            Evidence should include strength and uncertainty, not only the strongest claim.
          </div>

          <div>
            <label className={labelClass}>Evidence Summary</label>
            <textarea
              value={data.evidenceSummary}
              onChange={(e) => onChange('evidenceSummary', e.target.value)}
              placeholder="Briefly summarize supporting studies/evaluations, sample, and key findings."
              className={`${inputClass} h-36 leading-relaxed ${shouldShowMissing('evidenceSummary') ? errorClass : ''}`}
            />
            {shouldShowMissing('evidenceSummary') && <p className={errorTextClass}>Add a concise evidence summary.</p>}
            <CharacterCounter value={data.evidenceSummary} softLimit={900} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Evidence Strength</label>
              <select
                value={data.evidenceStrength}
                onChange={(e) => onChange('evidenceStrength', e.target.value)}
                className={`${inputClass} ${shouldShowMissing('evidenceStrength') ? errorClass : ''}`}
              >
                <option value="none">Select evidence strength</option>
                <option value="randomized_trial">Randomized trial</option>
                <option value="quasi_experimental">Quasi-experimental</option>
                <option value="observational">Observational</option>
                <option value="internal_analytics">Internal analytics only</option>
                <option value="anecdotal">Anecdotal</option>
              </select>
              {shouldShowMissing('evidenceStrength') && <p className={errorTextClass}>Choose the strongest evidence type.</p>}
            </div>
            <div>
              <label className={labelClass}>Effect Range (optional)</label>
              <input
                value={data.effectRange}
                onChange={(e) => onChange('effectRange', e.target.value)}
                placeholder="e.g., +3 to +7 points across districts"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Evidence Sources</label>
            <textarea
              value={data.evidenceSources}
              onChange={(e) => onChange('evidenceSources', e.target.value)}
              placeholder="Links or citations used for evidence claims."
              className={`${inputClass} h-28 leading-relaxed`}
            />
          </div>

          <div>
            <label className={labelClass}>Key Uncertainties</label>
            <textarea
              value={data.keyUncertainties}
              onChange={(e) => onChange('keyUncertainties', e.target.value)}
              placeholder="List major unknowns (selection bias, transferability, implementation dependency, etc.)."
              className={`${inputClass} h-32 leading-relaxed ${shouldShowMissing('keyUncertainties') ? errorClass : ''}`}
            />
            {shouldShowMissing('keyUncertainties') && <p className={errorTextClass}>List the main uncertainties.</p>}
            <CharacterCounter value={data.keyUncertainties} softLimit={700} />
          </div>

          <div className={noteBoxClass}>
            <b className="text-slate-700">Sinatra Test:</b> If this one result disappeared, no serious observer would believe the solution worked nationally.
          </div>

          <div>
            <label className={labelClass}>The Undeniable Proof (headline claim)</label>
            <textarea
              value={data.evidence}
              onChange={(e) => onChange('evidence', e.target.value)}
              placeholder="What single result would convince the strongest skeptic?"
              className={`${inputClass} h-32 leading-relaxed ${shouldShowMissing('evidence') ? errorClass : ''}`}
            />
            {shouldShowMissing('evidence') && <p className={errorTextClass}>Add the proof claim.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Who Would Dispute This?</label>
              <input
                placeholder="Skeptic (e.g., state superintendent, union, researchers)"
                value={data.sinatraSkeptic}
                onChange={(e) => onChange('sinatraSkeptic', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Why Can't They?</label>
              <input
                placeholder="What makes it portable / undeniable?"
                value={data.sinatraWhyUndeniable}
                onChange={(e) => onChange('sinatraWhyUndeniable', e.target.value)}
                className={`${inputClass} ${shouldShowMissing('sinatraWhyUndeniable') ? errorClass : ''}`}
              />
              {shouldShowMissing('sinatraWhyUndeniable') && <p className={errorTextClass}>Clarify why this result travels.</p>}
            </div>
          </div>
        </div>
      );

    case 'stakeholder':
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className={noteBoxClass}>
            These two quotes should <b className="text-slate-700">contrast in tone</b> but not truth: <b className="text-slate-700">Internal</b> =
            systemic / inevitable; <b className="text-slate-700">External</b> = lived / specific.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className={labelClass}>Internal Reflection</label>
              <textarea
                placeholder="Looking back, we realized..."
                value={data.internalQuote}
                onChange={(e) => onChange('internalQuote', e.target.value)}
                className={`${quoteTextareaClass} ${shouldShowMissing('internalQuote') ? errorClass : ''}`}
              />
              {shouldShowMissing('internalQuote') && <p className={errorTextClass}>Add the internal reflection.</p>}
              <input
                placeholder="Speaker Name/Title"
                value={data.internalSpeaker}
                onChange={(e) => onChange('internalSpeaker', e.target.value)}
                className="w-full p-3 glass-panel rounded-xl text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-3">
              <label className={labelClass}>Beneficiary Voice</label>
              <textarea
                placeholder="Before this program, I used to..."
                value={data.externalQuote}
                onChange={(e) => onChange('externalQuote', e.target.value)}
                className={`${quoteTextareaClass} ${shouldShowMissing('externalQuote') ? errorClass : ''}`}
              />
              {shouldShowMissing('externalQuote') && <p className={errorTextClass}>Add the beneficiary quote.</p>}
              <input
                placeholder="Speaker Name/Title"
                value={data.externalSpeaker}
                onChange={(e) => onChange('externalSpeaker', e.target.value)}
                className="w-full p-3 glass-panel rounded-xl text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      );

    case 'headline':
      return (
        <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="glass-panel rounded-3xl p-6 space-y-5">
            <div>
              <div className={sectionKickerClass}>Headline Inputs</div>
              <div className="text-sm text-slate-600 mt-1">These fields drive your headline and improve cross-grantee comparability.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Success Metric</label>
                <input
                  placeholder="e.g., +5 points proficiency"
                  value={data.successMetric}
                  onChange={(e) => onChange('successMetric', e.target.value)}
                  className={`${inputClass} text-teal-700 font-semibold ${shouldShowMissing('successMetric') ? errorClass : ''}`}
                />
                {shouldShowMissing('successMetric') && <p className={errorTextClass}>Include the key metric.</p>}
              </div>
              <div>
                <label className={labelClass}>Beneficiary</label>
                <input
                  placeholder="Who benefits? (e.g., Title I grade 3-8 students)"
                  value={data.beneficiary}
                  onChange={(e) => onChange('beneficiary', e.target.value)}
                  className={`${inputClass} ${shouldShowMissing('beneficiary') ? errorClass : ''}`}
                />
                {shouldShowMissing('beneficiary') && <p className={errorTextClass}>Name who benefits.</p>}
              </div>
              <div>
                <label className={labelClass}>Problem Scope</label>
                <input
                  placeholder="Scale or count (e.g., 2 million)"
                  value={data.problemScope}
                  onChange={(e) => onChange('problemScope', e.target.value)}
                  className={`${inputClass} ${shouldShowMissing('problemScope') ? errorClass : ''}`}
                />
                {shouldShowMissing('problemScope') && <p className={errorTextClass}>Add the scale or count.</p>}
              </div>
              <div>
                <label className={labelClass}>Grant / investment name (optional)</label>
                <input
                  placeholder="Grant / investment name (optional)"
                  value={data.programName}
                  onChange={(e) => onChange('programName', e.target.value)}
                  className={`${inputClass} font-semibold`}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className={sectionKickerClass}>Metric Rigor</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Baseline Metric</label>
                <input
                  placeholder="e.g., 38% currently proficient"
                  value={data.baselineMetric}
                  onChange={(e) => onChange('baselineMetric', e.target.value)}
                  className={`${inputClass} ${shouldShowMissing('baselineMetric') ? errorClass : ''}`}
                />
                {shouldShowMissing('baselineMetric') && <p className={errorTextClass}>Add the baseline value.</p>}
              </div>
              <div>
                <label className={labelClass}>Comparator Metric</label>
                <input
                  placeholder="e.g., +5 points vs. matched control"
                  value={data.comparatorMetric}
                  onChange={(e) => onChange('comparatorMetric', e.target.value)}
                  className={`${inputClass} ${shouldShowMissing('comparatorMetric') ? errorClass : ''}`}
                />
                {shouldShowMissing('comparatorMetric') && <p className={errorTextClass}>Define the comparator/counterfactual.</p>}
              </div>
              <div>
                <label className={labelClass}>Metric Timeframe</label>
                <input
                  placeholder="e.g., within 3 academic years"
                  value={data.metricTimeframe}
                  onChange={(e) => onChange('metricTimeframe', e.target.value)}
                  className={`${inputClass} ${shouldShowMissing('metricTimeframe') ? errorClass : ''}`}
                />
                {shouldShowMissing('metricTimeframe') && <p className={errorTextClass}>Specify when the metric is expected.</p>}
              </div>
              <div>
                <label className={labelClass}>Cost Per Outcome (recommended)</label>
                <input
                  placeholder="e.g., <$500 per incremental proficient student"
                  value={data.costPerOutcome}
                  onChange={(e) => onChange('costPerOutcome', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={noteBoxClass}>
            Formula: <b className="text-slate-700">Outcome</b> + <b className="text-slate-700">Metric</b> +{' '}
            <b className="text-slate-700">Population</b> + <b className="text-slate-700">Date</b>.
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className={sectionKickerClass}>Headline Quality Checks</div>
                <div className="text-sm text-slate-600 mt-1">Short, outcome-first headlines perform best for decision reviews.</div>
              </div>
            </div>
            {headlineLintResult.flags.length > 0 ? (
              <div className="space-y-3">
                {headlineLintResult.flags.slice(0, 4).map((flag) => (
                  <div key={flag.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-sm">
                    <div className="font-bold text-amber-900">{flag.title}</div>
                    {flag.detail && <div className="text-sm text-amber-900/90 mt-1">{flag.detail}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-4 py-3 rounded-2xl">
                No obvious headline issues detected.
              </div>
            )}
            {headlineLintResult.rewrites.length > 0 && (
              <div>
                <div className={`${sectionKickerClass} mb-2`}>Quick Rewrites</div>
                <div className="space-y-2">
                  {headlineLintResult.rewrites.slice(0, 3).map((rewrite, idx) => (
                    <button
                      key={`${rewrite.label}-${idx}`}
                      onClick={() => onChange('headline', rewrite.headline)}
                      className="w-full text-left px-5 py-4 rounded-2xl border bg-white/60 border-white/60 hover:bg-white hover:border-teal-200 text-slate-700"
                    >
                      <div className={sectionKickerClass}>{rewrite.label}</div>
                      <div className="font-semibold text-base leading-snug mt-1">{rewrite.headline}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className={sectionKickerClass}>Auto-Drafts From Your Inputs</div>
                <div className="text-sm text-slate-600 mt-1">Click a suggestion to apply it, then edit as needed.</div>
              </div>
            </div>

            <div className="space-y-3">
              {generateHeadlineCandidates(data).slice(0, 5).map((h, idx) => {
                const selected = (data.headline || '').trim() === h;
                return (
                  <button
                    key={`h-${idx}`}
                    onClick={() => onChange('headline', h)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${
                      selected
                        ? 'bg-teal-50 border-teal-300 text-teal-900 ring-2 ring-teal-100'
                        : 'bg-white/60 border-white/60 hover:bg-white hover:border-teal-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-base leading-snug">{h}</div>
                      {selected && (
                        <div className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-teal-700">
                          <CheckCircle2 className="w-4 h-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <div className={`${sectionKickerClass} mb-2`}>Subheadline Options</div>
              <div className="space-y-2">
                {generateSubheadlineCandidates(data).slice(0, 3).map((s, idx) => (
                  <button
                    key={`s-${idx}`}
                    onClick={() => onChange('subheadline', s)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${
                      (data.subheadline || '').trim() === s
                        ? 'bg-teal-50 border-teal-300 text-teal-900'
                        : 'bg-white/60 border-white/60 hover:bg-white hover:border-teal-200 text-slate-700'
                    }`}
                  >
                    <div className="text-base italic leading-snug">{s}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>The Press Release Headline</label>
            <textarea
              value={data.headline}
              onChange={(e) => onChange('headline', e.target.value)}
              placeholder="Catalyst + Verb + Metric + Population"
              className={`w-full p-6 md:p-7 text-2xl md:text-3xl font-serif font-bold glass-panel rounded-3xl outline-none focus:ring-2 focus:ring-teal-500 leading-tight tracking-tight ${shouldShowMissing('headline') ? errorClass : ''}`}
            />
            {shouldShowMissing('headline') && <p className={errorTextClass}>Write the headline before moving on.</p>}
            <div className={`text-xs mt-2 ${headlineTooLong ? 'text-amber-700' : 'text-slate-400'}`}>
              {headlineWordCount} words, {headlineCharCount} characters
              {headlineTooLong ? ' - shorten toward <= 20 words and <= 120 characters.' : ''}
            </div>
          </div>

          <input
            placeholder="Subheadline context..."
            value={data.subheadline}
            onChange={(e) => onChange('subheadline', e.target.value)}
            className={`${inputClass} italic`}
          />

          <div className="text-center">
            <button
              onClick={onPreview}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto ring-4 ring-slate-100"
            >
              <FileText className="w-5 h-5" /> Preview press release
            </button>
          </div>
        </div>
      );

    case 'review':
      return (
        <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center pt-8">
            <div className="inline-block p-6 bg-green-50 rounded-full mb-6 border border-green-100 shadow-xl">
              <ShieldCheck className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold mb-2 text-slate-900">Finalize</h3>
            <p className="text-slate-600 mb-2 max-w-md mx-auto">
              Finalize the artifact, then capture decision notes for board prep.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-3">
            <label className={labelClass}>Confidence Check</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={typeof data.confidence === 'number' ? data.confidence : 70}
                onChange={(e) => onChange('confidence', Number(e.target.value))}
                className="w-full"
              />
              <div className="w-16 text-right font-bold text-slate-700">
                {typeof data.confidence === 'number' ? data.confidence : 70}/100
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Low confidence usually means denominator clarity, evidence strength, or scaling assumptions are weak.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-5">
            <div className={sectionKickerClass}>Internal Decision Notes</div>
            <div className="text-sm text-slate-600">
              Optional, but useful for turning this press-release draft into a funding or strategy tool.
            </div>

            <div>
              <label className={labelClass}>Decision This Should Inform</label>
              <textarea
                value={data.decisionToInform}
                onChange={(e) => onChange('decisionToInform', e.target.value)}
                placeholder="e.g., fund 12-month scale phase if comparator signal holds"
                className={`${inputClass} min-h-[112px] leading-relaxed`}
                rows={3}
              />
              <CharacterCounter value={data.decisionToInform} softLimit={500} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Top Risks / Failure Modes</label>
                <textarea
                  value={data.keyRisks}
                  onChange={(e) => onChange('keyRisks', e.target.value)}
                  placeholder="What would make the headline untrue?"
                  className={`${inputClass} min-h-[140px] leading-relaxed`}
                  rows={4}
                />
                <CharacterCounter value={data.keyRisks} softLimit={700} />
              </div>
              <div>
                <label className={labelClass}>Kill Criteria</label>
                <textarea
                  value={data.killCriteria}
                  onChange={(e) => onChange('killCriteria', e.target.value)}
                  placeholder="If by [date] we don't see [indicator], we stop/pivot..."
                  className={`${inputClass} min-h-[140px] leading-relaxed`}
                  rows={4}
                />
                <CharacterCounter value={data.killCriteria} softLimit={700} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Next Experiment (90 days)</label>
              <textarea
                value={data.nextExperiment}
                onChange={(e) => onChange('nextExperiment', e.target.value)}
                placeholder="Smallest credible test that would update belief (what, where, who, how measured)."
                className={`${inputClass} min-h-[112px] leading-relaxed`}
                rows={3}
              />
              <CharacterCounter value={data.nextExperiment} softLimit={600} />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onPreview}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto ring-4 ring-slate-100"
            >
              <FileText className="w-5 h-5" /> View Press Release
            </button>
            <p className="text-xs text-slate-500 mt-3">Export, copy, or print from the press release preview.</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
