import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  circuit: 'pulmonary' | 'systemic';
  t: number; // 0 to 1 along parametric path
  speed: number;
  type: 'co2' | 'o2';
  size: number;
}

interface CirculationCanvasProps {
  isDark: boolean;
}

export const CirculationCanvas: React.FC<CirculationCanvasProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Simulation controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [bpm, setBpm] = useState<number>(75);

  // Cardiac fatigue & arrest state
  const [strainLevel, setStrainLevel] = useState<number>(0); // 0 to 100%
  const [isCardiacArrest, setIsCardiacArrest] = useState<boolean>(false);

  // Particles storage
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles along paths
  useEffect(() => {
    const particles: Particle[] = [];
    const countPerCircuit = 30;

    // Pulmonary circuit particles
    for (let i = 0; i < countPerCircuit; i++) {
      const t = i / countPerCircuit;
      const isO2 = t >= 0.5;
      particles.push({
        id: i,
        circuit: 'pulmonary',
        t,
        speed: 0.0011,
        type: isO2 ? 'o2' : 'co2',
        size: 4.5 + Math.random() * 2
      });
    }

    // Systemic circuit particles
    for (let i = 0; i < countPerCircuit; i++) {
      const t = i / countPerCircuit;
      const isCO2 = t >= 0.5;
      particles.push({
        id: countPerCircuit + i,
        circuit: 'systemic',
        t,
        speed: 0.0011,
        type: isCO2 ? 'co2' : 'o2',
        size: 4.5 + Math.random() * 2
      });
    }

    particlesRef.current = particles;
  }, []);

  // Reset simulation / Normal state
  const handleReset = () => {
    setSpeedMultiplier(1);
    setBpm(75);
    setIsPlaying(true);
    setIsCardiacArrest(false);
    setStrainLevel(0);
    if (particlesRef.current) {
      particlesRef.current.forEach((p, idx) => {
        p.t = (idx % 30) / 30;
      });
    }
  };

  // Defibrillation / CPR Revival
  const handleDefibrillate = () => {
    setIsCardiacArrest(false);
    setBpm(75);
    setSpeedMultiplier(1);
    setStrainLevel(0);
    setIsPlaying(true);
  };

  // Toggle speed boost
  const handleCycleSpeed = () => {
    if (isCardiacArrest) return;
    setSpeedMultiplier((prev) => {
      if (prev === 1) return 1.6;
      if (prev === 1.6) return 2.4;
      return 1;
    });
  };

  // Cardiac overload calculation loop
  useEffect(() => {
    if (isCardiacArrest) return;

    const isOverloaded = bpm >= 135 && speedMultiplier >= 2.4;
    const interval = setInterval(() => {
      if (isOverloaded && isPlaying) {
        setStrainLevel((prev) => {
          const next = prev + 3.5;
          if (next >= 100) {
            setIsCardiacArrest(true);
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      } else {
        // Recover gradually if below threshold
        setStrainLevel((prev) => Math.max(0, prev - 2));
      }
    }, 150);

    return () => clearInterval(interval);
  }, [bpm, speedMultiplier, isPlaying, isCardiacArrest]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let beatPhase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Theme colors
      const bg = isDark ? '#0b1120' : '#f8fafc';
      const vesselCo2Color = '#2563eb'; // Blue
      const vesselO2Color = '#dc2626';  // Red
      const heartWallColor = isDark ? '#334155' : '#cbd5e1';
      const heartFillColor = isDark ? '#1e293b' : '#ffffff';
      const textColor = isDark ? '#f1f5f9' : '#0f172a';
      const subTextColor = isDark ? '#94a3b8' : '#64748b';

      // Clear canvas
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Coordinates & MUCH LARGER HEART DIMENSIONS as requested:
      // Width expanded from 190 to 350px, Height expanded from 150 to 220px
      const cx = width / 2;
      const cy = height / 2;
      const heartW = 350;
      const heartH = 220;

      // Heartbeat pulse calculation
      const bps = bpm / 60;
      let pulseScale = 1;

      if (!isCardiacArrest && isPlaying) {
        beatPhase += 0.03 * (bps / 1.25) * speedMultiplier;
        pulseScale = 1 + Math.sin(beatPhase * 4) * 0.024 * (Math.sin(beatPhase * 2) > 0 ? 1 : 0.4);
      } else if (isCardiacArrest) {
        pulseScale = 1; // Flatline, no movement
      }

      const isSystole = !isCardiacArrest && Math.sin(beatPhase * 4) > 0.2;

      /* ==================== 1. DRAW BLOOD VESSEL PATHS & ORGANS (BACKGROUND LAYER) ==================== */
      const lungsY = cy - 250;
      const pulmonaryLoopW = 190;

      const tissuesY = cy + 250;
      const systemicLoopW = 200;

      // Anatomical connection nodes inside the heart chambers:
      // RV: left anatomical side (viewer left), bottom chamber
      const rvX = cx - 85;
      const rvY = cy + 45;
      // LA: right anatomical side (viewer right), top chamber
      const laX = cx + 85;
      const laY = cy - 50;
      // LV: right anatomical side (viewer right), bottom chamber
      const lvX = cx + 85;
      const lvY = cy + 45;
      // RA: left anatomical side (viewer left), top chamber
      const raX = cx - 85;
      const raY = cy - 50;

      const lungsLeftX = cx - pulmonaryLoopW;
      const lungsRightX = cx + pulmonaryLoopW;

      // 1. Pulmonary Artery Outer & Inner Conduit (RV -> Lungs)
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isDark ? '#1e3a8a' : '#bfdbfe';
      ctx.beginPath();
      ctx.moveTo(rvX, rvY - 15);
      ctx.bezierCurveTo(rvX - 70, cy - 140, lungsLeftX, cy - 160, cx - 80, lungsY + 25);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = vesselCo2Color;
      ctx.stroke();

      // 2. Pulmonary Vein Outer & Inner Conduit (Lungs -> LA)
      ctx.lineWidth = 18;
      ctx.strokeStyle = isDark ? '#7f1d1d' : '#fecaca';
      ctx.beginPath();
      ctx.moveTo(cx + 80, lungsY + 25);
      ctx.bezierCurveTo(lungsRightX, cy - 160, laX + 70, cy - 140, laX, laY - 15);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = vesselO2Color;
      ctx.stroke();

      // 3. Systemic Arteries Outer & Inner Conduit (LV -> Tissues)
      ctx.lineWidth = 18;
      ctx.strokeStyle = isDark ? '#7f1d1d' : '#fecaca';
      ctx.beginPath();
      ctx.moveTo(lvX, lvY + 15);
      ctx.bezierCurveTo(lvX + 70, cy + 140, cx + systemicLoopW, cy + 160, cx + 80, tissuesY - 25);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = vesselO2Color;
      ctx.stroke();

      // 4. Systemic Veins Outer & Inner Conduit (Tissues -> RA)
      ctx.lineWidth = 18;
      ctx.strokeStyle = isDark ? '#1e3a8a' : '#bfdbfe';
      ctx.beginPath();
      ctx.moveTo(cx - 80, tissuesY - 25);
      ctx.bezierCurveTo(cx - systemicLoopW, cy + 160, raX - 70, cy + 140, raX, raY + 15);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = vesselCo2Color;
      ctx.stroke();

      // Top Lungs Organ Node
      ctx.save();
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = isDark ? '#3b82f6' : '#60a5fa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - 145, lungsY - 32, 290, 64, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PARU-PARU (PULMO)', cx, lungsY - 6);
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = subTextColor;
      ctx.fillText('Pertukaran Gas Alveolus: Lepas CO₂ ➔ Ikat O₂', cx, lungsY + 14);
      ctx.restore();

      // Bottom Body Tissues Organ Node
      ctx.save();
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = isDark ? '#ef4444' : '#f87171';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - 155, tissuesY - 32, 310, 64, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('JARINGAN TUBUH (SISTEMIK)', cx, tissuesY - 6);
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = subTextColor;
      ctx.fillText('Respirasi Seluler: Lepas O₂ ➔ Serap CO₂ Metabolisme', cx, tissuesY + 14);
      ctx.restore();

      /* ==================== 2. DRAW PARTICLES BENEATH THE HEART ==================== */
      // Requirement: "the gas particles shouldn toverlap over the heart but rather go through the heart so the particles go beneath the heart."
      // By drawing the particles HERE, before drawing the heart body and words, the particles naturally go into and BENEATH the heart structure!
      const particles = particlesRef.current;

      const getPulmonaryPoint = (t: number) => {
        if (t < 0.5) {
          const subT = t * 2;
          const p0 = { x: rvX, y: rvY - 15 };
          const p1 = { x: rvX - 70, y: cy - 140 };
          const p2 = { x: lungsLeftX, y: cy - 160 };
          const p3 = { x: cx - 80, y: lungsY + 25 };
          const u = 1 - subT;
          const x = u*u*u*p0.x + 3*u*u*subT*p1.x + 3*u*subT*subT*p2.x + subT*subT*subT*p3.x;
          const y = u*u*u*p0.y + 3*u*u*subT*p1.y + 3*u*subT*subT*p2.y + subT*subT*subT*p3.y;
          return { x, y, type: 'co2' as const };
        } else {
          const subT = (t - 0.5) * 2;
          const p0 = { x: cx + 80, y: lungsY + 25 };
          const p1 = { x: lungsRightX, y: cy - 160 };
          const p2 = { x: laX + 70, y: cy - 140 };
          const p3 = { x: laX, y: laY - 15 };
          const u = 1 - subT;
          const x = u*u*u*p0.x + 3*u*u*subT*p1.x + 3*u*subT*subT*p2.x + subT*subT*subT*p3.x;
          const y = u*u*u*p0.y + 3*u*u*subT*p1.y + 3*u*subT*subT*p2.y + subT*subT*subT*p3.y;
          return { x, y, type: 'o2' as const };
        }
      };

      const getSystemicPoint = (t: number) => {
        if (t < 0.5) {
          const subT = t * 2;
          const p0 = { x: lvX, y: lvY + 15 };
          const p1 = { x: lvX + 70, y: cy + 140 };
          const p2 = { x: cx + systemicLoopW, y: cy + 160 };
          const p3 = { x: cx + 80, tissuesY: tissuesY - 25 };
          const u = 1 - subT;
          const x = u*u*u*p0.x + 3*u*u*subT*p1.x + 3*u*subT*subT*p2.x + subT*subT*subT*p3.x;
          const y = u*u*u*p0.y + 3*u*u*subT*p1.y + 3*u*subT*subT*p2.y + subT*subT*subT*p3.tissuesY;
          return { x, y, type: 'o2' as const };
        } else {
          const subT = (t - 0.5) * 2;
          const p0 = { x: cx - 80, y: tissuesY - 25 };
          const p1 = { x: cx - systemicLoopW, y: cy + 160 };
          const p2 = { x: raX - 70, y: cy + 140 };
          const p3 = { x: raX, y: raY + 15 };
          const u = 1 - subT;
          const x = u*u*u*p0.x + 3*u*u*subT*p1.x + 3*u*subT*subT*p2.x + subT*subT*subT*p3.x;
          const y = u*u*u*p0.y + 3*u*u*subT*p1.y + 3*u*subT*subT*p2.y + subT*subT*subT*p3.y;
          return { x, y, type: 'co2' as const };
        }
      };

      particles.forEach((p) => {
        if (!isCardiacArrest && isPlaying) {
          p.t += p.speed * speedMultiplier * (bpm / 75);
          if (p.t > 1) p.t -= 1;
        }

        const pt = p.circuit === 'pulmonary' ? getPulmonaryPoint(p.t) : getSystemicPoint(p.t);

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
        if (pt.type === 'co2') {
          ctx.fillStyle = '#3b82f6';
          ctx.shadowColor = '#60a5fa';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#f87171';
          ctx.shadowBlur = 6;
        }
        ctx.fill();

        if (p.size > 5) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pt.type === 'co2' ? 'CO₂' : 'O₂', pt.x, pt.y);
        }
        ctx.restore();
      });

      /* ==================== 3. DRAW LARGE HEART JANTUNG (ON TOP OF PARTICLES) ==================== */
      // Requirement: "make the heart jantung a lot bigger so that all the words can it into the heart and the gas particles shouldn toverlap over the heart but rather go through the heart so the particles go beneath the heart."
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulseScale, pulseScale);

      // Heart outer glow & shadow
      if (isCardiacArrest) {
        ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
        ctx.shadowBlur = 24;
      } else {
        ctx.shadowColor = isSystole ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = isSystole ? 22 : 12;
      }

      // Heart outer silhouette (Solid surface so particles flow underneath it!)
      ctx.fillStyle = heartFillColor;
      ctx.strokeStyle = isCardiacArrest ? '#ef4444' : heartWallColor;
      ctx.lineWidth = isCardiacArrest ? 4 : 3;
      ctx.beginPath();
      ctx.roundRect(-heartW / 2, -heartH / 2, heartW, heartH, 28);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4 Internal Chamber Sub-Containers (Distinct background tints)
      // Top Left (Right Atrium - Blue tint)
      ctx.fillStyle = isDark ? 'rgba(30, 58, 138, 0.25)' : 'rgba(239, 246, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(-heartW / 2 + 8, -heartH / 2 + 8, heartW / 2 - 14, heartH / 2 - 14, 18);
      ctx.fill();

      // Bottom Left (Right Ventricle - Blue tint)
      ctx.fillStyle = isDark ? 'rgba(30, 58, 138, 0.35)' : 'rgba(239, 246, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(-heartW / 2 + 8, 6, heartW / 2 - 14, heartH / 2 - 14, 18);
      ctx.fill();

      // Top Right (Left Atrium - Red tint)
      ctx.fillStyle = isDark ? 'rgba(127, 29, 29, 0.25)' : 'rgba(254, 242, 242, 0.9)';
      ctx.beginPath();
      ctx.roundRect(6, -heartH / 2 + 8, heartW / 2 - 14, heartH / 2 - 14, 18);
      ctx.fill();

      // Bottom Right (Left Ventricle - Red tint & Thicker Myocardium)
      ctx.fillStyle = isDark ? 'rgba(127, 29, 29, 0.35)' : 'rgba(254, 242, 242, 0.9)';
      ctx.beginPath();
      ctx.roundRect(6, 6, heartW / 2 - 14, heartH / 2 - 14, 18);
      ctx.fill();

      // Central Vertical Septum (Dinding pemisah jantung kanan dan kiri)
      ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
      ctx.fillRect(-7, -heartH / 2 + 6, 14, heartH - 12);

      // Horizontal AV Sulcus / Atrioventricular Divider
      ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.fillRect(-heartW / 2 + 6, -5, heartW - 12, 10);

      // Thick Left Ventricular Myocardium border (Anatomical right / viewer right)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(6, 6, heartW / 2 - 14, heartH / 2 - 14, 18);
      ctx.stroke();

      // Thinner Right Ventricular Myocardium border (Anatomical left / viewer left)
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-heartW / 2 + 8, 6, heartW / 2 - 14, heartH / 2 - 14, 18);
      ctx.stroke();

      // ==================== CHAMBER TEXTS (SPACIOUS & PERFECTLY FITTING) ====================
      ctx.textAlign = 'center';

      // 1. ATRIUM KANAN (Top Left)
      const raCenterX = -heartW / 4;
      const raCenterY = -heartH / 4 - 8;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#93c5fd' : '#1d4ed8';
      ctx.fillText('ATRIUM KANAN', raCenterX, raCenterY - 14);
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#bfdbfe' : '#2563eb';
      ctx.fillText('Serambi Kanan', raCenterX, raCenterY + 2);
      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText('Darah Kaya CO₂ (Vena Kava)', raCenterX, raCenterY + 18);

      // 2. VENTRIKEL KANAN (Bottom Left)
      const rvCenterX = -heartW / 4;
      const rvCenterY = heartH / 4 + 8;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#60a5fa' : '#2563eb';
      ctx.fillText('VENTRIKEL KANAN', rvCenterX, rvCenterY - 14);
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#93c5fd' : '#1d4ed8';
      ctx.fillText('Bilik Kanan', rvCenterX, rvCenterY + 2);
      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText('Pompa ke Arteri Pulmonalis', rvCenterX, rvCenterY + 18);

      // 3. ATRIUM KIRI (Top Right)
      const laCenterX = heartW / 4;
      const laCenterY = -heartH / 4 - 8;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#fca5a5' : '#b91c1c';
      ctx.fillText('ATRIUM KIRI', laCenterX, laCenterY - 14);
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#f87171' : '#dc2626';
      ctx.fillText('Serambi Kiri', laCenterX, laCenterY + 2);
      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText('Darah Kaya O₂ (Vena Pulmonalis)', laCenterX, laCenterY + 18);

      // 4. VENTRIKEL KIRI (Bottom Right)
      const lvCenterX = heartW / 4;
      const lvCenterY = heartH / 4 + 8;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#f87171' : '#dc2626';
      ctx.fillText('VENTRIKEL KIRI', lvCenterX, lvCenterY - 14);
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#fca5a5' : '#b91c1c';
      ctx.fillText('Bilik Kiri (Otot 3x Lebih Tebal)', lvCenterX, lvCenterY + 2);
      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText('Sistole ±120 mmHg ke Aorta', lvCenterX, lvCenterY + 18);

      // Valves: Katup Trikuspid & Katup Bikuspid
      // Katup Trikuspid (Left AV valve)
      ctx.fillStyle = isSystole ? '#f59e0b' : '#10b981';
      ctx.beginPath();
      ctx.arc(-heartW / 4, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
      ctx.fillText('Katup Trikuspid', -heartW / 4, -9);

      // Katup Bikuspid / Mitral (Right AV valve)
      ctx.fillStyle = isSystole ? '#f59e0b' : '#10b981';
      ctx.beginPath();
      ctx.arc(heartW / 4, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
      ctx.fillText('Katup Bikuspid (Mitral)', heartW / 4, -9);

      // Cardiac Arrest Flatline Indicator inside Heart if active
      if (isCardiacArrest) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillRect(-heartW / 2 + 10, -32, heartW - 20, 64);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('⚠️ HENTI JANTUNG (CARDIAC ARREST)', 0, -8);
        ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Denyut terhenti akibat kelelahan takikardia ekstrem!', 0, 12);
      }

      ctx.restore();

      /* ==================== 4. STACKED VESSEL LABELS (OUTSIDE THE CURVES) ==================== */
      ctx.save();
      ctx.textAlign = 'center';

      // 1. Pulmonary Artery (Upper Left, outside the curve)
      const paX = cx - 250;
      const paY = cy - 145;
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(paX - 70, paY - 26, 140, 52, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('Pulmonary', paX, paY - 6);
      ctx.fillText('Artery', paX, paY + 12);

      // 2. Pulmonary Vein (Upper Right, outside the curve)
      const pvX = cx + 250;
      const pvY = cy - 145;
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(pvX - 70, pvY - 26, 140, 52, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('Pulmonary', pvX, pvY - 6);
      ctx.fillText('Vein', pvX, pvY + 12);

      // 3. Systemic Veins (Lower Left, outside the curve)
      const svX = cx - 250;
      const svY = cy + 145;
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(svX - 70, svY - 26, 140, 52, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('Systemic', svX, svY - 6);
      ctx.fillText('Veins', svX, svY + 12);

      // 4. Systemic Arteries (Lower Right, outside the curve)
      const saX = cx + 250;
      const saY = cy + 145;
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(saX - 70, saY - 26, 140, 52, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('Systemic', saX, saY - 6);
      ctx.fillText('Arteries', saX, saY + 12);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [bpm, isDark, isPlaying, speedMultiplier, isCardiacArrest]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Interactive Canvas Box */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col items-center overflow-hidden">
        <div className="w-full flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
              <i className="fa-solid fa-route text-xs"></i>
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Diagram Dinamis Peredaran Darah Ganda
                {isCardiacArrest && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                    CARDIAC ARREST
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sirkulasi Pulmonalis (Atas) &amp; Sirkulasi Sistemik (Bawah) · Jantung Diperbesar &amp; Aliran Tembus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Kaya CO₂ (Deoksigenasi)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Kaya O₂ (Teroksigenasi)</span>
            </div>
          </div>
        </div>

        {/* Canvas Element with Responsive Wrapper */}
        <div className="w-full relative flex justify-center bg-slate-50 dark:bg-slate-950/70 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
          <canvas
            ref={canvasRef}
            width={820}
            height={680}
            className="w-full max-w-[820px] h-auto block select-none"
          />

          {/* Cardiac Arrest Alert Box Overlay */}
          {isCardiacArrest && (
            <div className="absolute inset-x-4 top-4 p-4 rounded-xl bg-red-950/90 text-white border border-red-500 backdrop-blur-sm shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-bounce">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                  <i className="fa-solid fa-heart-crack text-xl"></i>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-red-200">
                    Jantung Mengalami Henti Jantung (Cardiac Arrest)!
                  </h4>
                  <p className="text-xs text-red-300">
                    Beban takikardia ekstrem ({bpm} BPM &amp; {speedMultiplier}x Boost) melampaui ambang batas fisiologis miokardium.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDefibrillate}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>Defibrilasi / CPR (Pulihkan)</span>
              </button>
            </div>
          )}
        </div>

        <div className="w-full pt-3 mt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span>* Catatan: Partikel gas mengalir menembus ke dalam jantung (di bawah teks &amp; sekat) tanpa menutupi kata.</span>
          <span className="font-mono tabular-nums">
            Status: {isCardiacArrest ? 'Henti Denyut' : isPlaying ? 'Memompa Normal' : 'Dijeda'} · Detak: {bpm} BPM
          </span>
        </div>
      </div>

      {/* Side Control Deck & Overload Fatigue Meter */}
      <div className="lg:col-span-4 space-y-4">
        {/* Playback & Dynamics Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-sliders text-rose-500"></i>
              Panel Kontrol Sirkulasi
            </h3>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isCardiacArrest
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : isPlaying
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {isCardiacArrest ? 'Asistol (Henti)' : isPlaying ? 'Aktif Mengalir' : 'Dijeda'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                if (isCardiacArrest) return;
                setIsPlaying(!isPlaying);
              }}
              disabled={isCardiacArrest}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                isCardiacArrest
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              <span>{isPlaying ? 'Jeda' : 'Lanjutkan'}</span>
            </button>

            <button
              onClick={handleCycleSpeed}
              disabled={isCardiacArrest}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 shadow-sm transition-all ${
                isCardiacArrest
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : speedMultiplier === 2.4
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <i className="fa-solid fa-bolt"></i>
              <span>Boost ({speedMultiplier}x)</span>
            </button>

            <button
              onClick={isCardiacArrest ? handleDefibrillate : handleReset}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center gap-1 transition-all"
            >
              <i className={`fa-solid ${isCardiacArrest ? 'fa-heart-circle-bolt text-emerald-500' : 'fa-arrow-rotate-left'}`}></i>
              <span>{isCardiacArrest ? 'Defibrilasi' : 'Reset'}</span>
            </button>
          </div>

          {/* Heart Rate Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Frekuensi Denyut Jantung</span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  bpm >= 135
                    ? 'text-red-600 dark:text-red-400 animate-pulse'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {bpm} BPM {bpm >= 135 && '(Takikardia!)'}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={160}
              value={bpm}
              disabled={isCardiacArrest}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>50 (Istirahat)</span>
              <span>75 (Normal)</span>
              <span className="text-red-500 font-semibold">160 (Bahaya)</span>
            </div>
          </div>

          {/* Cardiac Strain & Fatigue Meter (Kelelahan Beban Kerja Miokardium) */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <i className={`fa-solid ${strainLevel > 60 ? 'fa-triangle-exclamation text-amber-500' : 'fa-heart text-rose-500'}`}></i>
                Beban Kerja Miokardium
              </span>
              <span
                className={`font-mono font-bold tabular-nums text-xs ${
                  strainLevel > 70
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {Math.round(strainLevel)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  strainLevel >= 80
                    ? 'bg-red-600'
                    : strainLevel >= 40
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${strainLevel}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {isCardiacArrest
                ? 'Jantung terhenti (henti jantung)! Klik tombol "Defibrilasi / CPR" untuk meresusitasi.'
                : strainLevel > 50
                ? 'Peringatan: Jika detak jantung terlalu tinggi (>135 BPM) dan aliran boost terlalu cepat (2.4x), jantung akan mengalami henti denyut!'
                : 'Beban kerja fisiologis masih dalam batas toleransi normal tubuh.'}
            </p>
          </div>
        </div>

        {/* Partial Gas Pressures Deck */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-gauge-high text-sky-500"></i>
              Tekanan Parsial Gas Darah (mmHg)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fisiologi Difusi Gas Alveolus &amp; Jaringan Tubuh
            </p>
          </div>

          <div className="space-y-3">
            {/* Oxygenated Segment */}
            <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60">
              <div className="flex items-center justify-between text-xs font-bold text-red-700 dark:text-red-300">
                <span>Darah Kaya O₂ (Arteri Sistemik &amp; Vena Pulmonalis)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-mono">
                  Teroksigenasi
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-red-200/60 dark:border-red-900/40 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Tekanan Parsial O₂</div>
                  <div className="font-mono font-bold text-red-600 dark:text-red-400 text-sm tabular-nums">
                    pO₂ ≈ 100 mmHg
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Tekanan Parsial CO₂</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm tabular-nums">
                    pCO₂ ≈ 40 mmHg
                  </div>
                </div>
              </div>
            </div>

            {/* Deoxygenated Segment */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
              <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                <span>Darah Kaya CO₂ (Vena Sistemik &amp; Arteri Pulmonalis)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-mono">
                  Deoksigenasi
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-blue-200/60 dark:border-blue-900/40 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Tekanan Parsial O₂</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm tabular-nums">
                    pO₂ ≈ 40 mmHg
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Tekanan Parsial CO₂</div>
                  <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm tabular-nums">
                    pCO₂ ≈ 46 mmHg
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <i className="fa-solid fa-arrows-spin text-emerald-500"></i>
                Hukum Difusi Fisiologis (Erlangga Hlm. 167)
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                Gas berdifusi menuruni gradien tekanan parsial dari area bertekanan tinggi ke rendah.
                Di alveolus paru (pO₂ 104 mmHg), gas O₂ berdifusi masuk ke hemoglobin eritrosit.
                Di jaringan tubuh (pCO₂ sel &gt; 45 mmHg), gas CO₂ berdifusi masuk ke dalam aliran darah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
