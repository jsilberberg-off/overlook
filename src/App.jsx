import React, { useState } from 'react';
import { Telescope, Save, Share2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStrategyDraft } from './hooks/useStrategyDraft';
import Sidebar from './components/Layout/Sidebar';
import StepRenderer from './components/Wizard/StepRenderer';
import PressReleaseArtifact from './components/Artifact/PressRelease';
import { STEPS } from './constants/data';

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const { 
    data, updateField, saveStrategy, loadTemplate, isSaving, lastSaved 
  } = useStrategyDraft();

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied! Share this future retrospective with your team.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800 relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-slate-100 to-slate-200">
      
      {/* Modal Overlay */}
      {showPreview && (
        <PressReleaseArtifact 
          data={data} 
          onClose={() => setShowPreview(false)} 
        />
      )}

      <div className="max-w-7xl mx-auto glass-panel rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col h-[calc(100vh-4rem)] shadow-2xl relative bg-white/60 backdrop-blur-xl border border-white/50">
        
        {/* Header */}
        <header className="h-20 px-8 border-b border-white/30 flex justify-between items-center bg-white/40 backdrop-blur-sm z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg shadow-teal-900/20">
              <Telescope className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">OverLook</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Future Retrospective Lab</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {lastSaved && <span className="text-xs text-slate-400 mr-2 font-medium">Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
             <button onClick={copyShareLink} className="p-3 hover:bg-white/80 rounded-xl transition text-slate-500 hover:text-teal-600" title="Copy Link"><Share2 className="w-5 h-5" /></button>
             <button onClick={saveStrategy} disabled={isSaving} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
               {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Work</>}
             </button>
          </div>
        </header>

        {/* Main Body */}
        <div className="flex flex-1 overflow-hidden">
           <Sidebar 
             activeStep={activeStep} 
             setActiveStep={setActiveStep} 
             onLoadTemplate={loadTemplate} 
           />
           
           <main className="flex-1 overflow-y-auto p-8 md:p-12 relative scroll-smooth">
              <div className="max-w-3xl mx-auto pb-24">
                <StepRenderer 
                  stepId={STEPS[activeStep].id} 
                  data={data} 
                  onChange={updateField} 
                  onPreview={() => setShowPreview(true)} 
                />
              </div>

              {/* Navigation Footer (Floating) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/90 via-white/80 to-transparent flex justify-between items-center max-w-3xl mx-auto w-full pointer-events-none">
                 <button 
                   onClick={handleBack} 
                   disabled={activeStep === 0}
                   className={`pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeStep === 0 ? 'opacity-0' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-lg hover:shadow-xl'}`}
                 >
                   <ArrowLeft className="w-4 h-4" /> Previous
                 </button>

                 <button 
                   onClick={handleNext} 
                   disabled={activeStep === STEPS.length - 1}
                   className={`pointer-events-auto flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all bg-slate-900 text-white shadow-xl hover:shadow-2xl hover:scale-105 ${activeStep === STEPS.length - 1 ? 'hidden' : 'flex'}`}
                 >
                   Next Step <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
           </main>
        </div>
      </div>
    </div>
  );
}