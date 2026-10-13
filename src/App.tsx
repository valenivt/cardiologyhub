import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CirculationCanvas } from './components/CirculationCanvas';
import { ThreeDModelTab } from './components/ThreeDModelTab';
import { MechanismPlayerTab } from './components/MechanismPlayerTab';
import { BibliographyTab } from './components/BibliographyTab';
import { ActiveTab } from './types/cardiology';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulation');
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check initial preference or default to false
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  // Sync dark class on root document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* 1. TOP NAVIGATION BAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Curricular Header Kicker */}
        <div className="bg-gradient-to-r from-rose-900/10 via-slate-100 to-blue-900/10 dark:from-rose-950/40 dark:via-slate-900/40 dark:to-blue-950/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Kurikulum Merdeka SMA/MA Kelas XI · Erlangga Halaman 167–169</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fisiologi Sirkulasi Pulmonalis, Sistemik &amp; Hemodinamika Tekanan Darah
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Media laboratorium visual interaktif untuk menelaah jalur aliran eritrosit, pertukaran gas di alveolus &amp; jaringan seluler, struktur katup jantung, serta asal-usul bunyi sistole dan diastole.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'simulation'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <i className="fa-solid fa-play text-xs"></i>
              <span>Simulasi</span>
            </button>
            <button
              onClick={() => setActiveTab('mechanism')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'mechanism'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <i className="fa-solid fa-list-ol text-xs"></i>
              <span>Tur Langkah</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher Content */}
        {activeTab === 'simulation' && (
          <CirculationCanvas isDark={isDark} />
        )}

        {activeTab === 'model3d' && (
          <ThreeDModelTab isDark={isDark} />
        )}

        {activeTab === 'mechanism' && (
          <MechanismPlayerTab isDark={isDark} />
        )}

        {activeTab === 'literature' && (
          <BibliographyTab isDark={isDark} />
        )}
      </main>

      {/* Modern, Clean Educational Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-heart text-rose-500"></i>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Cardiology Hub</span>
            <span>· Media Pembelajaran Biologi SMA Fase F</span>
          </div>

          <div className="text-center md:text-right text-[11px]">
            Sumber Rujukan: Irnaningtyas &amp; Sylva Sagita (2022), <em>Biologi untuk SMA/MA Kelas XI</em>, Penerbit Erlangga, hlm. 167–169.
          </div>
        </div>
      </footer>
    </div>
  );
}
