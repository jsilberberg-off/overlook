import React from 'react';
import { Telescope, Target, Zap, BarChart3, Users, Sparkles, ShieldCheck, FileText, CalendarClock, Copy } from 'lucide-react';
import { JARGON_LIST } from '../../constants/data';

// Helper for Jargon Warning
const JargonWarning = ({ text }) => {
  const foundJargon = JARGON_LIST.filter(word => text?.toLowerCase().includes(word));
  if (foundJargon.length === 0) return null;
  return (
    <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <span className="font-bold">⚠️ 2031 Language Check:</span> 
      Avoid corporate speak like "{foundJargon.join(', ')}". Be human.
    </div>
  );
};

export default function StepRenderer({ stepId, data, onChange, onPreview, missingFields = [], showValidation = false }) {
  const inputClass = "w-full p-6 glass-panel rounded-3xl outline-none focus:ring-2 focus:ring-teal-500 text-lg transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2";
  const isMissing = (key) => missingFields.some(field => field.key === key);
  const errorClass = "border border-teal-400/60 ring-1 ring-teal-200/80 focus:ring-teal-400";
  const errorTextClass = "text-xs text-teal-600 mt-2";
  const shouldShowMissing = (key) => showValidation && isMissing(key);

  const copyToClipboard = async (text, successMsg) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(successMsg || "Copied to clipboard.");
    } catch (e) {
      alert("Couldn't copy automatically. Please copy manually.");
    }
  };

  const buildArtifactText = () => {
    const lines = [
      data.headline ? data.headline.trim() : "",
      data.subheadline ? data.subheadline.trim() : "",
      "",
      `Program: ${data.programName || "—"}`,
      `Where: ${data.location || "—"}`,
      `When: ${data.futureDate || "—"}`,
      "",
      `Problem (old reality): ${data.problem || "—"}`,
      `Beneficiary: ${data.beneficiary || "—"}`,
      `Denominator (included): ${data.denominatorIncluded || "—"}`,
      `Denominator (excluded): ${data.denominatorExcluded || "—"}`,
      `Scope: ${data.problemScope || "—"}`,
      "",
      `Catalyst: ${data.solution || "—"}`,
      `Mechanism of scale: ${data.scaleMechanism || "—"}`,
      "",
      `Sinatra proof: ${data.evidence || "—"}`,
      `Success metric: ${data.successMetric || "—"}`,
      `Who would dispute it: ${data.sinatraSkeptic || "—"}`,
      `Why they can't: ${data.sinatraWhyUndeniable || "—"}`,
      "",
      `Internal quote (${data.internalSpeaker || "Internal"}): "${data.internalQuote || "—"}"`,
      `External quote (${data.externalSpeaker || "External"}): "${data.externalQuote || "—"}"`,
      "",
      `Confidence: ${typeof data.confidence === 'number' ? data.confidence : "—"}/100`
    ].filter(Boolean);
    return lines.join('\n');
  };

  switch (stepId) {
    case 'frame': return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Telescope className="w-8 h-8"/>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Write from the Future</h3>
          <p className="text-slate-500 mt-2">This is not a plan. It’s a press release written after you’ve won.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rules of the game</div>
            <ul className="mt-3 space-y-2 text-slate-700">
              <li className="flex gap-3"><span>✅</span><span><b>Concrete only:</b> if it can’t be measured, named, or quoted, it doesn’t count.</span></li>
              <li className="flex gap-3"><span>✅</span><span><b>Full denominator:</b> define the whole population that must be different by the date.</span></li>
              <li className="flex gap-3"><span>✅</span><span><b>Inevitable win:</b> by 2031, success should feel obvious—not heroic.</span></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Tip: You can use templates in the sidebar if you want a starting point.
        </div>
      </div>
    );

    case 'context': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="text-center py-6">
             <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><CalendarClock className="w-8 h-8"/></div>
             <h3 className="text-2xl font-bold text-slate-800">Set the Horizon</h3>
             <p className="text-slate-500 mt-2">We are time traveling to the moment of victory.</p>
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
        </div>
    );

    case 'problem': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <label className={labelClass}>The "Old" Reality (Current State)</label>
            <textarea value={data.problem} onChange={e => onChange('problem', e.target.value)} placeholder="What was the specific friction or failure point?" className={`${inputClass} h-40 ${shouldShowMissing('problem') ? errorClass : ''}`} />
            {shouldShowMissing('problem') && (
              <p className={errorTextClass}>Describe the current reality.</p>
            )}
            <JargonWarning text={data.problem} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Who Suffered?</label>
              <input placeholder="Beneficiary (e.g. Rural Students)" value={data.beneficiary} onChange={e => onChange('beneficiary', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('beneficiary') ? errorClass : ''}`} />
              {shouldShowMissing('beneficiary') && (
                <p className={errorTextClass}>Name who felt the pain.</p>
              )}
            </div>
            <div>
              <label className={labelClass}>How Many?</label>
              <input placeholder="Scope (e.g. 2 Million)" value={data.problemScope} onChange={e => onChange('problemScope', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('problemScope') ? errorClass : ''}`} />
              {shouldShowMissing('problemScope') && (
                <p className={errorTextClass}>Add the scale or count.</p>
              )}
            </div>
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
            <b className="text-slate-600">Guardrail:</b> This is <b>not</b> a list of activities or pilots. It’s the <b>single mechanism</b> that made scale unavoidable.
          </div>

          <div>
             <label className={labelClass}>The Mechanism of Change</label>
             <textarea value={data.solution} onChange={e => onChange('solution', e.target.value)} placeholder="The specific intervention that broke the pattern..." className={`${inputClass} h-40 ${shouldShowMissing('solution') ? errorClass : ''}`} />
             {shouldShowMissing('solution') && (
               <p className={errorTextClass}>Describe the mechanism that changed outcomes.</p>
             )}
             <JargonWarning text={data.solution} />
          </div>

          <input placeholder="Name of Initiative" value={data.programName} onChange={e => onChange('programName', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none font-bold" />
          <input placeholder="Mechanism of Scale (How did it grow?)" value={data.scaleMechanism} onChange={e => onChange('scaleMechanism', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('scaleMechanism') ? errorClass : ''}`} />
          {shouldShowMissing('scaleMechanism') && (
            <p className={errorTextClass}>Explain how it scaled.</p>
          )}
        </div>
    );

    case 'evidence': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
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

           <input placeholder="Headline Success Metric (e.g. 95% Retention)" value={data.successMetric} onChange={e => onChange('successMetric', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none text-teal-700 font-bold ${shouldShowMissing('successMetric') ? errorClass : ''}`} />
           {shouldShowMissing('successMetric') && (
             <p className={errorTextClass}>Include the key metric.</p>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className={labelClass}>Who would dispute this?</label>
               <input placeholder="Skeptic (e.g. State superintendent; union; researchers)" value={data.sinatraSkeptic} onChange={e => onChange('sinatraSkeptic', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none" />
             </div>
             <div>
               <label className={labelClass}>Why can’t they?</label>
               <input placeholder="What makes it portable / undeniable?" value={data.sinatraWhyUndeniable} onChange={e => onChange('sinatraWhyUndeniable', e.target.value)} className={`w-full p-4 glass-panel rounded-2xl outline-none ${shouldShowMissing('sinatraWhyUndeniable') ? errorClass : ''}`} />
               {shouldShowMissing('sinatraWhyUndeniable') && (
                 <p className={errorTextClass}>Clarify why it can’t be disputed.</p>
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
          <div className="text-xs text-slate-400 bg-white/60 border border-white/60 rounded-2xl p-4">
            Formula: <b className="text-slate-600">Catalyst</b> + <b className="text-slate-600">Active Verb</b> + <b className="text-slate-600">Metric</b> + <b className="text-slate-600">Population</b>. Keep it punchy.
          </div>

          <div>
            <label className={labelClass}>The Press Release Headline</label>
            <textarea value={data.headline} onChange={e => onChange('headline', e.target.value)} placeholder="Catalyst + Verb + Metric + Population" className={`w-full p-8 text-3xl font-serif font-bold glass-panel rounded-[2.5rem] outline-none focus:ring-2 focus:ring-teal-500 leading-tight ${shouldShowMissing('headline') ? errorClass : ''}`} />
            {shouldShowMissing('headline') && (
              <p className={errorTextClass}>Write the headline before moving on.</p>
            )}
          </div>
          <input placeholder="Subheadline context..." value={data.subheadline} onChange={e => onChange('subheadline', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none italic text-slate-500" />
        </div>
    );

    case 'review': return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center pt-8">
            <div className="inline-block p-6 bg-green-50 rounded-full mb-6 border border-green-100 shadow-xl"><ShieldCheck className="w-12 h-12 text-green-600" /></div>
            <h3 className="text-3xl font-bold mb-2 text-slate-900">Final Polish</h3>
            <p className="text-slate-500 mb-2 max-w-md mx-auto">Do a last pass for concreteness and plausibility, then generate the artifact.</p>
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

          <div className="text-center">
            <button onClick={onPreview} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto ring-4 ring-slate-100">
              <FileText className="w-5 h-5" /> View Press Release
            </button>
          </div>
        </div>
    );

    case 'next': return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-slate-900 text-teal-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FileText className="w-8 h-8"/>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Make it Useful</h3>
          <p className="text-slate-500 mt-2">Turn the artifact into a decision tool, not a document.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Use this output to</div>
          <ul className="mt-2 space-y-2 text-slate-700">
            <li className="flex gap-3"><span>•</span><span><b>Pressure-test grants:</b> “Would this plausibly produce this headline?”</span></li>
            <li className="flex gap-3"><span>•</span><span><b>Align partners:</b> everyone shares the same definition of winning.</span></li>
            <li className="flex gap-3"><span>•</span><span><b>Kill weak strategies:</b> if you can’t write this credibly, you probably can’t fund it credibly.</span></li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => copyToClipboard(data.headline || "", "Headline copied.")}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 px-6 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy Headline
          </button>

          <button
            onClick={() => copyToClipboard(buildArtifactText(), "Artifact summary copied.")}
            className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy Full Summary
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onPreview}
            className="text-sm font-bold text-teal-700 hover:text-teal-800 underline underline-offset-4"
          >
            View Press Release again
          </button>
        </div>
      </div>
    );

    default: return null;
  }
}
