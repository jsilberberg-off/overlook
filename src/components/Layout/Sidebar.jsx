import React from 'react';
import { STEPS, GOLD_STANDARDS } from '../../constants/data';
import { Sparkles, CheckCircle, FolderOpen } from 'lucide-react';

export default function Sidebar({ activeStep, setActiveStep, onLoadTemplate }) {
  return (
    <div className="hidden md:flex flex-col w-64 border-r border-white/20 bg-white/30 backdrop-blur-md p-6 overflow-y-auto">
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Journey Steps</h3>
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

      <div className="mt-auto pt-6 border-t border-slate-200/50">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-teal-500" /> Inspiration
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {Object.values(GOLD_STANDARDS).map((template) => (
            <button 
              key={template.label}
              onClick={() => onLoadTemplate(template.data)}
              className="text-left px-4 py-3 bg-white/40 hover:bg-white rounded-xl text-xs font-bold text-slate-600 shadow-sm border border-transparent hover:border-teal-200 transition-all flex items-center gap-2 group"
            >
              <FolderOpen className="w-3 h-3 text-slate-400 group-hover:text-teal-500" />
              {template.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}