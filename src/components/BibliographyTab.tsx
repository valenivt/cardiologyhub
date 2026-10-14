import React, { useState, useEffect } from 'react';
import {
  VESSEL_COMPARISON_TABLE,
  QUIZ_QUESTIONS,
  GLOSSARY_ITEMS
} from '../data/circulationData';

interface BibliographyTabProps {
  isDark: boolean;
}

const HALODOC_URL =
  'https://www.halodoc.com/artikel/ini-fungsi-jantung-manusia-dan-bagian-bagiannya?srsltid=AU7gw4V4byxtbdTqwqcIatev1oFJxrChVmvNxlFUBDA1SZLAvL9Tocp_';

interface TeamMember {
  id: string;
  name: string;
  fileName: string;
  displayName: string;
  role: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  // --- ROW 1 (3 UP) ---
  {
    id: 'valensya',
    name: 'Valensya Isadora Tan',
    fileName: 'WhatsApp Image 2026-10-14 at 8.46.13 AM.jpeg',
    displayName: 'Valensya Isadora Tan',
    role: 'Penyusun Fisiologi Sirkulasi',
    initials: 'VT',
    avatarBg: 'bg-emerald-100 dark:bg-emerald-950/70',
    avatarColor: 'text-emerald-700 dark:text-emerald-300'
  },
  {
    id: 'barbie',
    name: 'Barbie Aprillia Juanda',
    fileName: 'barbie.jpeg',
    displayName: 'Barbie Aprillia Juanda',
    role: 'Peneliti Anatomi & Katup Jantung',
    initials: 'BJ',
    avatarBg: 'bg-rose-100 dark:bg-rose-950/70',
    avatarColor: 'text-rose-700 dark:text-rose-300'
  },
  {
    id: 'brilliana',
    name: 'Brilliana Wennardo',
    fileName: 'brilliana wennardo.jpeg',
    displayName: 'Brilliana Wennardo',
    role: 'Peneliti Sirkulasi Pulmonalis',
    initials: 'BW',
    avatarBg: 'bg-amber-100 dark:bg-amber-950/70',
    avatarColor: 'text-amber-700 dark:text-amber-300'
  },

  // --- ROW 2 (3 DOWN) - BRENDON & NATH SIDE BY SIDE ---
  {
    id: 'brendon',
    name: 'Brendon Maximillian Lim',
    fileName: 'brendon.jpeg',
    displayName: 'Brendon Maximillian Lim',
    role: 'Peneliti Dinamika Tekanan Darah',
    initials: 'BL',
    avatarBg: 'bg-blue-100 dark:bg-blue-950/70',
    avatarColor: 'text-blue-700 dark:text-blue-300'
  },
  {
    id: 'nath',
    name: 'Nathania Nadira To',
    fileName: 'nath.jpeg',
    displayName: 'Nathania Nadira To',
    role: 'Peneliti Sirkulasi Sistemik',
    initials: 'NT',
    avatarBg: 'bg-purple-100 dark:bg-purple-950/70',
    avatarColor: 'text-purple-700 dark:text-purple-300'
  },
  {
    id: 'cayley',
    name: 'Cayley McLin',
    fileName: 'cayley mclin.jpeg',
    displayName: 'Cayley McLin',
    role: 'Penyusun Komparasi Vaskular',
    initials: 'CM',
    avatarBg: 'bg-teal-100 dark:bg-teal-950/70',
    avatarColor: 'text-teal-700 dark:text-teal-300'
  }
];

