import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ARCHETYPES } from '../../constants/data';

const placeholder = (value, fallback) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed ? trimmed : fallback;
};

const buildPressReleaseText = (data) => {
  const archetypeLabel = (ARCHETYPES.find((item) => item.id === data.archetype) || ARCHETYPES[0])?.label;
  const currentYear = new Date().getFullYear();
  const programName = placeholder(data.programName, '[Program name]');
  const granteeOrg = placeholder(data.granteeOrg, '');
  const granteeFocus = placeholder(data.granteeFocus, '');
  const location = placeholder(data.location, '[Location]');
  const futureDate = placeholder(data.futureDate, '[Target date]');
  const beneficiary = placeholder(data.beneficiary, '[Beneficiary]');
  const problem = placeholder(data.problem, '[Add current reality]');
  const solution = placeholder(data.solution, '[Add mechanism]');
  const internalQuote = data.internalQuote ? `"${data.internalQuote}" — ${data.internalSpeaker || 'Internal speaker'}` : '';
  const externalQuote = data.externalQuote ? `"${data.externalQuote}" — ${data.externalSpeaker || 'External speaker'}` : '';

  return [
    'Internal Draft — Future Retrospective',
    'Not for distribution',
    `Archetype: ${archetypeLabel || 'Portfolio strategy'}`,
    '',
    data.headline || '[Future Headline Goes Here]',
    data.subheadline || '[Optional subheadline: add scale + mechanism + time window]',
    '',
    `${location} — ${futureDate} — Today, the Foundation marked the successful conclusion of ${programName}, an initiative that has fundamentally changed the landscape for ${beneficiary}.${granteeOrg ? ` The work was led by ${granteeOrg}${granteeFocus ? `, focused on ${granteeFocus}` : ''}.` : ''}`,
    '',
    internalQuote,
    '',
    `The Challenge (${currentYear})`,
    problem,
    '',
    'The Solution',
    solution,
    '',
    data.evidence ? `The Metric That Mattered: ${data.evidence}` : '',
    '',
    externalQuote
  ].filter(Boolean).join('\n');
};

