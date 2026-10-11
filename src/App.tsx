import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  BookOpen,
  Zap,
  ArrowLeftRight,
  History as HistoryIcon,
  Award,
  Smartphone,
  Info,
  Sparkles
} from 'lucide-react';
import { ScientificCalculator } from './components/ScientificCalculator';
import { MathFormulas } from './components/MathFormulas';
import { PhysicsFormulas } from './components/PhysicsFormulas';
import { UnitConverter } from './components/UnitConverter';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutBrandingModal } from './components/AboutBrandingModal';
import { BrandingSection } from './components/BrandingSection';
import { UnitTestResultCard } from './components/UnitTestResultCard';
import { SplashScreen } from './components/SplashScreen';
import { HistoryItem, ActiveTab } from './types';

const OFFICIAL_LOGO = '/logo.svg';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('diploma_calc_dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('math');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isBrandingOpen, setIsBrandingOpen] = useState<boolean>(false);
  
  // Custom logo support (stored in localStorage)
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('diploma_custom_logo');
    }
    return null;
  });

  // Splash screen state: show on first load or when user explicitly requests
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('diploma_splash_shown');
      return !shown;
    }
    return false;
  });

  const currentLogo = customLogo || OFFICIAL_LOGO;

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('diploma_calc_history');
        if (saved) return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sync dark class on document element & localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('diploma_calc_dark', isDark.toString());
  }, [isDark]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('diploma_calc_history', JSON.stringify(history));
  }, [history]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const handleCustomLogoChange = (newLogoUrl: string | null) => {
    setCustomLogo(newLogoUrl);
    if (newLogoUrl) {
      localStorage.setItem('diploma_custom_logo', newLogoUrl);
    } else {
      localStorage.removeItem('diploma_custom_logo');
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('diploma_splash_shown', 'true');
  };

  const handleTriggerSplash = () => {
    setShowSplash(true);
    setIsBrandingOpen(false);
  };

  const handleAddHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('diploma_calc_history');
  };

  const handleSendToCalculator = (val: string) => {
    setDisplayValue(val);
    const calcEl = document.getElementById('calculator-section');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 py-6 px-3 sm:px-6">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen logoUrl={currentLogo} onFinish={handleSplashFinish} />
      )}

      {/* About & Branding Modal */}
      <AboutBrandingModal
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        logoUrl={currentLogo}
        onCustomLogoChange={handleCustomLogoChange}
        onTriggerSplash={handleTriggerSplash}
        isCustomLogo={Boolean(customLogo)}
      />

      <div className="container max-w-4xl mx-auto">
        {/* Header with Official Logo Branding */}
        <header className="flex justify-between items-center mb-5 px-1">
          <div
            onClick={() => setIsBrandingOpen(true)}
            className="flex items-center gap-3.5 cursor-pointer group"
            title="Click to view Official Branding & Android Assets"
          >
            {/* Official Logo: exact 1:1, centered, not stretched, no text overlaid */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-950 p-1.5 shadow-md shadow-blue-500/10 border border-slate-700/60 group-hover:border-blue-500 transition-all flex items-center justify-center shrink-0">
              <img
                src={currentLogo}
                alt="MathSphere Official Logo"
                className="w-full h-full object-contain select-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  MathSphere
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-2.5 h-2.5" /> Official
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mathematics, Physics & Engineering Formula Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Branding & Android Assets Button */}
            <button
              type="button"
              onClick={() => setIsBrandingOpen(true)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Official Branding & Android Icons"
            >
              <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">Android Assets</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              className="mode-btn p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center"
              onClick={toggleDark}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </header>

        {/* Primary Scientific Calculator Card */}
        <div id="calculator-section" className="card mb-6">
          <ScientificCalculator
            displayValue={displayValue}
            setDisplayValue={setDisplayValue}
            onAddHistory={handleAddHistory}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="tabs flex gap-2 flex-wrap mb-4" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'math'}
            className={`tab px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'math'
                ? 'active bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
            }`}
            onClick={() => setActiveTab('math')}
          >
            <span>📐</span> Maths Formulas
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'physics'}
            className={`tab px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'physics'
                ? 'active bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
            }`}
            onClick={() => setActiveTab('physics')}
          >
            <span>⚡</span> Physics & Electrical
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'converter'}
            className={`tab px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'converter'
                ? 'active bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
            }`}
            onClick={() => setActiveTab('converter')}
          >
            <span>🔄</span> Unit Converter
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'history'}
            className={`tab px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'active bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <span>🕘</span> History ({history.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'result-card'}
            className={`tab px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'result-card'
                ? 'active bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
            }`}
            onClick={() => setActiveTab('result-card')}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Result Card</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'branding'}
            className={`tab px-4 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'branding'
                ? 'active bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
            }`}
            onClick={() => setActiveTab('branding')}
          >
            <Smartphone className="w-4 h-4 text-blue-500" />
            <span>Branding & Android Icons</span>
          </button>
        </div>

        {/* Section Contents */}
        <div className="card bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-700/80 transition-colors">
          {/* MATHS */}
          <div
            id="math"
            className={`section ${activeTab === 'math' ? 'active block' : 'hidden'}`}
          >
            <MathFormulas onSendToCalculator={handleSendToCalculator} />
          </div>

          {/* PHYSICS */}
          <div
            id="physics"
            className={`section ${activeTab === 'physics' ? 'active block' : 'hidden'}`}
          >
            <PhysicsFormulas onSendToCalculator={handleSendToCalculator} />
          </div>

          {/* CONVERTER */}
          <div
            id="converter"
            className={`section ${activeTab === 'converter' ? 'active block' : 'hidden'}`}
          >
            <UnitConverter onSendToCalculator={handleSendToCalculator} />
          </div>

          {/* HISTORY */}
          <div
            id="history"
            className={`section ${activeTab === 'history' ? 'active block' : 'hidden'}`}
          >
            <HistoryPanel
              history={history}
              onClearHistory={handleClearHistory}
              onSendToCalculator={handleSendToCalculator}
            />
          </div>

          {/* UNIT TEST RESULT CARD */}
          <div
            id="result-card"
            className={`section ${activeTab === 'result-card' ? 'active block' : 'hidden'}`}
          >
            <UnitTestResultCard />
          </div>

          {/* BRANDING & ANDROID ICONS */}
          <div
            id="branding"
            className={`section ${activeTab === 'branding' ? 'active block' : 'hidden'}`}
          >
            <BrandingSection
              logoUrl={currentLogo}
              onCustomLogoChange={handleCustomLogoChange}
              onTriggerSplash={handleTriggerSplash}
              isCustomLogo={Boolean(customLogo)}
            />
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          <span>MathSphere • Fast, accurate, and offline-capable</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBrandingOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              Android Launcher Assets
            </button>
            <button
              onClick={handleTriggerSplash}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              Replay Splash Screen
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