export const BibliographyTab: React.FC<BibliographyTabProps> = ({ isDark }) => {
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // Custom photo overrides from localStorage or local upload
  const [memberPhotos, setMemberPhotos] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cardiology_team_photos');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // Ignore JSON error
      }
    }
    return {};
  });

  const handlePhotoUpload = (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setMemberPhotos((prev) => {
          const next = { ...prev, [memberId]: dataUrl };
          try {
            localStorage.setItem('cardiology_team_photos', JSON.stringify(next));
          } catch (err) {
            // Storage quota warning
          }
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-8">
      {/* 1. Official Book Citation & Online Medical Reference Metadata */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <i className="fa-solid fa-book-bookmark text-sm"></i>
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Pustaka &amp; Rujukan Resmi Kurikulum Merdeka &amp; Medis
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-900">
            Fase F · Kelas XI SMA/MA &amp; Halodoc Medis
          </span>
        </div>

        {/* Citations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Citation 1: Buku Teks Erlangga */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>Buku Teks Kurikulum Merdeka (APA 7th)</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono">Hlm 167-169</span>
            </div>
            <p className="text-sm font-serif text-slate-800 dark:text-slate-200 leading-relaxed">
              Irnaningtyas, &amp; Sagita, Sylva. (2022). <em>Biologi untuk SMA/MA Kelas XI Kelompok Mata Pelajaran Pilihan</em>. Jakarta: Penerbit Erlangga.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <span><strong>Materi:</strong> Sistem Sirkulasi pada Manusia</span>
              <span>·</span>
              <span>Peredaran Pulmonalis, Sistemik &amp; Tekanan Darah</span>
            </div>
          </div>

          {/* Citation 2: Halodoc Medis (Interactive link) */}
          <a
            href={HALODOC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/90 dark:border-red-900/60 hover:border-red-500 dark:hover:border-red-600 transition-all hover:shadow-md space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-hospital text-xs"></i>
                Rujukan Medis Daring (Halodoc)
              </span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex items-center gap-1 font-bold">
                Buka Artikel <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              Ini Fungsi Jantung Manusia dan Bagian-Bagiannya
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
              Ditinjau oleh tim medis Halodoc: Ulasan komprehensif mengenai fungsi 4 ruang jantung (atrium &amp; ventrikel) dan pembuluh darah utama (vena cava, arteri pulmonalis, vena pulmonalis, dan aorta).
            </div>
            <div className="pt-1 text-[11px] text-red-600 dark:text-red-400 font-mono truncate">
              {HALODOC_URL}
            </div>
          </a>
        </div>

        {/* Kurikulum Merdeka Learning Objective Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <i className="fa-solid fa-bullseye text-rose-500"></i>
              Capaian Pembelajaran (CP)
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Peserta didik mampu menganalisis keterkaitan antara struktur anatomi organ jantung, pembuluh darah, dan paru-paru dengan mekanisme bioproses sirkulasi ganda serta dinamika tekanan sistolik/diastolik.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <i className="fa-solid fa-lightbulb text-amber-500"></i>
              Tujuan Pembelajaran Khusus
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              1. Menelusuri alur peredaran darah pulmoner dan sistemik tanpa kekeliruan katup.
              2. Mengaitkan tebal otot bilik kiri dengan daya dorong sistole ±120 mmHg.
              3. Menganalisis perbedaan histologis dan fisiologis arteri, vena, dan kapiler.
            </p>
          </div>
        </div>
      </div>

      {/* 2. KELOMPOK 6 — TIM PENYUSUN & PENELITI (3 UP & 3 DOWN, BRENDON & NATH SIDE BY SIDE) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md">
              <i className="fa-solid fa-users text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Tim Penyusun Media
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Biologi SMA Kelas XI
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                Kelompok 6
              </h3>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-700 dark:text-slate-300">
              6 Anggota
            </span>
            <span className="hidden md:inline">· Susunan 3 Atas &amp; 3 Bawah</span>
          </div>
        </div>

        {/* 3 UP & 3 DOWN GRID (brendon & nath side by side in row 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, idx) => {
            const uploadedImg = memberPhotos[member.id];
            // Primary path candidates to look for image in public or root
            const imageCandidates = [
              uploadedImg,
              `/${member.fileName}`,
              `/team/${member.fileName}`,
              `/images/team/${member.fileName}`
            ].filter(Boolean) as string[];

            return (
              <div
                key={member.id}
                className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Frame Container */}
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 shadow-inner flex items-center justify-center">
                  {/* Photo Display with Graceful Fallback */}
                  <img
                    src={imageCandidates[0]}
                    alt={member.displayName}
                    onError={(e) => {
                      // Try fallback to standard encoded path or hide if none
                      const target = e.currentTarget;
                      if (target.src.includes(member.fileName) && !target.src.includes('public/')) {
                        target.src = `/team/${member.fileName}`;
                      } else {
                        target.style.display = 'none';
                        const fallbackDiv = target.parentElement?.querySelector('.member-fallback');
                        if (fallbackDiv) {
                          (fallbackDiv as HTMLElement).style.display = 'flex';
                        }
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Fallback Display if image file is not on server disk */}
                  <div
                    className={`member-fallback absolute inset-0 hidden flex-col items-center justify-center p-4 text-center ${member.avatarBg}`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${member.avatarBg} ${member.avatarColor} border-2 border-current/20 flex items-center justify-center text-xl font-extrabold shadow-sm mb-2`}
                    >
                      {member.initials}
                    </div>
                    <span className={`text-xs font-bold ${member.avatarColor}`}>
                      {member.displayName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      {member.fileName}
                    </span>
                    <label className="mt-3 cursor-pointer px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 shadow-sm transition-colors">
                      <i className="fa-solid fa-upload mr-1"></i> Ganti Foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(member.id, e)}
                      />
                    </label>
                  </div>

                  {/* Overlay Index Badge (1 to 6) */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                    #{idx + 1}
                  </div>

                  {/* Quick Upload Action on Hover */}
                  <label
                    title="Unggah atau ganti foto anggota ini"
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 cursor-pointer p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-white text-xs backdrop-blur-md transition-all shadow-md"
                  >
                    <i className="fa-solid fa-camera"></i>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(member.id, e)}
                    />
                  </label>
                </div>

                {/* Caption Under the Image with Name (Required by user) */}
                <div className="mt-3 text-center space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {member.displayName}
                  </h4>
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {member.role}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                    File: {member.fileName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            <i className="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i>
            Baris Atas: <strong>Valensya</strong>, <strong>Barbie</strong>, <strong>Brilliana</strong> · Baris Bawah: <strong>Brendon</strong> &amp; <strong>Nathania</strong> (berdampingan), <strong>Cayley</strong>.
          </span>
          <span className="font-mono text-[11px]">Proyek Pembelajaran Biologi Kurikulum Merdeka</span>
        </div>
      </div>

      {/* 3. INTERACTIVE VISUAL CARD 1: FUNGSI BAGIAN-BAGIAN JANTUNG (HALODOC) */}
      <a
        href={HALODOC_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Ketuk visual ini untuk membaca artikel lengkap di Halodoc"
        className="group block bg-gradient-to-br from-white via-rose-50/40 to-white dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 border-2 border-rose-200 dark:border-rose-900/60 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      >
        {/* Top Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-rose-100 dark:border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-heart-pulse text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Visual Medis · Halodoc
                </span>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-bold hidden sm:inline">
                  Ketuk untuk Buka Sumber ↗
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Fungsi Bagian-Bagian Jantung
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all group-hover:translate-x-1">
            <span>Baca di Halodoc</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </div>
        </div>

        {/* 4 Chamber Visual Blocks (Exact Text from Image 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Atrium Kanan */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Atrium Kanan (Serambi Kanan)
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Kaya CO₂
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Menerima darah yang kaya akan karbon dioksida dari seluruh tubuh melalui pembuluh vena cava.
            </p>
          </div>

          {/* 2. Ventrikel Kanan */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Ventrikel Kanan (Bilik Kanan)
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Pompa ke Pulmo
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Memompa darah dari atrium kanan menuju paru-paru untuk melepaskan karbon dioksida dan mengambil oksigen segar.
            </p>
          </div>

          {/* 3. Atrium Kiri */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-rose-300 dark:group-hover:border-rose-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                Atrium Kiri (Serambi Kiri)
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                Kaya O₂
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Menerima darah yang sudah kaya oksigen dari paru-paru melalui vena pulmonalis.
            </p>
          </div>

          {/* 4. Ventrikel Kiri */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-rose-300 dark:group-hover:border-rose-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                Ventrikel Kiri (Bilik Kiri)
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                Otot Paling Tebal
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Ruang yang memiliki dinding otot paling tebal karena bertugas memompa darah kaya oksigen ke seluruh bagian tubuh melalui pembuluh darah besar bernama aorta.
            </p>
          </div>
        </div>

        {/* Tap indicator footer */}
        <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
          <span className="flex items-center gap-1.5 font-semibold">
            <i className="fa-solid fa-hand-pointer text-xs animate-bounce"></i>
            Ketuk di mana saja pada kotak visual ini untuk membuka rujukan artikel lengkap di Halodoc
          </span>
          <span className="font-mono text-[11px] underline">halodoc.com ↗</span>
        </div>
      </a>

      {/* 4. INTERACTIVE VISUAL CARD 2: FUNGSI PEMBULUH DARAH UTAMA (HALODOC) */}
      <a
        href={HALODOC_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Ketuk visual ini untuk membaca artikel lengkap di Halodoc"
        className="group block bg-gradient-to-br from-white via-blue-50/40 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-900/60 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      >
        {/* Top Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-3 border-b border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-route text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Visual Medis · Halodoc
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold hidden sm:inline">
                  Ketuk untuk Buka Sumber ↗
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Fungsi Pembuluh Darah Utama Jantung
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all group-hover:translate-x-1">
            <span>Baca di Halodoc</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </div>
        </div>

        {/* Lead Explanatory Note from Image 2 */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed italic">
          "Jantung dihubungkan dengan sistem sirkulasi melalui beberapa pembuluh darah utama yang sering muncul dalam diagram atau gambar bagian jantung:"
        </p>

        {/* 4 Blood Vessel Visual Blocks (Exact Text from Image 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Vena Cava */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <i className="fa-solid fa-arrow-down-long text-blue-500"></i>
                Vena Cava
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Darah Kotor
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Membawa darah kotor dari tubuh kembali ke jantung.
            </p>
          </div>

          {/* 2. Arteri Pulmonalis */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <i className="fa-solid fa-lungs text-blue-500"></i>
                Arteri Pulmonalis
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Pengecualian Arteri
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Satu-satunya arteri yang membawa darah miskin oksigen (ke paru-paru).
            </p>
          </div>

          {/* 3. Vena Pulmonalis */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-rose-300 dark:group-hover:border-rose-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <i className="fa-solid fa-lungs text-rose-500"></i>
                Vena Pulmonalis
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                Pengecualian Vena
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Satu-satunya vena yang membawa darah kaya oksigen (dari paru-paru).
            </p>
          </div>

          {/* 4. Aorta */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm group-hover:border-rose-300 dark:group-hover:border-rose-800 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <i className="fa-solid fa-arrow-up-long text-rose-500"></i>
                Aorta
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                Arteri Terbesar
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Arteri terbesar yang menyalurkan darah beroksigen ke sistem sirkulasi sistemik.
            </p>
          </div>
        </div>

        {/* Tap indicator footer */}
        <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
          <span className="flex items-center gap-1.5 font-semibold">
            <i className="fa-solid fa-hand-pointer text-xs animate-bounce"></i>
            Ketuk di mana saja pada kotak visual ini untuk membuka rujukan artikel lengkap di Halodoc
          </span>
          <span className="font-mono text-[11px] underline">halodoc.com ↗</span>
        </div>
      </a>

      {/* 5. Vessel Comparison Table (Arteri vs Vena vs Kapiler) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-table-list text-rose-500"></i>
              Tabel Komparasi Pembuluh Darah (Buku Erlangga)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Perbedaan karakteristik fisiologis antara Pembuluh Nadi (Arteri), Pembuluh Balik (Vena), dan Pembuluh Kapiler.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                <th className="p-3 rounded-l-lg font-bold">Karakteristik Pembeda</th>
                <th className="p-3 font-bold text-red-600 dark:text-red-400">Pembuluh Nadi (Arteri)</th>
                <th className="p-3 font-bold text-blue-600 dark:text-blue-400">Pembuluh Balik (Vena)</th>
                <th className="p-3 rounded-r-lg font-bold text-emerald-600 dark:text-emerald-400">Pembuluh Kapiler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {VESSEL_COMPARISON_TABLE.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {row.feature}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {row.artery}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {row.vein}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {row.capillary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Glossary of Terms */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-spell-check text-sky-500"></i>
            Glosarium Fisiologi Kardiovaskular SMA
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Istilah kunci dan terminologi anatomis baku untuk persiapan asesmen sumatif SMA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GLOSSARY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {item.term}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Interactive Quiz (Uji Pemahaman Siswa SMA) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-circle-question text-rose-500"></i>
              Kuis Evaluasi Pemahaman Materi (Hlm. 167-169 &amp; Halodoc)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Uji pemahaman Anda terhadap konsep peredaran pulmonalis, sistemik, dan tekanan darah.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {showResults && (
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                Skor Anda: {score} / {QUIZ_QUESTIONS.length} ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
              </span>
            )}
            <button
              onClick={handleResetQuiz}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Reset Kuis
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q, qIndex) => {
            const userAnswer = selectedAnswers[q.id];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <div className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </div>
                </div>

                {/* Option radios */}
                <div className="space-y-2 pl-8">
                  {q.options.map((option, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    let optionStyle =
                      'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';

                    if (showResults) {
                      if (optIdx === q.correctIndex) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 line-through';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={showResults}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {showResults && optIdx === q.correctIndex && (
                          <i className="fa-solid fa-check text-emerald-600 text-xs shrink-0"></i>
                        )}
                        {showResults && isSelected && !isCorrect && (
                          <i className="fa-solid fa-xmark text-red-600 text-xs shrink-0"></i>
                        )}
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <i className={`fa-solid ${isCorrect ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-rose-600'}`}></i>
                      {isCorrect ? 'Benar!' : 'Kurang Tepat.'} Referensi: {q.referencePage}
                    </div>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showResults && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i>
              <span>Kirim Jawaban &amp; Lihat Pembahasan</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
