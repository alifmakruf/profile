import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Trail } from "@react-three/drei";
import * as THREE from "three";

// URL file model 3D pedang kayu
const MODEL_URL = "/models/woodensword.glb";

// Parameter Konfigurasi Pedang Jatuh 3D:
// - TARGET_PIXEL_SIZE (number): Ukuran target tampilan pedang jatuh di layar (100px sesuai aturan user rule 2)
// - METEOR_COUNT (number): Jumlah pedang 3D yang meluncur bersamaan dari langit
const TARGET_PIXEL_SIZE = 30;
const METEOR_COUNT = 1;

// Parameter Fungsi randomBetween:
// - min (number): Batas nilai minimum
// - max (number): Batas nilai maksimum
// Fungsi: Menghasilkan nilai numerik acak antara min dan max
function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// Sub-komponen Pedang Jatuh Tunggal (Single 3D Falling Sword)
// Parameter SingleFallingSword:
// - index (number): Indeks nomor urut pedang jatuh
// - baseModel (THREE.Group): Model 3D dasar yang sudah diolah materialnya
// - modelLength (number): Panjang ukuran asli model 3D pedang
function SingleFallingSword({ index, baseModel, modelLength }) {
  const { viewport, size } = useThree();
  const groupRef = useRef(null);
  const tipRef = useRef(null);

  // Skala piksel ke dunia (units per pixel)
  const unitsPerPixel = viewport.width / size.width;

  // Parameter Skala (User Rule 2: Ukuran pedang 100px):
  // - scaleFactor (number): Pengali skala agar panjang pedang di layar persis 100px
  const scaleFactor = useMemo(() => {
    const desiredWorldLength = TARGET_PIXEL_SIZE * unitsPerPixel;
    return desiredWorldLength / modelLength;
  }, [modelLength, unitsPerPixel]);

  // Jarak titik ujung bilah untuk jangkar trail (dihitung presisi berdasarkan panjang model)
  const tipDistance = (modelLength * 0.52) * scaleFactor;
  // Lebar jejak trail pada bilah pedang (User Rule 5: Efek trail bilah)
  const trailWidth = (modelLength * 0.22) * scaleFactor;

  // Clone model 3D khusus untuk instance pedang utama ini
  const swordModel = useMemo(() => baseModel.clone(true), [baseModel]);

  // Duplikasi model 3D untuk bayangan Terraprism (User Rule 6: Bayangan pedang Terraprism Terraria)
  // Parameter ghostCount (number): Jumlah bayangan hantu pedang yang mengekor di belakang
  const ghostCount = 3;
  const ghostModels = useMemo(() => {
    return Array.from({ length: ghostCount }, () => {
      const cloned = baseModel.clone(true);
      // Ubah material bayangan hantu agar agak transparan bernuansa emas
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#fbbf24"),
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
          });
        }
      });
      return cloned;
    });
  }, [baseModel, ghostCount]);

  // Ref posisi 3D & kecepatan meluncur (bebas dari glitch React rerender)
  const pos = useRef(new THREE.Vector3());
  const speed = useRef(randomBetween(4.2, 6.8));

  // Buffer riwayat posisi & rotasi untuk bayangan Terraprism
  const ghostHistory = useRef(
    Array.from({ length: 20 }, () => ({ x: 0, y: 0, rotZ: 0 }))
  );
  const ghostRefs = useRef([]);

  // Posisi awal acak di sudut kanan-atas luar layar
  const initPosition = useMemo(() => {
    const startX = viewport.width / 2 + randomBetween(1, 5) + index * 2.2;
    const startY = viewport.height / 2 + randomBetween(1, 4) + index * 1.8;
    return new THREE.Vector3(startX, startY, -0.1 - index * 0.08);
  }, [viewport, index]);

  useMemo(() => {
    pos.current.copy(initPosition);
  }, [initPosition]);

  // Sudut kemiringan meluncur diagonal dari kanan-atas ke kiri-bawah (sekitar -135 derajat)
  const angleZ = Math.atan2(-1, -1);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const step = speed.current * dt;

    // Geser posisi pedang secara konstan dari kanan-atas ke kiri-bawah
    pos.current.x -= step;
    pos.current.y -= step;

    // Batas bawah-kiri luar layar
    const minX = -viewport.width / 2 - 3.5;
    const minY = -viewport.height / 2 - 3.5;

    // Reset posisi pedang ke kanan-atas tanpa memicu re-render React (Memperbaiki glitch animasi)
    if (pos.current.x < minX || pos.current.y < minY) {
      pos.current.x = viewport.width / 2 + randomBetween(1, 5);
      pos.current.y = viewport.height / 2 + randomBetween(1, 4);
      speed.current = randomBetween(4.2, 6.8);

      // Reset riwayat bayangan agar transisi tetap mulus tanpa lompatan visual
      ghostHistory.current.forEach((h) => {
        h.x = pos.current.x;
        h.y = pos.current.y;
        h.rotZ = angleZ;
      });
    }

    // Terapkan koordinat ke objek 3D utama
    if (groupRef.current) {
      groupRef.current.position.copy(pos.current);
      groupRef.current.rotation.z = angleZ;
    }

    // Catat pose saat ini ke buffer riwayat bayangan Terraprism
    ghostHistory.current.unshift({
      x: pos.current.x,
      y: pos.current.y,
      rotZ: angleZ,
    });
    if (ghostHistory.current.length > 20) {
      ghostHistory.current.pop();
    }

    // Posisikan tiap bayangan pedang Terraprism di belakang pedang utama sesuai riwayat
    ghostRefs.current.forEach((gRef, i) => {
      if (!gRef) return;
      const historyIndex = (i + 1) * 5;
      const pose = ghostHistory.current[historyIndex] || pos.current;
      gRef.position.set(pose.x, pose.y, pos.current.z - (i + 1) * 0.04);
      gRef.rotation.z = pose.rotZ;
    });
  });

  return (
    <>
      {/* Bayangan pedang Terraprism bernuansa emas (User Rule 6: Bayangan Terraprism Terraria) */}
      {/* {ghostModels.map((gModel, i) => (
        <group
          key={i}
          ref={(el) => (ghostRefs.current[i] = el)}
          scale={scaleFactor}
        >
          <primitive object={gModel} />
        </group>
      ))} */}

      {/* Pedang 3D Utama yang Meluncur */}
      <group ref={groupRef} scale={scaleFactor}>
        {/* Cahaya Obor Emas pada bilah pedang (User Rule 3 & 10: Cahaya obor emas, pertahankan radius & ketajaman) */}
        {/* Parameter: color (warna obor emas), intensity (kekuatan cahaya), distance (radius jangkauan), decay (ketajaman cahaya) */}
        <pointLight
          color="#ffb703"
          intensity={0.7}
          distance={2.5}
          decay={2}
          position={[0, 0, 0.2]}
        />

        {/* Model 3D Pedang Kayu */}
        <primitive object={swordModel} />

        {/* Titik jangkar ujung bilah untuk jejak trail */}
        <object3D ref={tipRef} position={[tipDistance / scaleFactor, 0, 0]} />
      </group>

      {/* Trail Jejak Cahaya Emas pada Bilah Pedang (User Rule 5: Efek trail bilah) */}
      {/* Parameter: target (titik jangkar bilah), width (lebar jejak), length (panjang jejak), decay (kecepatan memudar) */}
      <Trail
        target={tipRef}
        width={trailWidth}
        length={6}
        decay={1.4}
        color="#fbbf24"
        attenuation={(w) => Math.pow(w, 1.5)}
      />
    </>
  );
}

