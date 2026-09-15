import { useEffect, useRef, useState } from "react";

// Data 4 Fase Perjalanan (Story Phases):
// Parameter STORY_STEPS:
// - id (number): Identifikasi unik fase
// - phase (string): Label urutan fase
// - title (string): Judul utama fase
// - subtitle (string): Sub-judul penjelasan fase
// - desc (string): Deskripsi singkat perjalanan
const STORY_STEPS = [
  {
    id: 1,
    phase: "PHASE 01",
    title: "Pendidikan Sekolah Dasar & Menengah",
    subtitle: "Pondasi & Karakter",
    desc: "Membangun fondasi logika, karakter, dan rasa ingin tahu awal terhadap dunia teknologi serta ilmu pengetahuan.",
  },
  {
    id: 2,
    phase: "PHASE 02",
    title: "Kompetensi Keahlian (SMK)",
    subtitle: "Kejuruan & Praktik",
    desc: "Mengasah keahlian dasar pemrograman, logika sistem, dan pengerjaan proyek perangkat lunak secara hands-on.",
  },
  {
    id: 3,
    phase: "PHASE 03",
    title: "Perguruan Tinggi / Kuliah",
    subtitle: "Eksplorasi & Spesialisasi",
    desc: "Mengembangkan pemahaman akademik lebih dalam, meracik pengalaman web 3D interaktif, IoT, dan aplikasi modern.",
  },
  {
    id: 4,
    phase: "PHASE 04",
    title: "Dunia Kerja",
    subtitle: "Coming Soon",
    desc: "Siap melangkah ke dalam industri profesional dan memberikan kontribusi nyata melalui karya digital yang bermakna.",
    isComingSoon: true,
  },
];

// Sub-komponen Kartu Story Interaktif & Draggable (Bisa Digeser)
// Parameter DraggableStoryCard:
// - step (object): Data fase story
// - index (number): Indeks urutan kartu
function DraggableStoryCard({ step, index }) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  // Parameter Event Handler Pointer Drag:
  // - e (PointerEvent): Event pointer mouse/touch
  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startPos.current = { x: e.clientX - drag.x, y: e.clientY - drag.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setDrag({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Reset kembali ke posisi semula secara halus saat dilepas
    setDrag({ x: 0, y: 0 });
  };

  return (
    <div
      className={`story-card ${step.isComingSoon ? "coming-soon" : ""}`}
      style={{
        transform: `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x * 0.03}deg)`,
        transition: isDragging
          ? "none"
          : "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="story-node-dot" aria-hidden="true" />
      <div className="story-card-content">
        <span className="story-phase-tag">{step.phase}</span>
        <h3 className="story-card-title">{step.title}</h3>
        <p className="story-card-subtitle">{step.subtitle}</p>
        <p className="story-card-desc">{step.desc}</p>
      </div>
    </div>
  );
}

// Komponen Utama Section 3: Story Timeline
export default function Story() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  // Efek Parallax & Scroll Reveal In/Out
  useEffect(() => {
    // IntersectionObserver dengan toggle class in-view (masuk & keluar layar secara halus)
    const cards = document.querySelectorAll(".story-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Toggle in-view: muncul saat scroll masuk, hilang perlahan saat scroll keluar balik ke atas
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));

    // Parallax mouse pada background story
    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      tx = x / window.innerWidth - 0.5;
      ty = y / window.innerHeight - 0.5;
    };

    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${cx * 18}px, ${cy * 10}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="story-section" id="story" ref={containerRef}>
      {/* Latar Belakang Parallax & Pendaran Emas Ambient */}
      <div className="story-bg" ref={bgRef} aria-hidden="true">
        <div className="story-glow" />
      </div>

      <div className="grain" />

      {/* Ornamen Pembatas Emas */}
      <div className="story-header">
        <span className="profile-divider" aria-hidden="true">
          历程 · STORY
        </span>
        <h2 className="story-main-title">Fase Perjalanan</h2>
      </div>

      {/* Timeline Bertahap 4 Fase */}
      <div className="story-timeline">
        {/* Garis lengkung menyambung emas antar kartu (Curved Connecting Line) */}
        {/* <svg className="story-curve-line" viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 50,0 Q 85,200 50,400 T 50,800"
            stroke="#fbbf24"
            strokeWidth="2.5"
            fill="none"
            opacity="0.5"
            strokeDasharray="6 4"
          />
        </svg> */}

        {STORY_STEPS.map((step, idx) => (
          <DraggableStoryCard key={step.id} step={step} index={idx} />
        ))}
      </div>
    </section>
  );
}
