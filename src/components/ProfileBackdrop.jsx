import { useEffect, useRef } from "react";
import SECTION2_SVG_MARKUP from "../assets/section2Backdrop";

/**
 * Backdrop Section 2 — memakai aset vektor asli "section2.svg" (siluet
 * kastil & perbukitan malam), diwarnai ulang agar nyambung dengan palet
 * Section 1 (Backdrop.jsx: langit twilight + garis kinpaku emas) dan
 * Section 4 (CavernBackdrop.jsx: langit gua navy-teal yang sama).
 *
 * Warna TIDAK di-hardcode di sini maupun di berkas SVG-nya — tiap gradient
 * & warna solid memakai CSS custom property (--s2-*) yang didefinisikan di
 * index.css, jadi seluruh nuansa backdrop ini tetap gampang direcolor cukup
 * lewat CSS, tanpa perlu mengedit ulang markup SVG.
 *
 * Markup SVG asli (termasuk tekstur jendela base64 & clip-path) disuntikkan
 * apa adanya lewat dangerouslySetInnerHTML supaya tidak ada risiko salah
 * transkripsi geometri; 4 grup <g> (#s2-layer-far/-castles/-hills/-front)
 * di dalamnya lalu diambil lewat querySelector untuk digerakkan sebagai
 * lapisan paralaks terpisah — pola yang sama dengan CavernBackdrop.jsx.
 */
export default function ProfileBackdrop({ dust, active }) {
  const svgHostRef = useRef(null);
  const glowRef = useRef(null);
  const lineRef = useRef(null);
  const dustRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const host = svgHostRef.current;
    const layers = host
      ? {
          far: host.querySelector("#s2-layer-far"),
          castles: host.querySelector("#s2-layer-castles"),
          hills: host.querySelector("#s2-layer-hills"),
          front: host.querySelector("#s2-layer-front"),
        }
      : {};

    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    // Sensitivitas paralaks dikurangi di layar sentuh, senada dengan CavernBackdrop
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const sensitivity = isMobile ? 0.35 : 1.0;

    const getXY = (e) => {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const onMove = (e) => {
      const { x, y } = getXY(e);
      tx = (x / window.innerWidth - 0.5) * sensitivity;
      ty = (y / window.innerHeight - 0.5) * sensitivity;
    };

    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;

      // Kedalaman berlapis: langit & bukit jauh nyaris diam, kastil bergeser
      // sedang, bukit dekat & siluet depan bergeser paling jauh — persis
      // logika depth-parallax di Backdrop.jsx & CavernBackdrop.jsx.
      if (layers.far) layers.far.style.transform = `scale(1.03) translate3d(${cx * 8}px, ${cy * 5}px, 0)`;
      if (layers.castles) layers.castles.style.transform = `scale(1.03) translate3d(${cx * 16}px, ${cy * 9}px, 0)`;
      if (layers.hills) layers.hills.style.transform = `scale(1.03) translate3d(${cx * 26}px, ${cy * 14}px, 0)`;
      if (layers.front) layers.front.style.transform = `scale(1.03) translate3d(${cx * 38}px, ${cy * 20}px, 0)`;

      if (glowRef.current) glowRef.current.style.transform = `translate3d(${cx * 10}px, ${cy * 6}px, 0)`;
      if (lineRef.current) lineRef.current.style.transform = `translate3d(${cx * 16}px, ${cy * 8}px, 0)`;
      if (dustRef.current) dustRef.current.style.transform = `translate3d(${cx * 26}px, ${cy * 14}px, 0)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <>
      {/* Siluet kastil & perbukitan malam (section2.svg), 4 lapisan paralaks */}
      <div
        className="section2-backdrop-container"
        ref={svgHostRef}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: SECTION2_SVG_MARKUP }}
      />

      <div className="profile-glow" ref={glowRef} aria-hidden="true" />

      <svg
        className="profile-topline"
        viewBox="0 0 1600 120"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden="true"
        ref={lineRef}
      >
        <path
          d="M-40,70 Q200,10 420,60 T860,40 T1300,70 T1680,30"
          stroke="#fbbf24"
          strokeWidth="1.4"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M-40,92 Q220,42 440,82 T880,62 T1320,92 T1680,55"
          stroke="#fde047"
          strokeWidth="1"
          fill="none"
          opacity="0.2"
        />
      </svg>

      <div className="profile-dust" ref={dustRef} aria-hidden="true">
        {dust.map((d, i) => (
          <span
            key={i}
            className="dust-mote"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
