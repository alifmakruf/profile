import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Trail } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/woodensword.glb";

// Nuansa warna emas untuk pencahayaan & pendaran obor
const GOLD_LIGHT = "#ffb703"; // Cahaya emas hangat utama
const GOLD_BLADE_EMISSIVE = "#f59e0b"; // Pendaran inti emas bilah
const GOLD_ACCENT = "#fbbf24"; // Emas terang aksen

// Palet spektral bayangan Terraprisma bernuansa emas (Golden Terraprisma Prism)
const PRISM_GOLD_COLORS = [
  "#ffd700", // Emas murni berkilau (Pure Gold)
  "#fbbf24", // Emas hangat amber (Warm Amber)
  "#fde047", // Emas cerah menyilaukan (Radiant Yellow Gold)
  "#f59e0b", // Emas tembaga (Deep Amber Gold)
  "#fef08a", // Emas sampanye terang (Light Champagne)
  "#d97706", // Emas senja kaya (Dusk Gold)
];

const TARGET_PIXEL_SIZE = 75; // Ukuran target tampilan pedang dalam piksel (px)
const IDLE_DELAY = 0.5; // Waktu jeda (detik) sebelum pedang mulai berputar saat diam
const IDLE_MOVE_PX = 3; // Ambang batas gerakan kursor (px) yang dihitung sebagai diam
const ORBIT_RADIUS_PX = 45; // Radius putaran orbit pedang mengelilingi kursor (px)
const ORBIT_SPEED = 2.4; // Kecepatan putaran orbit (rad/s)

// Nama yang ditampilkan sebagai jejak huruf bayangan saat pedang bergerak
const NAME_LETTERS = "FIRMANALIF".split("");
const GHOST_COUNT = NAME_LETTERS.length; // Jumlah huruf = jumlah bayangan
const HISTORY_LENGTH = 60; // Panjang buffer riwayat pose (lebih besar dari GHOST_COUNT * GHOST_STEP)
const GHOST_STEP = 5; // Jarak antar huruf di dalam buffer riwayat — makin besar, makin lebar jeda antar huruf
const GHOST_LETTER_SIZE_PX = 16; // Ukuran tampilan tiap huruf bayangan dalam piksel (px)

// Peta gradien 4-tahap untuk pewarnaan cel-shaded kayu bernuansa hangat
function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([50, 40, 30, 255, 120, 95, 70, 255, 190, 150, 110, 255, 255, 225, 180, 255]);
    const tex = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    return tex;
  }, []);
}

