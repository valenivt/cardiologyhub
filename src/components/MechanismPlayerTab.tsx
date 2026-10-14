import React, { useState, useEffect } from 'react';
import {
  PULMONARY_STEPS,
  SYSTEMIC_STEPS,
  BLOOD_PRESSURE_INFO
} from '../data/circulationData';
import { CirculationPhase, MechanismStep } from '../types/cardiology';

interface MechanismPlayerTabProps {
  isDark: boolean;
}

export const MechanismPlayerTab: React.FC<MechanismPlayerTabProps> = ({ isDark }) => {
  const [activePhase, setActivePhase] = useState<CirculationPhase>('pulmonary');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);

  const steps: MechanismStep[] =
    activePhase === 'pulmonary' ? PULMONARY_STEPS : SYSTEMIC_STEPS;

  // Auto-tour animation effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTourPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            // End of steps: loop or stop
            return 0;
          }
        });
      }, 2600);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTourPlaying, steps.length]);

  // Switch phase reset
  const handlePhaseChange = (phase: CirculationPhase) => {
    setActivePhase(phase);
    setActiveStepIndex(0);
    setIsTourPlaying(false);
  };

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="space-y-6">
      {/* Top Phase Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-center">
        {/* Segmented Phase Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => handlePhaseChange('pulmonary')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activePhase === 'pulmonary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className="fa-solid fa-lungs text-xs"></i>
            <span>1. Peredaran Pulmonalis</span>
          </button>
          <button
            onClick={() => handlePhaseChange('systemic')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activePhase === 'systemic'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className="fa-solid fa-globe text-xs"></i>
            <span>2. Peredaran Sistemik</span>
          </button>
          <button
            onClick={() => handlePhaseChange('pressure')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activePhase === 'pressure'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className="fa-solid fa-heart-pulse text-xs"></i>
            <span>3. Tekanan Darah</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on phase */}
      {activePhase !== 'pressure' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Step Navigator and Cards (Left Column) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Player Controls Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTourPlaying(!isTourPlaying)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                    isTourPlaying
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <i className={`fa-solid ${isTourPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  <span>{isTourPlaying ? 'Jeda Simulasi' : 'Mulai Simulasi'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsTourPlaying(false);
                    setActiveStepIndex(0);
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs"
                  title="Reset ke Langkah 1"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsTourPlaying(false);
                    setActiveStepIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={activeStepIndex === 0}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <i className="fa-solid fa-chevron-left mr-1"></i> Prev
                </button>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {activeStepIndex + 1} / {steps.length}
                </span>
                <button
                  onClick={() => {
                    setIsTourPlaying(false);
                    setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
                  }}
                  disabled={activeStepIndex === steps.length - 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Next <i className="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>

            {/* List of Steps with Dynamic Highlight */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const isPulmonary = activePhase === 'pulmonary';

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => {
                      setIsTourPlaying(false);
                      setActiveStepIndex(idx);
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      isActive
                        ? isPulmonary
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20 translate-x-1'
                          : 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-md ring-2 ring-rose-500/20 translate-x-1'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Step Number Badge */}
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isActive
                            ? isPulmonary
                              ? 'bg-blue-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {step.stepNumber}
                      </span>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-bold ${
                              isActive
                                ? isPulmonary
                                  ? 'text-blue-900 dark:text-blue-200'
                                  : 'text-rose-900 dark:text-rose-200'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              step.gasState === 'o2'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {step.gasState === 'o2' ? 'Kaya O₂' : 'Kaya CO₂'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.action}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            Bagian: <strong className="text-slate-700 dark:text-slate-300">{step.highlightPart}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            Katup: {step.valveState}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Detail Spotlight & Erlangga Exact Quotation (Right Column) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 sticky top-20">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  LANGKAH {currentStep.stepNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentStep.title}
                </h3>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  activePhase === 'pulmonary'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                <i className={`fa-solid ${currentStep.icon}`}></i>
              </div>
            </div>

            {/* Step Action Detail */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-stethoscope text-rose-500"></i>
                  Aktivitas Fisiologis Jantung:
                </div>
                {currentStep.action}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-door-closed text-amber-500"></i>
                  Status Katup Jantung (Valvula):
                </div>
                {currentStep.valveState}
              </div>
            </div>

            {/* Quick Flow Summary Diagram */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Ringkasan Lintasan Lengkap:
              </div>
              <div className="text-[11px] font-mono leading-relaxed text-slate-600 dark:text-slate-400">
                {activePhase === 'pulmonary' ? (
                  <span>
                    Ventrikel Kanan ➔ Katup Pulmonal ➔ Arteri Pulmonalis ➔ Pulmo (Oksigenasi) ➔ Vena Pulmonalis ➔ Atrium Kiri ➔ Katup Bikuspid ➔ Ventrikel Kiri
                  </span>
                ) : (
                  <span>
                    Ventrikel Kiri ➔ Katup Aorta ➔ Aorta &amp; Arteri Sistemik ➔ Sel Tubuh (Respirasi) ➔ Vena Kava ➔ Atrium Kanan ➔ Katup Trikuspid ➔ Ventrikel Kanan
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== 3. TEKANAN DARAH (SISTOLE & DIASTOLE) ==================== */
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Systole Card */}
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
                  S
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {BLOOD_PRESSURE_INFO.systole.title}
                  </h3>
                  <span
                    style={{ fontFamily: 'Verdana' }}
                    className="text-xs text-rose-600 dark:text-rose-400 font-semibold font-mono"
                  >
                    Nilai Normal: {BLOOD_PRESSURE_INFO.systole.valueRange}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] font-medium">
                Kontraksi Ventrikel
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {BLOOD_PRESSURE_INFO.systole.definition}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-3">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Mekanisme:
              </div>
              <div className="space-y-3">
                {PULMONARY_STEPS.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5 last:border-b-0 last:pb-0 space-y-1"
                  >
                    <div className="font-bold text-slate-900 dark:text-white">
                      {step.stepNumber}. {step.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.action}
                    </p>
                    <div className="pt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span>
                        Bagian: <strong className="text-slate-700 dark:text-slate-300">{step.highlightPart}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Katup: {step.valveState}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 italic">
              * {BLOOD_PRESSURE_INFO.systole.clinicalNote}
            </div>
          </div>

          {/* Diastole Card */}
          <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  D
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {BLOOD_PRESSURE_INFO.diastole.title}
                  </h3>
                  <span
                    style={{ fontFamily: 'Verdana' }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold font-mono"
                  >
                    Nilai Normal: {BLOOD_PRESSURE_INFO.diastole.valueRange}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-medium">
                Relaksasi Ventrikel
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {BLOOD_PRESSURE_INFO.diastole.definition}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Mekanisme:</strong> {BLOOD_PRESSURE_INFO.diastole.mechanism}
            </div>

            <div className="text-[11px] text-slate-500 italic">
              * {BLOOD_PRESSURE_INFO.diastole.clinicalNote}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
