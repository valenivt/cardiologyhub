import React from 'react';
import { ActiveTab } from '../types/cardiology';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark
}) => {
  const navTabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'simulation', label: 'Simulasi Sirkulasi', icon: 'fa-route' },
    { id: 'model3d', label: '3D Model', icon: 'fa-cube' },
    { id: 'mechanism', label: 'Mekanisme', icon: 'fa-book-open' },
    { id: 'literature', label: 'Daftar Pustaka & Tim', icon: 'fa-users' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark with Pulsing Heart */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-500 shadow-sm">
            <i className="fa-solid fa-heart text-xl animate-heartbeat"></i>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2">
              Cardiology Hub
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block whitespace-nowrap">
              Fisiologi Sirkulasi Darah &amp; Dinamika Tekanan Darah
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-xs`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Dark / Light Mode Toggle + Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Alihkan tema gelap/terang"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {isDark ? (
              <i className="fa-solid fa-sun text-amber-400 text-sm"></i>
            ) : (
              <i className="fa-solid fa-moon text-slate-600 text-sm"></i>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Subnav Strip */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-900/95 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-xs`}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
