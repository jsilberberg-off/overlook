import React from 'react';
import { Telescope, Target, Zap, BarChart3, Users, Sparkles, ShieldCheck, FileText, CalendarClock } from 'lucide-react';
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

export default function StepRenderer({ stepId, data, onChange, onPreview }) {
  const inputClass = "w-full p-6 glass-panel rounded-3xl outline-none focus:ring-2 focus:ring-teal-500 text-lg transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2";

  switch (stepId) {
    case 'context': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="text-center py-6">
             <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><CalendarClock className="w-8 h-8"/></div>
             <h3 className="text-2xl font-bold text-slate-800">Set the Horizon</h3>
             <p className="text-slate-500 mt-2">We are time traveling to the moment of victory.</p>
           </div>
           <div>
             <label className={labelClass}>Target Success Date</label>
             <input type="date" value={data.futureDate} onChange={e => onChange('futureDate', e.target.value)} className={`${inputClass} text-center text-3xl font-serif font-bold`} />
           </div>
           <div>
             <label className={labelClass}>Location</label>
             <input value={data.location} onChange={e => onChange('location', e.target.value)} className="w-full p-4 glass-panel rounded-xl outline-none text-center font-bold tracking-widest" />
           </div>
        </div>
    );
    case 'problem': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <label className={labelClass}>The "Old" Reality (Current State)</label>
            <textarea value={data.problem} onChange={e => onChange('problem', e.target.value)} placeholder="What was the specific friction or failure point?" className={`${inputClass} h-40`} />
            <JargonWarning text={data.problem} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Who Suffered?</label><input placeholder="Beneficiary (e.g. Rural Students)" value={data.beneficiary} onChange={e => onChange('beneficiary', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none" /></div>
            <div><label className={labelClass}>How Many?</label><input placeholder="Scope (e.g. 2 Million)" value={data.problemScope} onChange={e => onChange('problemScope', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none" /></div>
          </div>
        </div>
    );
    case 'solution': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
             <label className={labelClass}>The Mechanism of Change</label>
             <textarea value={data.solution} onChange={e => onChange('solution', e.target.value)} placeholder="The specific intervention that broke the pattern..." className={`${inputClass} h-40`} />
             <JargonWarning text={data.solution} />
          </div>
          <input placeholder="Name of Initiative" value={data.programName} onChange={e => onChange('programName', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none font-bold" />
          <input placeholder="Mechanism of Scale (How did it grow?)" value={data.scaleMechanism} onChange={e => onChange('scaleMechanism', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none" />
        </div>
    );
    case 'evidence': return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
           <div>
             <label className={labelClass}>The Undeniable Proof</label>
             <textarea value={data.evidence} onChange={e => onChange('evidence', e.target.value)} placeholder="What data point proved the skeptics wrong?" className={`${inputClass} h-40`} />
           </div>
           <input placeholder="Headline Success Metric (e.g. 95% Retention)" value={data.successMetric} onChange={e => onChange('successMetric', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none text-teal-700 font-bold" />
        </div>
    );
    case 'stakeholder': return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-3">
            <label className={labelClass}>Internal Reflection</label>
            <textarea placeholder="Looking back, we realized..." value={data.internalQuote} onChange={e => onChange('internalQuote', e.target.value)} className="w-full p-4 h-40 glass-panel rounded-2xl outline-none text-sm italic" />
            <input placeholder="Speaker Name/Title" value={data.internalSpeaker} onChange={e => onChange('internalSpeaker', e.target.value)} className="w-full p-3 glass-panel rounded-xl text-xs" />
          </div>
          <div className="space-y-3">
            <label className={labelClass}>Beneficiary Voice</label>
            <textarea placeholder="Before this program, I used to..." value={data.externalQuote} onChange={e => onChange('externalQuote', e.target.value)} className="w-full p-4 h-40 glass-panel rounded-2xl outline-none text-sm italic border-l-4 border-teal-500" />
            <input placeholder="Speaker Name/Title" value={data.externalSpeaker} onChange={e => onChange('externalSpeaker', e.target.value)} className="w-full p-3 glass-panel rounded-xl text-xs" />
          </div>
        </div>
    );
    case 'headline': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <label className={labelClass}>The Press Release Headline</label>
            <textarea value={data.headline} onChange={e => onChange('headline', e.target.value)} placeholder="Catalyst + Verb + Metric + Population" className="w-full p-8 text-3xl font-serif font-bold glass-panel rounded-[2.5rem] outline-none focus:ring-2 focus:ring-teal-500 leading-tight" />
          </div>
          <input placeholder="Subheadline context..." value={data.subheadline} onChange={e => onChange('subheadline', e.target.value)} className="w-full p-4 glass-panel rounded-2xl outline-none italic text-slate-500" />
        </div>
    );
    case 'review': return (
        <div className="text-center py-20 animate-in zoom-in duration-500">
           <div className="inline-block p-6 bg-green-50 rounded-full mb-6 border border-green-100 shadow-xl"><ShieldCheck className="w-12 h-12 text-green-600" /></div>
           <h3 className="text-3xl font-bold mb-2 text-slate-900">Strategy Finalized</h3>
           <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your retrospective artifact is ready for distribution.</p>
           <button onClick={onPreview} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto ring-4 ring-slate-100">
              <FileText className="w-5 h-5" /> View Press Release
           </button>
        </div>
    );
    default: return null;
  }
}