export default function PressReleaseArtifact({ data, onClose, onToast }) {
  const archetypeLabel = (ARCHETYPES.find((item) => item.id === data.archetype) || ARCHETYPES[0])?.label;
  const currentYear = new Date().getFullYear();
  const programName = placeholder(data.programName, '[Program name]');
  const granteeOrg = placeholder(data.granteeOrg, '');
  const granteeFocus = placeholder(data.granteeFocus, '');
  const location = placeholder(data.location, '[Location]');
  const futureDate = placeholder(data.futureDate, '[Target date]');
  const beneficiary = placeholder(data.beneficiary, '[Beneficiary]');
  const problem = placeholder(data.problem, '[Add current reality]');
  const solution = placeholder(data.solution, '[Add mechanism]');

  const copyToClipboard = async (text, successMsg) => {
    try {
      await navigator.clipboard.writeText(text);
      onToast?.(successMsg || 'Copied to clipboard.');
    } catch {
      onToast?.("Couldn't copy automatically. Please copy manually.", 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white max-w-5xl w-full rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[85vh] animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Sidebar Stats */}
        <div className="bg-slate-950 text-white p-8 md:w-80 flex-shrink-0 font-sans relative">
           <button onClick={onClose} className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors">
             <ArrowLeft className="w-4 h-4"/> Back to Editor
           </button>
           
           <div className="mt-16 text-[10px] font-bold text-teal-400 uppercase tracking-[0.2em] mb-8 border-b border-slate-800 pb-2">Impact Summary</div>
           
           <div className="space-y-8">
             <div><div className="text-xs text-slate-500 uppercase mb-1 font-bold">Scope</div><div className="font-bold text-2xl font-serif">{data.problemScope || "—"}</div></div>
             <div><div className="text-xs text-slate-500 uppercase mb-1 font-bold">Key Outcome</div><div className="font-bold text-xl text-teal-200">{data.successMetric || "—"}</div></div>
             <div><div className="text-xs text-slate-500 uppercase mb-1 font-bold">Mechanism</div><div className="font-bold text-sm leading-snug text-slate-300">{data.scaleMechanism || "—"}</div></div>
           </div>

           {(data.decisionToInform || data.keyRisks || data.killCriteria || data.nextExperiment) && (
             <div className="mt-10 pt-8 border-t border-slate-800">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Internal Decision Notes</div>
               <div className="space-y-4 text-xs text-slate-300">
                 {data.decisionToInform && (
                   <div>
                     <div className="text-slate-500 uppercase font-bold mb-1">Decision</div>
                     <div className="leading-snug">{data.decisionToInform}</div>
                   </div>
                 )}
                 {data.keyRisks && (
                   <div>
                     <div className="text-slate-500 uppercase font-bold mb-1">Risks</div>
                     <div className="leading-snug">{data.keyRisks}</div>
                   </div>
                 )}
                 {data.killCriteria && (
                   <div>
                     <div className="text-slate-500 uppercase font-bold mb-1">Kill Criteria</div>
                     <div className="leading-snug">{data.killCriteria}</div>
                   </div>
                 )}
                 {data.nextExperiment && (
                   <div>
                     <div className="text-slate-500 uppercase font-bold mb-1">Next 90 Days</div>
                     <div className="leading-snug">{data.nextExperiment}</div>
                   </div>
                 )}
               </div>
             </div>
           )}

           <div className="absolute bottom-8 left-8 text-xs text-slate-600 font-mono">
             REF: {data.archetype?.toUpperCase()}-{new Date().getFullYear()}
           </div>
        </div>
        
        {/* Main Content */}
        <div className="p-12 md:p-20 flex-1 font-serif text-slate-900 overflow-y-auto bg-[#fdfbf7]">
           <div className="mb-12 border-b-4 border-slate-900 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6 font-sans">
              <div>
                <h1 className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-2">
                  Internal Draft — Future Retrospective
                </h1>
                <div className="text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase">
                  Not for distribution
                </div>
                <div className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase mt-2">
                  Archetype: {archetypeLabel}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <button
                  onClick={() => copyToClipboard(data.headline || '', 'Headline copied.')}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white/80 border border-slate-200 hover:border-teal-200 hover:bg-white"
                >
                  Copy headline
                </button>
                <button
                  onClick={() => copyToClipboard(buildPressReleaseText(data), 'Press release copied.')}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white/80 border border-slate-200 hover:border-teal-200 hover:bg-white"
                >
                  Copy full press release
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:opacity-90"
                >
                  Print / PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white/80 border border-slate-200 hover:border-slate-400 hover:bg-white"
                >
                  Close preview
                </button>
              </div>
           </div>
           
           <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95] tracking-tight">{data.headline || "[Future Headline Goes Here]"}</h1>
           <h2 className="text-xl md:text-2xl text-slate-500 italic mb-10 font-light leading-relaxed">
             {data.subheadline || "[Optional subheadline: add scale + mechanism + time window]"}
           </h2>
           
           <div className="prose prose-lg prose-slate max-w-none">
              <p className="lead text-xl leading-relaxed">
                <strong className="uppercase text-xs tracking-widest mr-2 text-slate-400 font-sans font-bold">{location} — {futureDate} —</strong> 
                Today, the Foundation marked the successful conclusion of <strong>{programName}</strong>, an initiative that has fundamentally changed the landscape for {beneficiary}.
                {granteeOrg && (
                  <> The work was led by <strong>{granteeOrg}</strong>{granteeFocus ? <> and focused on {granteeFocus}</> : null}.</>
                )}
              </p>

              {data.internalQuote && (
                <div className="my-10 pl-8 border-l-4 border-teal-500 italic text-2xl text-slate-800 font-medium">
                   "{data.internalQuote}"
                   {data.internalSpeaker && (
                     <div className="text-xs font-sans font-bold text-slate-400 mt-4 not-italic uppercase tracking-widest">— {data.internalSpeaker}</div>
                   )}
                </div>
              )}

              <h3 className="font-sans font-black text-xs uppercase tracking-widest text-slate-300 mt-12 mb-4">The Challenge ({currentYear})</h3>
              <p className="text-slate-600">{problem}</p>

              <h3 className="font-sans font-black text-xs uppercase tracking-widest text-slate-300 mt-12 mb-4">The Solution</h3>
              <p className="text-slate-600">{solution}</p>

              {data.evidence && (
                 <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 my-10 not-italic font-sans">
                    <h4 className="font-bold text-xs uppercase tracking-wide mb-2 text-teal-600">The Metric That Mattered</h4>
                    <p className="font-bold text-3xl text-slate-900">{data.evidence}</p>
                 </div>
              )}
              
              {data.externalQuote && (
                <div className="my-10 pl-8 border-l-4 border-slate-200 italic text-xl text-slate-500">
                   "{data.externalQuote}"
                   {data.externalSpeaker && (
                     <div className="text-xs font-sans font-bold text-slate-400 mt-3 not-italic uppercase tracking-widest">— {data.externalSpeaker}</div>
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
