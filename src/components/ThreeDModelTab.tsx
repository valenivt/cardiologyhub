import React, { useState } from 'react';
import { HEART_PARTS } from '../data/circulationData';
import { HeartPart } from '../types/cardiology';
import { ThreeDHeartViewer } from './ThreeDHeartViewer';

interface ThreeDModelTabProps {
  isDark: boolean;
}

export const ThreeDModelTab: React.FC<ThreeDModelTabProps> = ({ isDark }) => {
  const [viewerMode, setViewerMode] = useState<'webgl' | 'sketchfab'>('webgl');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPart, setSelectedPart] = useState<HeartPart>(HEART_PARTS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectPartById = (partId: string) => {
    const found = HEART_PARTS.find((p) => p.id === partId);
    if (found) {
      setSelectedPart(found);
    }
  };

  const filteredParts = HEART_PARTS.filter((part) => {
    const matchesCategory =
      selectedCategory === 'all' || part.category === selectedCategory;
    const matchesQuery =
      part.nameId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.nameLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* 3D Model Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-cube text-rose-500"></i>
              Model 3D Anatomi Jantung Manusia
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Eksplorasi spasial 3D organ jantung lengkap dengan arkus aorta, trunkus pulmonalis, vena kava, serta ventrikel &amp; atrium.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold self-start sm:self-center">
            <button
              onClick={() => setViewerMode('webgl')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewerMode === 'webgl'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-microchip text-xs"></i>
              <span>3D WebGL (Pasti Berfungsi)</span>
            </button>
            <button
              onClick={() => setViewerMode('sketchfab')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewerMode === 'sketchfab'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-globe text-xs"></i>
              <span>Sketchfab 3D Embed</span>
            </button>
          </div>
        </div>

        {/* 3D Viewers Container */}
        {viewerMode === 'webgl' ? (
          <div>
            <ThreeDHeartViewer
              isDark={isDark}
              selectedPartId={selectedPart.id}
              onSelectPartById={handleSelectPartById}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <span>
                <i className="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i>
                Engine: <strong>Native WebGL 3D (Three.js)</strong> · Render langsung di browser tanpa ketergantungan jaringan eksternal.
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Fitur: Rotasi 360°, Zoom, Denyut Animasi, Mode X-Ray &amp; Pin Hotspot
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Sketchfab Fallback Notice & Direct Link */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <i className="fa-solid fa-shield-halved text-amber-600"></i>
                <span>
                  Jika iframe Sketchfab terhalang oleh pembatasan keamanan browser/sandbox:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewerMode('webgl')}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
                >
                  Gunakan Mode WebGL
                </button>
                <a
                  href="https://sketchfab.com/3d-models/jantung-manusia-7a06acd67c4f47eba2456199146a8d5b"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  <span>Buka di Sketchfab</span>
                </a>
              </div>
            </div>

            {/* Sketchfab Iframe Container */}
            <div className="relative w-full aspect-video md:aspect-[21/9] min-h-[460px] bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-800">
              <iframe
                title="Model 3D Jantung Manusia (Sketchfab)"
                src="https://sketchfab.com/models/7a06acd67c4f47eba2456199146a8d5b/embed?autostart=1&internal=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0"
                className="w-full h-full border-0 absolute inset-0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <span>
                <i className="fa-solid fa-circle-info text-blue-500 mr-1.5"></i>
                Model Sumber: <strong>Jantung Manusia</strong> (Sketchfab ID: <code>7a06acd67c4f47eba2456199146a8d5b</code>)
              </span>
              <a
                href="https://sketchfab.com/3d-models/jantung-manusia-7a06acd67c4f47eba2456199146a8d5b"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-blue-500 hover:underline"
              >
                https://sketchfab.com/3d-models/jantung-manusia-7a06acd67c4f47eba2456199146a8d5b
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Anatomical Parts Explorer (Penjelasan Bagian-Bagian Jantung) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Parts Directory List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-list-check text-rose-500"></i>
                Katalog Anatomi Jantung
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {filteredParts.length} Bagian
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-slate-400"></i>
              <input
                type="text"
                placeholder="Cari bagian (mis: atrium, katup, aorta)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs font-medium">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'chambers', label: 'Ruang' },
                { id: 'valves', label: 'Katup' },
                { id: 'vessels', label: 'Pembuluh' },
                { id: 'muscle', label: 'Sekat & Otot' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredParts.map((part) => {
              const isSelected = selectedPart.id === part.id;
              const gasBadgeColor =
                part.gasType === 'o2'
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-900'
                  : part.gasType === 'co2'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                  : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';

              return (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {part.nameId}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      {part.nameLatin}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap ${gasBadgeColor}`}
                  >
                    {part.gasType === 'o2' ? 'Kaya O₂' : part.gasType === 'co2' ? 'Kaya CO₂' : 'Struktural'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Part Full Detail View */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold tracking-wide uppercase mb-1">
                Detail Anatomi &amp; Fisiologi Jantung
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedPart.nameId}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic">
                {selectedPart.nameLatin}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedPart.gasType === 'o2'
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : selectedPart.gasType === 'co2'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {selectedPart.gasType === 'o2'
                ? 'Darah Bersih (Kaya O₂)'
                : selectedPart.gasType === 'co2'
                ? 'Darah Kotor (Kaya CO₂)'
                : 'Pemisah Sisi Kanan-Kiri'}
            </span>
          </div>

          {/* Description & Mechanics */}
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-align-left text-slate-400"></i>
                Deskripsi Morfologis
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs md:text-sm">
                {selectedPart.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-gears text-rose-500"></i>
                Fungsi &amp; Mekanisme Fisiologis
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                {selectedPart.functionDetail}
              </p>
            </div>

            {selectedPart.wallThickness && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-ruler-combined text-amber-500"></i>
                  Karakteristik Ketebalan Dinding / Struktur
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                  {selectedPart.wallThickness}
                </p>
              </div>
            )}

            {/* Official Erlangga Citation Quote */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                <i className="fa-solid fa-book-open"></i>
                Rujukan Resmi Buku Erlangga Kelas XI
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-200/90 italic leading-relaxed">
                "{selectedPart.erlanggaNote}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