// Komponen Utama FallingSword (Pedang Jatuh 3D)
export default function FallingSword() {
  const { scene } = useGLTF(MODEL_URL);

  // Proses & siapkan model 3D dasar (User Rule 1: Mesh bilah dinamai 'bilah')
  const { baseModel, modelLength } = useMemo(() => {
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
      // User Rule 1: nama mesh bilah pada woodensword.glb adalah 'bilah'
      const isBilah =
        child.name.toLowerCase().includes("bilah") ||
        child.parent?.name.toLowerCase().includes("bilah");

      if (isBilah) {
        // Material bilah pedang menyala terang bernuansa emas (User Rule 3 & 9)
        const bladeMat = new THREE.MeshStandardMaterial({
          color: "#fffdf0",
          emissive: new THREE.Color("#f59e0b"),
          emissiveIntensity: 0.85,
          roughness: 0.3,
          metalness: 0.5,
          toneMapped: false,
        });
        child.material = bladeMat;

        // Pendaran garis tepi luar emas lembut
        const outlineMat = new THREE.MeshBasicMaterial({
          color: "#fbbf24",
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.12,
        });
        const outline = new THREE.Mesh(child.geometry, outlineMat);
        outline.scale.multiplyScalar(1.05);
        child.add(outline);
      } else {
        // Material kayu gagang & pembatas dengan sentuhan emas
        const handleMat = new THREE.MeshStandardMaterial({
          color: "#3d2210",
          emissive: new THREE.Color("#ffb703"),
          emissiveIntensity: 0.08,
          roughness: 0.7,
        });
        child.material = handleMat;
      }
      child.castShadow = false;
      child.receiveShadow = false;
    });

    // Pusatkan offset model ke titik tengah (0,0,0)
    cloned.position.set(-center.x, -center.y, -center.z);

    return {
      baseModel: cloned,
      modelLength: length,
    };
  }, [scene]);

  return (
    <group>
      {Array.from({ length: METEOR_COUNT }).map((_, i) => (
        <SingleFallingSword
          key={i}
          index={i}
          baseModel={baseModel}
          modelLength={modelLength}
        />
      ))}
    </group>
  );
}

useGLTF.preload(MODEL_URL);