// Membuat tekstur huruf tunggal lewat Canvas2D (ringan, tanpa fetch font eksternal/network)
function useLetterTexture(letter, color) {
  return useMemo(() => {
    const canvasSize = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.font = "bold 92px sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, canvasSize / 2, canvasSize / 2 + 6);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [letter, color]);
}

// Komponen huruf bayangan tunggal — dipakai sebagai sprite ringan pengganti drei <Text>
function GhostLetter({ letter, color, opacity, letterRef, sizeWorld }) {
  const texture = useLetterTexture(letter, color);

  return (
    <sprite ref={letterRef} scale={[sizeWorld, sizeWorld, sizeWorld]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

export default function Sword({ torchRef, pointerRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const gradientMap = useToonGradient();
  const { viewport, size, gl } = useThree();

  const pivot = useRef(null);
  const aim = useRef(null);
  const blade = useRef(null);
  const tip = useRef(null);
  const glow = useRef(null);
  const ghostsGroup = useRef(null);

  const unitsPerPixel = viewport.width / size.width;

  // Jaga-jaga: log & cegah default behavior jika WebGL context hilang, supaya lebih mudah didiagnosis
  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn("[Sword] WebGL context lost terdeteksi.");
    };
    const handleContextRestored = () => {
      console.warn("[Sword] WebGL context restored.");
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl]);

  // Ukur dimensi model asli dan pusatkan di titik tengah (0,0,0)
  const { model, modelLength, centerOffset } = useMemo(() => {
    const cloned = scene.clone(true);

    const meshes = [];
    cloned.traverse((child) => {
      if (child.isMesh) meshes.push(child);
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);

    const length = Math.max(sizeVec.x, sizeVec.y, sizeVec.z, 0.001);

    meshes.forEach((child) => {
      const isBilah = child.name.toLowerCase().includes("bilah") || child.parent?.name.toLowerCase().includes("bilah");

      if (isBilah) {
        // Bilah menyala emas terang dan jelas di latar belakang gelap
        const bladeMat = new THREE.MeshStandardMaterial({
          color: "#fffdf0",
          emissive: new THREE.Color(GOLD_BLADE_EMISSIVE),
          emissiveIntensity: 0.65,
          roughness: 0.35,
          metalness: 0.4,
          toneMapped: false,
        });
        child.material = bladeMat;

        // Garis tepi luar pendaran emas tipis (Subtle golden aura outline)
        const outlineMat = new THREE.MeshBasicMaterial({
          color: GOLD_ACCENT,
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.08,
        });
        const outline = new THREE.Mesh(child.geometry, outlineMat);
        outline.scale.multiplyScalar(1.04);
        child.add(outline);
      } else {
        // Gagang & Pembatas: material kayu cel-shaded beraksen emas hangat lembut
        const toon = new THREE.MeshToonMaterial({
          color: new THREE.Color("#3d2210"),
          gradientMap,
          emissive: new THREE.Color(GOLD_LIGHT),
          emissiveIntensity: 0.05,
        });
        child.material = toon;

        const outlineMat = new THREE.MeshBasicMaterial({
          color: "#180c05",
          side: THREE.BackSide,
        });
        const outline = new THREE.Mesh(child.geometry, outlineMat);
        outline.scale.multiplyScalar(1.03);
        child.add(outline);
      }
      child.castShadow = false;
      child.receiveShadow = false;
    });

    // Pusatkan model ke (0,0,0) agar rotasi dan arah seimbang
    cloned.position.set(-center.x, -center.y, -center.z);

    return {
      model: cloned,
      modelLength: length,
      centerOffset: center,
    };
  }, [scene, gradientMap]);

  // Skala pedang agar pas dengan target ukuran piksel di layar
  const scaleFactor = useMemo(() => {
    const desiredWorldLength = TARGET_PIXEL_SIZE * unitsPerPixel;
    return desiredWorldLength / modelLength;
  }, [modelLength, unitsPerPixel]);

  const tipDistance = (modelLength * 0.52) * scaleFactor;
  // Lebar jejak trail diperkecil agar lebih ramping dan rapi
  const trailWidth = (modelLength * 0.25) * scaleFactor;

  // Ukuran dunia (world units) tiap huruf bayangan, mengikuti skala piksel layar
  const letterSizeWorld = GHOST_LETTER_SIZE_PX * unitsPerPixel;

  // Opacity tiap huruf menurun bertahap semakin jauh dari pedang (efek jejak alami)
  const letterOpacities = useMemo(() => {
    return NAME_LETTERS.map((_, i) => Math.pow(1 - (i + 1) / (GHOST_COUNT + 1), 0.7) * 0.85);
  }, []);

  // State pergerakan & fisika
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const lastCursor = useRef(new THREE.Vector3(0, 0, 0));
  const idleTimer = useRef(0);
  const isIdle = useRef(false);
  const orbitAngle = useRef(0);

  const aimAngle = useRef(0);
  const aimAngleVel = useRef(0);
  const t = useRef(0);

  // Buffer riwayat pose untuk jejak huruf-huruf bayangan
  const poseHistory = useRef(
    Array.from({ length: HISTORY_LENGTH }).map(() => ({
      x: 0,
      y: 0,
      rotZ: 0,
    }))
  );
  const ghostRefs = useRef([]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    t.current += dt;

    // Posisi 1:1 mouse di ruang dunia 3D pada bidang z=0
    // (dihitung dari pointerRef manual, bukan state.pointer bawaan Three.js,
    // supaya tetap akurat walau canvas jadi overlay fixed lintas halaman)
    const px = pointerRef?.current?.x ?? 0;
    const py = pointerRef?.current?.y ?? 0;
    const cursorWorld = new THREE.Vector3(
      (px * viewport.width) / 2,
      (py * viewport.height) / 2,
      0
    );

    // Deteksi kursor diam (idle)
    const movedDist = cursorWorld.distanceTo(lastCursor.current);
    const idleMoveThreshold = IDLE_MOVE_PX * unitsPerPixel;
    if (movedDist > idleMoveThreshold) {
      idleTimer.current = 0;
      isIdle.current = false;
    } else {
      idleTimer.current += dt;
      if (idleTimer.current > IDLE_DELAY) {
        isIdle.current = true;
      }
    }
    lastCursor.current.copy(cursorWorld);

    // Target posisi: mengorbit melingkari titik kursor saat idle, atau mengejar kursor saat bergerak
    let target;
    const orbitRadius = ORBIT_RADIUS_PX * unitsPerPixel;

    if (isIdle.current) {
      orbitAngle.current += dt * ORBIT_SPEED;
      target = new THREE.Vector3(
        cursorWorld.x + Math.cos(orbitAngle.current) * orbitRadius,
        cursorWorld.y + Math.sin(orbitAngle.current) * orbitRadius,
        0
      );
    } else {
      target = cursorWorld;
    }

    // Fisika pegas posisi (Spring physics)
    const stiffness = isIdle.current ? 65 : 75;
    const damping = isIdle.current ? 8.5 : 9.5;

    const accel = new THREE.Vector3().subVectors(target, pos.current).multiplyScalar(stiffness);
    accel.addScaledVector(vel.current, -damping);

    vel.current.addScaledVector(accel, dt);
    pos.current.addScaledVector(vel.current, dt);

    if (pivot.current) {
      pivot.current.position.copy(pos.current);
    }

    // Sinkronisasi pendaran latar belakang agar persis mengikuti bilah pedang (bukan kursor)
    // Parameter: viewport (lebar & tinggi area 3D), size (resolusi piksel layar)
    if (torchRef?.current) {
      const screenX = (pos.current.x / (viewport.width / 2)) * (size.width / 2) + size.width / 2;
      const screenY = -(pos.current.y / (viewport.height / 2)) * (size.height / 2) + size.height / 2;
      torchRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
    }

    // Arah orientasi pedang: searah kecepatan saat bergerak, atau tangen lingkaran saat berputar mengelilingi kursor
    let targetAngle;
    if (isIdle.current) {
      targetAngle = orbitAngle.current + Math.PI / 2;
    } else if (vel.current.lengthSq() > 0.0002) {
      targetAngle = Math.atan2(vel.current.y, vel.current.x);
    } else {
      targetAngle = aimAngle.current;
    }

    let diff = targetAngle - aimAngle.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));

    const aStiff = 55;
    const aDamp = 8.0;
    const aAccel = diff * aStiff - aimAngleVel.current * aDamp;
    aimAngleVel.current += aAccel * dt;
    aimAngle.current += aimAngleVel.current * dt;

    if (aim.current) {
      aim.current.rotation.z = aimAngle.current;
    }

    // Animasi dinamis getaran bilah pedang
    let rotX = 0;
    let rotY = 0;
    if (blade.current) {
      const speed = vel.current.length();
      rotX = Math.sin(t.current * 10) * 0.04 * Math.min(speed, 1.5) + (isIdle.current ? 0.08 : 0);
      rotY = Math.sin(t.current * 6) * 0.03;
      blade.current.rotation.x = rotX;
      blade.current.rotation.y = rotY;
    }

    // Efek pendaran obor emas berfluktuasi sangat lembut dan nyaman di mata
    if (glow.current) {
      glow.current.intensity = 0.35 + Math.sin(t.current * 4) * 0.06;
    }

    // Rekam pose saat ini untuk jejak huruf-huruf bayangan
    const curPose = {
      x: pos.current.x,
      y: pos.current.y,
      rotZ: aimAngle.current,
    };

    poseHistory.current.unshift(curPose);
    if (poseHistory.current.length > HISTORY_LENGTH) {
      poseHistory.current.pop();
    }

    // Terapkan pose ke tiap huruf bayangan (sprite) — selalu tampil termasuk saat orbit, mengikuti riwayat posisi pedang
    ghostRefs.current.forEach((gRef, idx) => {
      if (!gRef) return;
      const historyIndex = (idx + 1) * GHOST_STEP;
      const historyItem = poseHistory.current[historyIndex] || curPose;
      gRef.position.set(historyItem.x, historyItem.y, -0.01 * (idx + 1));
      // Sprite selalu menghadap kamera secara otomatis, jadi rotasi tidak perlu diterapkan manual
    });
  });

  return (
    <>
      {/* Jejak Huruf Bayangan Membentuk Nama "FIRMANALIF" — pakai sprite ringan berbasis Canvas2D, bukan drei <Text> */}
      <group ref={ghostsGroup}>
        {NAME_LETTERS.map((letter, idx) => (
          <GhostLetter
            key={idx}
            letter={letter}
            color={PRISM_GOLD_COLORS[idx % PRISM_GOLD_COLORS.length]}
            opacity={letterOpacities[idx]}
            sizeWorld={letterSizeWorld}
            letterRef={(el) => (ghostRefs.current[idx] = el)}
          />
        ))}
      </group>

      {/* Pedang Utama Bernuansa Emas yang Menyala Terang */}
      <group ref={pivot}>
        {/* Lampu titik obor bernuansa emas lembut (radius diperkecil & intensitas tipis) */}
        {/* Parameter: color (warna pendaran emas), intensity (kekuatan cahaya), distance (radius jangkauan), decay (tingkat pelemahan) */}
        <pointLight
          ref={glow}
          color={GOLD_LIGHT}
          intensity={0.6}
          distance={1.8}
          decay={2}
          position={[0, 0, 0.2]}
        />
        {/* Lampu aksen emas sekunder tipis pada ujung bilah */}
        <pointLight
          color={GOLD_ACCENT}
          intensity={0.3}
          distance={0.9}
          decay={2}
          position={[tipDistance * 0.5, 0, 0.1]}
        />

        <group ref={aim}>
          <group ref={blade}>
            <group scale={scaleFactor}>
              <primitive object={model} />
            </group>
          </group>
          {/* Titik jangkar ujung pedang untuk jejak motion trail */}
          <object3D ref={tip} position={[tipDistance, 0, 0]} />
        </group>

        {/* Trail jejak cahaya emas pada bilah pedang */}
        {/* Parameter: target (titik pelacak), width (lebar jejak), length (panjang bingkai jejak), decay (kecepatan memudar) */}
        <Trail
          target={tip}
          width={trailWidth}
          length={8}
          decay={1.2}
          color={GOLD_ACCENT}
          attenuation={(w) => Math.pow(w, 1.6)}
        />
      </group>
    </>
  );
}

useGLTF.preload(MODEL_URL);