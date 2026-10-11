import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  logoUrl: string;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ logoUrl, onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Scientific Engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(40);
      setStatusText('Loading MathSphere Formulas...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Calibrating DEG & RAD Matrices...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready!');
    }, 1400);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Application Loading Splash Screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-6 transition-opacity duration-300"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/15 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Logo Container - Exact 1:1, centered, never stretched, no text overlaid */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
          <img
            src={logoUrl}
            alt="MathSphere Official Logo"
            className="w-full h-full object-contain drop-shadow-2xl relative z-10 rounded-2xl select-none"
          />
        </div>

        {/* Clean Typography Below Logo */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          MathSphere
        </h1>
        <p className="text-sm font-medium text-blue-300 tracking-wide mb-6">
          Scientific Calculator & Formula Suite
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-slate-800/80 rounded-full h-2 mb-3 overflow-hidden border border-slate-700/50 p-0.5">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-xs text-slate-400 font-mono tracking-wider h-4">
          {statusText}
        </p>

        {/* Skip button for immediate user control */}
        <button
          onClick={onFinish}
          className="mt-8 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>Enter Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer Branding Label */}
      <div className="absolute bottom-6 text-center text-slate-500 text-xs tracking-wider flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-blue-400" />
        <span>Official MathSphere Suite</span>
      </div>
    </div>
  );
};
