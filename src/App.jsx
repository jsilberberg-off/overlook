import React, { useMemo, useState, useEffect } from 'react';
import { Save, ArrowRight, ArrowLeft, FileText } from 'lucide-react';
import { useStrategyDraft } from './hooks/useStrategyDraft';
import Sidebar from './components/Layout/Sidebar';
import StepRenderer from './components/Wizard/StepRenderer';
import PressReleaseArtifact from './components/Artifact/PressRelease';
import CoachPanel from './components/Coach/CoachPanel';
import Toast from './components/UI/Toast';
import { STEPS } from './constants/data';
import { generateHeadlineCandidates, generateSubheadlineCandidates } from './utils/pressReleaseDrafts';
import { supabase } from './services/supabase';

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [mode, setMode] = useState('draft');
  const [toast, setToast] = useState(null);

  const showToast = (message, variant = 'success') => {
    setToast({ message, variant });
  };

  const { 
    data, updateField, saveStrategy, isSaving, lastSaved 
  } = useStrategyDraft({ onToast: showToast });

  const stepId = STEPS[activeStep]?.id;

  // Auto-draft headline/subheadline from earlier inputs when entering the Headline step.
  // Does NOT overwrite any existing user text.
  useEffect(() => {
    if (stepId !== 'headline') return;

    if (!data.headline?.trim()) {
      const draft = generateHeadlineCandidates(data)?.[0];
      if (draft) updateField('headline', draft);
    }

    if (!data.subheadline?.trim()) {
      const draft = generateSubheadlineCandidates(data)?.[0];
      if (draft) updateField('subheadline', draft);
    }
    // Intentionally run on step entry only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  const requiredFieldsByStep = useMemo(() => ({
    context: [
      { key: 'futureDate', label: 'Target Success Date' },
      { key: 'location', label: 'Location' },
      { key: 'granteeOrg', label: 'Grantee Organization' },
      { key: 'granteeFocus', label: 'Grantee Focus' }
    ],
    headline: [
      { key: 'headline', label: 'Press Release Headline' },
      { key: 'successMetric', label: 'Success Metric' },
      { key: 'baselineMetric', label: 'Baseline Metric' },
      { key: 'comparatorMetric', label: 'Comparator Metric' },
      { key: 'metricTimeframe', label: 'Metric Timeframe' },
      { key: 'beneficiary', label: 'Beneficiary' },
      { key: 'problemScope', label: 'Scope' }
    ],
    problem: [
      { key: 'problem', label: 'Old Reality' },
      { key: 'denominatorIncluded', label: 'Denominator Included' },
      { key: 'denominatorUnit', label: 'Denominator Unit' },
      { key: 'denominatorSource', label: 'Denominator Source' }
    ],
    solution: [
      { key: 'solution', label: 'Mechanism of Change' },
      { key: 'scaleMechanism', label: 'Mechanism of Scale' },
      { key: 'evidenceSummary', label: 'Evidence Summary' },
      { key: 'evidenceStrength', label: 'Evidence Strength' },
      { key: 'keyUncertainties', label: 'Key Uncertainties' },
      { key: 'evidence', label: 'Undeniable Proof' },
      { key: 'sinatraWhyUndeniable', label: "Why It's Undeniable" }
    ],
    stakeholder: [
      { key: 'internalQuote', label: 'Internal Reflection' },
      { key: 'externalQuote', label: 'Beneficiary Voice' }
    ]
  }), []);

  const missingFields = useMemo(() => {
    const has = (v) => typeof v === 'string' ? v.trim().length > 0 : v !== null && v !== undefined;
    const required = mode === 'polish'
      ? (requiredFieldsByStep[stepId] || [])
      : (stepId === 'headline' ? [{ key: 'headline', label: 'Press Release Headline' }] : []);
    return required
      .filter(({ key }) => !has(data[key]))
      .map((field) => field);
  }, [stepId, data, requiredFieldsByStep, mode]);

  const canGoNext = useMemo(() => {
    if (stepId === 'review') return true;
    return missingFields.length === 0;
  }, [stepId, missingFields]);

  const nextDisabled = activeStep >= STEPS.length - 1 || !canGoNext;

  const handleNext = () => {
    if (nextDisabled) {
      setShowValidation(true);
      return;
    }
    if (activeStep < STEPS.length - 1) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  useEffect(() => {
    setShowValidation(false);
  }, [activeStep]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800 relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-slate-100 to-slate-200">

      {/* Modal Overlay */}
      {showPreview && (
        <PressReleaseArtifact
          data={data}
          onClose={() => setShowPreview(false)}
          onToast={showToast}
        />
      )}

      <div className="max-w-7xl mx-auto glass-panel rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col h-[calc(100vh-4rem)] shadow-2xl relative bg-white/60 backdrop-blur-xl border border-white/50">

        {/* Header */}
        <header className="h-20 px-8 border-b border-white/30 flex justify-between items-center bg-white/40 backdrop-blur-sm z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-lg shadow-slate-900/10 ring-1 ring-slate-200">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                role="img"
                aria-label="OverLook Aperture O"
              >
                <path
                  fill="#0B1F3A"
                  fillRule="evenodd"
                  d="M 50 8 A 42 42 0 1 1 50 92 A 42 42 0 1 1 50 8 Z M 71 13.6 C 48.34 32.87 34.34 57.14 29 86.4 C 51.66 67.13 65.66 42.86 71 13.6 Z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">OverLook</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Future Retrospective Lab</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-xs text-slate-400 mr-2 font-medium">
                Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {!supabase && (
              <span className="text-xs text-slate-500 mr-2 font-medium">
                Saved automatically (this browser)
              </span>
            )}
            <div className="flex items-center gap-3">
              {mode === 'polish' && showValidation && missingFields.length > 0 && activeStep < STEPS.length - 1 && (
                <div className="text-xs text-teal-700 bg-teal-50/80 border border-teal-100 px-3 py-1.5 rounded-full">
                  {missingFields.length} fields missing
                </div>
              )}
              <button
                onClick={handleBack}
                disabled={activeStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${activeStep === 0 ? 'opacity-40 cursor-not-allowed bg-white text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-lg hover:shadow-xl'}`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all bg-white hover:bg-slate-50 text-slate-600 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-4 h-4" /> Preview
              </button>
              <button
                onClick={handleNext}
                disabled={nextDisabled}
                title={!canGoNext ? "Complete the required fields to continue." : ""}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs transition-all shadow-xl hover:shadow-2xl ${activeStep === STEPS.length - 1 ? 'hidden' : 'flex'} ${nextDisabled ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-slate-900 text-white hover:scale-105'}`}
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/70 border border-white/80 p-1">
              <button
                onClick={() => setMode('draft')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                  mode === 'draft' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setMode('polish')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                  mode === 'polish' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Polish
              </button>
            </div>
            {supabase && (
              <div className="flex flex-col items-end gap-1">
                <button onClick={saveStrategy} disabled={isSaving} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                  {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Work</>}
                </button>
                <span className="text-[10px] text-slate-400">Cloud save includes rigor fields, assumptions, and decision notes.</span>
              </div>
            )}
          </div>
        </header>

        {/* Main Body */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />

          <main className="flex-1 overflow-y-auto p-8 md:p-12 relative scroll-smooth">
            <div className="max-w-3xl mx-auto pb-16">
              <StepRenderer
                stepId={STEPS[activeStep].id}
                data={data}
                onChange={updateField}
                onPreview={() => setShowPreview(true)}
                missingFields={missingFields}
                showValidation={showValidation}
              />

              <CoachPanel
                stepId={stepId}
                data={data}
                missingFields={missingFields}
                mode={mode}
              />

            </div>
          </main>
        </div>
      </div>
      {toast && (
        <Toast message={toast.message} variant={toast.variant} />
      )}
    </div>
  );
}


