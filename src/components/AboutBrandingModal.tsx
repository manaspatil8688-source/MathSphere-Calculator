import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { BrandingSection } from './BrandingSection';

interface AboutBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl: string;
  onCustomLogoChange: (url: string | null) => void;
  onTriggerSplash: () => void;
  isCustomLogo: boolean;
}

export const AboutBrandingModal: React.FC<AboutBrandingModalProps> = ({
  isOpen,
  onClose,
  logoUrl,
  onCustomLogoChange,
  onTriggerSplash,
  isCustomLogo,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="branding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="MathSphere Official Logo"
              className="w-8 h-8 rounded-lg object-contain border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <h2 id="branding-modal-title" className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Official Branding & Android Assets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MathSphere • Brand Guidelines & Launcher Icons
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          <BrandingSection
            logoUrl={logoUrl}
            onCustomLogoChange={onCustomLogoChange}
            onTriggerSplash={() => {
              onClose();
              onTriggerSplash();
            }}
            isCustomLogo={isCustomLogo}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span>MathSphere v2.0 • Offline Ready</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
