import { useEffect, useRef } from "react";

/**
 * Parallax ringan untuk section Profile — logika sama persis dengan
 * Backdrop.jsx (mousemove + damping via requestAnimationFrame), tapi
 * elemennya disesuaikan dengan isi profile (bukan lanskap gunung):
 * glow lembut, garis kontur penutup, dan debu emas.
 */
export default function ProfileBackdrop({ dust, active }) {
  const glowRef = useRef(null);
  const lineRef = useRef(null);
  const dustRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;

      if (glowRef.current) glowRef.current.style.transform = `translate3d(${cx * 10}px, ${cy * 6}px, 0)`;
      if (lineRef.current) lineRef.current.style.transform = `translate3d(${cx * 16}px, ${cy * 8}px, 0)`;
      if (dustRef.current) dustRef.current.style.transform = `translate3d(${cx * 26}px, ${cy * 14}px, 0)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <>
      <div className="profile-glow" ref={glowRef} aria-hidden="true" />

      <svg
        className="profile-topline"
        viewBox="0 0 1600 120"
        preserveAspectRatio="none"
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
