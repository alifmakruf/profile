import { Suspense, useEffect, useRef, useState } from "react";
import Backdrop from "./components/Backdrop";
import Scene from "./components/Scene";
import Profile from "./components/Profile";
import Story from "./components/Story";
import Projects from "./components/Projects";

export default function App() {
  const cursorRef = useRef(null);
  // Ref untuk elemen pendaran obor emas di latar belakang
  const torchRef = useRef(null);
  // Posisi kursor mouse (normalized device coordinates, -1..1) dihitung
  // manual dari window.innerWidth/innerHeight — tidak bergantung pada
  // sistem event bawaan Three.js, jadi tetap akurat walau halaman panjang.
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Terima koordinat dari mouse maupun sentuhan jari, supaya pedang &
    // efek kursor tetap merespons interaksi di perangkat layar sentuh (HP/tablet).
    const getXY = (e) => {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const onMove = (e) => {
      const { x, y } = getXY(e);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      const hl = document.querySelector(".hero-headline");
      if (hl) {
        const rect = hl.getBoundingClientRect();
        hl.style.setProperty("--hl-x", `${x - rect.left}px`);
        hl.style.setProperty("--hl-y", `${y - rect.top}px`);
      }
      pointerRef.current.x = (x / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(y / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <>
      <div className="stage" id="hero">
        {/* User Request 3: Navbar kecil di tengah atas section 1 (display tidak fixed) */}
        <header className="hero-nav">
          <nav className="hero-nav-pill">
            <a href="#hero" className="nav-link">Home</a>
            <a href="#about" className="nav-link">Profile</a>
            <a href="#story" className="nav-link">Story</a>
            <a href="#projects" className="nav-link">Projects</a>
          </nav>
        </header>

        <Backdrop />

        <div className="hero-text">
          <span className="hero-line" aria-hidden="true" />
          <h1 className="hero-headline">Let the sword bring enlightenment.</h1>
        </div>

        <div className="hud">
          <p className="kanji">Personal Profile</p>
        </div>

        <a href="#about" className="scroll-cue">
          <span>.</span>
          <span className="scroll-chevron" aria-hidden="true" />
        </a>
      </div>

      <Profile />
      <Story />
      <Projects />

      {/* Pendaran cahaya obor emas di belakang bilah pedang (tetap menyala dan menerangi seluruh section) */}
      <div className="torch-glow" ref={torchRef} />

      {/* Pedang dirender di luar .stage sebagai layer tetap (fixed) yang menutupi
          seluruh halaman, sehingga tetap mengikuti kursor di section manapun. */}
      <Suspense fallback={null}>
        <Scene torchRef={torchRef} pointerRef={pointerRef} />
      </Suspense>

      <div className="cursor-dot" ref={cursorRef} />

      {/* Floating Action Controls di Kanan Bawah */}
      {/* Tombol Arrow Ke Atas untuk Menavigasi ke Section Pertama */}
      <div className="floating-controls">
        <button
          type="button"
          className="float-btn top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Navigasi ke Section Pertama"
          title="Kembali ke atas (Section 1)"
        >
          <svg viewBox="0 0 24 24" className="ctrl-icon">
            <path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </>
  );
}
