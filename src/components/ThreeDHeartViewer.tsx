import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HeartPart } from '../types/cardiology';

interface ThreeDHeartViewerProps {
  isDark: boolean;
  onSelectPartById?: (partId: string) => void;
  selectedPartId?: string;
}

interface HotspotPin {
  id: string;
  name: string;
  position: THREE.Vector3;
  screenPos: { x: number; y: number; visible: boolean };
}

export const ThreeDHeartViewer: React.FC<ThreeDHeartViewerProps> = ({
  isDark,
  onSelectPartById,
  selectedPartId
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Viewer options
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isBeating, setIsBeating] = useState<boolean>(true);
  const [isXRay, setIsXRay] = useState<boolean>(false);
  const [activePin, setActivePin] = useState<string | null>(selectedPartId || null);

  // 3D Pins screen projections
  const [pins, setPins] = useState<HotspotPin[]>([
    {
      id: 'aorta',
      name: 'Aorta',
      position: new THREE.Vector3(0.1, 1.85, 0.15),
      screenPos: { x: 0, y: 0, visible: false }
    },
    {
      id: 'arteri_pulmonalis',
      name: 'Arteri Pulmonalis',
      position: new THREE.Vector3(-0.45, 1.35, 0.45),
      screenPos: { x: 0, y: 0, visible: false }
    },
    {
      id: 'vena_cava',
      name: 'Vena Kava',
      position: new THREE.Vector3(-1.15, 1.45, -0.2),
      screenPos: { x: 0, y: 0, visible: false }
    },
    {
      id: 'atrium_dexter',
      name: 'Atrium Kanan',
      position: new THREE.Vector3(-0.95, 0.6, 0.45),
      screenPos: { x: 0, y: 0, visible: false }
    },
    {
      id: 'atrium_sinister',
      name: 'Atrium Kiri',
      position: new THREE.Vector3(0.95, 0.7, -0.3),
      screenPos: { x: 0, y: 0, visible: false }
    },
    {
      id: 'ventrikel_dexter',
      name: 'Ventrikel Kanan',
      position: new THREE.Vector3(-0.55, -0.4, 0.65),
      screenPos: { x: 0, y: 0, visible: false }
    },
    {
      id: 'ventrikel_sinister',
      name: 'Ventrikel Kiri (Apeks)',
      position: new THREE.Vector3(0.65, -0.7, 0.45),
      screenPos: { x: 0, y: 0, visible: false }
    }
  ]);

  // Sync selectedPartId with activePin
  useEffect(() => {
    if (selectedPartId) {
      setActivePin(selectedPartId);
    }
  }, [selectedPartId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0xffffff : 0xf1f5f9,
      isDark ? 1.4 : 1.6
    );
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 1.2);
    dirLight2.position.set(-6, -2, -4);
    scene.add(dirLight2);

    const redRimLight = new THREE.DirectionalLight(0xf87171, 1.0);
    redRimLight.position.set(4, -4, 3);
    scene.add(redRimLight);

    // ==================== 3D HEART GEOMETRIES & MESHES ====================
    const heartGroup = new THREE.Group();
    heartGroupRef.current = heartGroup;

    // Materials
    const muscleMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Deep cardiac red
      roughness: 0.38,
      metalness: 0.15,
      wireframe: isXRay,
      transparent: isXRay,
      opacity: isXRay ? 0.35 : 1.0
    });

    const leftVentricleMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Crimson Left Ventricle (Thick myocardium)
      roughness: 0.32,
      metalness: 0.18,
      wireframe: isXRay,
      transparent: isXRay,
      opacity: isXRay ? 0.45 : 1.0
    });

    const rightVentricleMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.42,
      metalness: 0.1,
      wireframe: isXRay,
      transparent: isXRay,
      opacity: isXRay ? 0.35 : 1.0
    });

    const aortaMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Bright scarlet aorta
      roughness: 0.28,
      metalness: 0.25,
      wireframe: isXRay
    });

    const pulmonaryMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Royal blue pulmonary artery
      roughness: 0.3,
      metalness: 0.25,
      wireframe: isXRay
    });

    const venaCavaMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Deep blue vena cava
      roughness: 0.35,
      metalness: 0.2,
      wireframe: isXRay
    });

    const pulmonaryVeinMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red pulmonary veins
      roughness: 0.35,
      metalness: 0.2,
      wireframe: isXRay
    });

    const coronaryMat = new THREE.MeshStandardMaterial({
      color: 0xfca5a5,
      roughness: 0.2,
      metalness: 0.4
    });

    // 1. LEFT VENTRICLE & APEX (Thick cone pointing slightly forward-left-down)
    const lvGeo = new THREE.ConeGeometry(0.9, 1.8, 32);
    lvGeo.rotateZ(0.25);
    lvGeo.rotateX(-0.1);
    const lvMesh = new THREE.Mesh(lvGeo, leftVentricleMat);
    lvMesh.position.set(0.35, -0.6, 0.15);
    lvMesh.scale.set(1.1, 1.25, 0.95);
    heartGroup.add(lvMesh);

    // 2. RIGHT VENTRICLE (Anterior/right crescent form)
    const rvGeo = new THREE.SphereGeometry(0.85, 32, 24);
    const rvMesh = new THREE.Mesh(rvGeo, rightVentricleMat);
    rvMesh.position.set(-0.55, -0.35, 0.25);
    rvMesh.scale.set(0.85, 1.15, 0.9);
    heartGroup.add(rvMesh);

    // 3. RIGHT ATRIUM & AURICLE (Superior-posterior right)
    const raGeo = new THREE.SphereGeometry(0.65, 32, 24);
    const raMesh = new THREE.Mesh(raGeo, muscleMat);
    raMesh.position.set(-0.85, 0.55, 0.1);
    raMesh.scale.set(1.0, 1.05, 0.9);
    heartGroup.add(raMesh);

    // 4. LEFT ATRIUM & AURICLE (Superior-posterior left)
    const laGeo = new THREE.SphereGeometry(0.65, 32, 24);
    const laMesh = new THREE.Mesh(laGeo, muscleMat);
    laMesh.position.set(0.65, 0.65, -0.15);
    laMesh.scale.set(1.0, 0.95, 0.9);
    heartGroup.add(laMesh);

    // 5. AORTA (Ascending aorta curving into the aortic arch)
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.35, 0.05),
      new THREE.Vector3(0.08, 1.1, 0.15),
      new THREE.Vector3(-0.05, 1.65, 0.1),
      new THREE.Vector3(0.2, 1.85, -0.05),
      new THREE.Vector3(0.55, 1.7, -0.25),
      new THREE.Vector3(0.65, 0.7, -0.35)
    ]);
    const aortaTubeGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.28, 20, false);
    const aortaMesh = new THREE.Mesh(aortaTubeGeo, aortaMat);
    heartGroup.add(aortaMesh);

    // 3 Branches of Aortic Arch (Brachiocephalic, Common Carotid, Subclavian)
    const branch1Geo = new THREE.CylinderGeometry(0.065, 0.075, 0.45, 16);
    const branch1 = new THREE.Mesh(branch1Geo, aortaMat);
    branch1.position.set(0.02, 1.95, 0.05);
    branch1.rotation.z = -0.15;
    heartGroup.add(branch1);

    const branch2 = new THREE.Mesh(branch1Geo, aortaMat);
    branch2.position.set(0.2, 1.98, -0.05);
    branch2.rotation.z = -0.05;
    heartGroup.add(branch2);

    const branch3 = new THREE.Mesh(branch1Geo, aortaMat);
    branch3.position.set(0.38, 1.92, -0.18);
    branch3.rotation.z = 0.15;
    heartGroup.add(branch3);

    // 6. PULMONARY TRUNK & ARTERY BRANCHES
    const pulmonaryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0.3, 0.35),
      new THREE.Vector3(-0.25, 0.95, 0.38),
      new THREE.Vector3(-0.2, 1.35, 0.3)
    ]);
    const pulmonaryTubeGeo = new THREE.TubeGeometry(pulmonaryCurve, 24, 0.25, 20, false);
    const pulmonaryMesh = new THREE.Mesh(pulmonaryTubeGeo, pulmonaryMat);
    heartGroup.add(pulmonaryMesh);

    // Left and Right Pulmonary Artery branches (bifurcation)
    const paLeftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 1.35, 0.3),
      new THREE.Vector3(0.5, 1.3, -0.2)
    ]);
    const paLeftMesh = new THREE.Mesh(
      new THREE.TubeGeometry(paLeftCurve, 16, 0.16, 16, false),
      pulmonaryMat
    );
    heartGroup.add(paLeftMesh);

    const paRightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 1.35, 0.3),
      new THREE.Vector3(-0.85, 1.25, -0.1)
    ]);
    const paRightMesh = new THREE.Mesh(
      new THREE.TubeGeometry(paRightCurve, 16, 0.16, 16, false),
      pulmonaryMat
    );
    heartGroup.add(paRightMesh);

    // 7. SUPERIOR & INFERIOR VENA CAVA (SVC & IVC)
    // Superior Vena Cava
    const svcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, 0.8, 0.0),
      new THREE.Vector3(-1.0, 1.6, -0.05)
    ]);
    const svcMesh = new THREE.Mesh(
      new THREE.TubeGeometry(svcCurve, 16, 0.22, 18, false),
      venaCavaMat
    );
    heartGroup.add(svcMesh);

    // Inferior Vena Cava
    const ivcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.85, -0.1, -0.15),
      new THREE.Vector3(-0.9, -0.9, -0.2)
    ]);
    const ivcMesh = new THREE.Mesh(
      new THREE.TubeGeometry(ivcCurve, 16, 0.22, 18, false),
      venaCavaMat
    );
    heartGroup.add(ivcMesh);

    // 8. PULMONARY VEINS (Entering Left Atrium)
    const pv1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.8, 0.75, -0.25),
      new THREE.Vector3(1.3, 0.85, -0.45)
    ]);
    const pv1Mesh = new THREE.Mesh(
      new THREE.TubeGeometry(pv1Curve, 12, 0.12, 14, false),
      pulmonaryVeinMat
    );
    heartGroup.add(pv1Mesh);

    const pv2Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.8, 0.5, -0.3),
      new THREE.Vector3(1.3, 0.55, -0.5)
    ]);
    const pv2Mesh = new THREE.Mesh(
      new THREE.TubeGeometry(pv2Curve, 12, 0.12, 14, false),
      pulmonaryVeinMat
    );
    heartGroup.add(pv2Mesh);

    // 9. CORONARY SULCUS ARTERIES (Anterior Interventricular Artery line)
    const coronaryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.5, 0.65),
      new THREE.Vector3(0.05, 0.0, 0.75),
      new THREE.Vector3(0.25, -0.6, 0.65),
      new THREE.Vector3(0.4, -1.2, 0.35)
    ]);
    const coronaryMesh = new THREE.Mesh(
      new THREE.TubeGeometry(coronaryCurve, 24, 0.04, 10, false),
      coronaryMat
    );
    heartGroup.add(coronaryMesh);

    // Center and angle heart nicely (Anterior-oblique view standard)
    heartGroup.position.set(0, -0.2, 0);
    heartGroup.rotation.y = 0.25;
    heartGroup.rotation.x = 0.1;
    scene.add(heartGroup);

    // Orbit Drag Controls (Pure Vanilla pointer drag without external scripts)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !heartGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      heartGroupRef.current.rotation.y += deltaX * 0.008;
      heartGroupRef.current.rotation.x += deltaY * 0.008;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = THREE.MathUtils.clamp(
        cameraRef.current.position.z + e.deltaY * 0.004,
        3.2,
        8.0
      );
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // Animation & Beat Loop
    let beatTime = 0;

    const animate = () => {
      if (heartGroupRef.current) {
        if (isAutoRotating && !isDragging) {
          heartGroupRef.current.rotation.y += 0.004;
        }

        if (isBeating) {
          beatTime += 0.055;
          // Dual pulsation (Atrial kick + Ventricular systole)
          const beatScale =
            1.0 +
            Math.sin(beatTime * 3) * 0.035 * (Math.sin(beatTime * 1.5) > 0 ? 1 : 0.35);
          heartGroupRef.current.scale.set(beatScale, beatScale * 0.98, beatScale);
        } else {
          heartGroupRef.current.scale.set(1, 1, 1);
        }

        // Project 3D Hotspot pins to 2D screen coordinates
        if (cameraRef.current) {
          const tempV = new THREE.Vector3();
          setPins((prevPins) =>
            prevPins.map((pin) => {
              tempV.copy(pin.position);
              // Apply heart rotation & position
              tempV.applyEuler(heartGroupRef.current!.rotation);
              tempV.add(heartGroupRef.current!.position);

              // Check if facing camera
              const isFront = tempV.z > -0.8;

              tempV.project(cameraRef.current!);
              const x = ((tempV.x + 1) * width) / 2;
              const y = ((-tempV.y + 1) * height) / 2;

              return {
                ...pin,
                screenPos: {
                  x,
                  y,
                  visible: isFront && x >= 10 && x <= width - 10 && y >= 10 && y <= height - 10
                }
              };
            })
          );
        }
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isDark, isAutoRotating, isBeating, isXRay]);

  // Reset view position
  const handleResetCamera = (view: 'anterior' | 'posterior' | 'top') => {
    if (!heartGroupRef.current || !cameraRef.current) return;
    cameraRef.current.position.set(0, 0.5, 5.5);
    if (view === 'anterior') {
      heartGroupRef.current.rotation.set(0.1, 0.25, 0);
    } else if (view === 'posterior') {
      heartGroupRef.current.rotation.set(0.1, Math.PI + 0.25, 0);
    } else if (view === 'top') {
      heartGroupRef.current.rotation.set(Math.PI / 2 - 0.2, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[460px] md:h-[500px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Hotspot Pins */}
      {pins.map((pin) => {
        if (!pin.screenPos.visible) return null;
        const isSelected = activePin === pin.id;

        return (
          <button
            key={pin.id}
            onClick={() => {
              setActivePin(pin.id);
              if (onSelectPartById) onSelectPartById(pin.id);
            }}
            style={{
              left: `${pin.screenPos.x}px`,
              top: `${pin.screenPos.y}px`
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2 py-1 rounded-md text-[10px] font-bold tracking-tight shadow-lg transition-transform hover:scale-110 flex items-center gap-1 backdrop-blur-md ${
              isSelected
                ? 'bg-rose-600 text-white ring-2 ring-white scale-110'
                : 'bg-slate-900/80 text-slate-200 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                pin.id === 'arteri_pulmonalis' || pin.id === 'vena_cava' || pin.id.includes('dexter')
                  ? 'bg-blue-400'
                  : 'bg-red-400'
              }`}
            />
            <span>{pin.name}</span>
          </button>
        );
      })}

      {/* Viewer Overlay Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title="Putar Otomatis"
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
            isAutoRotating ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-arrows-rotate text-[11px]"></i>
          <span className="hidden sm:inline">Rotasi</span>
        </button>

        <button
          onClick={() => setIsBeating(!isBeating)}
          title="Denyut Jantung"
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
            isBeating ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-heart-pulse text-[11px]"></i>
          <span className="hidden sm:inline">Denyut</span>
        </button>

        <button
          onClick={() => setIsXRay(!isXRay)}
          title="Mode Transparan / X-Ray"
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
            isXRay ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-eye text-[11px]"></i>
          <span className="hidden sm:inline">X-Ray</span>
        </button>
      </div>

      {/* Preset View Angles (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 text-[11px]">
        <span className="text-slate-400 px-1 font-mono text-[10px]">Sudut:</span>
        <button
          onClick={() => handleResetCamera('anterior')}
          className="px-2 py-1 rounded-md text-slate-200 hover:bg-slate-800 font-medium transition-colors"
        >
          Depan (Anterior)
        </button>
        <button
          onClick={() => handleResetCamera('posterior')}
          className="px-2 py-1 rounded-md text-slate-200 hover:bg-slate-800 font-medium transition-colors"
        >
          Belakang (Posterior)
        </button>
        <button
          onClick={() => handleResetCamera('top')}
          className="px-2 py-1 rounded-md text-slate-200 hover:bg-slate-800 font-medium transition-colors"
        >
          Atas (Arkus Aorta)
        </button>
      </div>

      {/* Instruction Badge (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 hidden md:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
        <i className="fa-solid fa-hand-pointer text-rose-500"></i>
        <span>Geser mouse untuk putar 360° · Scroll untuk zoom · Klik pin nama untuk buka deskripsi</span>
      </div>
    </div>
  );
};
