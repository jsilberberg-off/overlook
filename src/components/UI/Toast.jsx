import React from 'react';

export default function Toast({ message, variant = 'success' }) {
  const tone = variant === 'error'
    ? 'bg-rose-600 text-white'
    : 'bg-slate-900 text-white';

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in slide-in-from-bottom-2">
      <div className={`px-4 py-3 rounded-2xl shadow-xl text-sm font-bold ${tone}`}>
        {message}
      </div>
    </div>
  );
}
