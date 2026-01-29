import React from 'react';
import { STEPS } from '../../constants/data';
import { CheckCircle } from 'lucide-react';

export default function Sidebar({ activeStep, setActiveStep }) {
  return (
    <div className="hidden md:flex flex-col w-64 border-r border-white/20 bg-white/30 backdrop-blur-md p-6 overflow-y-auto">
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Draft steps</h3>
        <div className="space-y-1">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeStep === idx 
                  ? 'bg-slate-900 text-white shadow-lg scale-105' 
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
              }`}
            >
              <div className={`${activeStep === idx ? 'text-teal-400' : 'opacity-50'}`}>{step.icon}</div>
              {step.title}
              {activeStep > idx && <CheckCircle className="w-3 h-3 ml-auto text-teal-600" />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
