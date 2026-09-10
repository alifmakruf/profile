import { Suspense, useEffect, useRef } from "react";
import Backdrop from "./components/Backdrop";
import Scene from "./components/Scene";
import Profile from "./components/Profile";

export default function App() {
  const cursorRef = useRef(null);
  // Ref untuk elemen pendaran obor emas di latar belakang
  const torchRef = useRef(null);
  // Posisi kursor mouse (normalized device coordinates, -1..1) dihitung
  // manual dari window.innerWidth/innerHeight — tidak bergantung pada
  // sistem event bawaan Three.js, jadi tetap akurat walau halaman panjang
  // dan bisa di-scroll (posisi tidak lagi dihitung relatif ke tinggi
  // seluruh dokumen, melainkan relatif ke layar yang sedang terlihat).
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
      <div className="stage">
        <Backdrop torchRef={torchRef} />

        <div className="hero-text">
          <span className="hero-line" aria-hidden="true" />
          <h1 className="hero-headline">Let the sword bring enlightenment.</h1>
          {/* <p className="hero-tagline">
            A blade reveals the Dao. Every strike brings enlightenment
            <br />
            -
            <span className="hero-cursor" aria-hidden="true" />
          </p> */}
        </div>

        <div className="hud">
          <p className="kanji">木刀</p>
          {/* <p className="desc">Gerakkan kursor — pedang kayu akan mengikuti dengan lenturnya sendiri.</p> */}
        </div>
        {/* <div className="mark">DOJO · DUSK</div> */}

        <a href="#about" className="scroll-cue">
          <span>SCROLL</span>
          <span className="scroll-chevron" aria-hidden="true" />
        </a>
      </div>

      {/* Gradient jembatan tipis di sambungan section 1 -> 2, supaya transisi
          warna menyatu halus (tidak terlihat terpotong garis tegas) */}
      <div className="section-seam" aria-hidden="true" />

      <Profile />

      {/* Pedang dirender di luar .stage sebagai layer tetap (fixed) yang menutupi
          seluruh halaman, sehingga tetap mengikuti kursor di section manapun. */}
      <Suspense fallback={null}>
        <Scene torchRef={torchRef} pointerRef={pointerRef} />
      </Suspense>

      <div className="cursor-dot" ref={cursorRef} />
    </>
  );
}

