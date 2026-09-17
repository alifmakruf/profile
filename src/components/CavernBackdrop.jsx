import { useEffect, useRef } from "react";

/**
 * Komponen CavernBackdrop — Menggunakan Desain Vektor SVG Asli (section-4.svg)
 * Disesuaikan dengan Palet Nuansa Warna Section 1 (Backdrop.jsx):
 * - Langit malam oriental & inti cahaya bulan/obor keemasan (Warm Golden Moonlight & Twilight)
 * - Dinding stalaktit slate-bronze dengan garis kontur emas kinpaku
 * - Bingkai terluar #05070c menyatu 100% tanpa batas dengan Section 3
 * - Responsive: Stabil di semua ukuran layar (Desktop, Tablet, HP) tanpa terdistorsi
 */
export default function CavernBackdrop({ active = true }) {
  // Ref untuk tiap lapisan paralaks (User Rule 7: Penanda parameter & fungsi dalam bahasa Indonesia)
  // - l1Ref: Lapisan dasar gua & cahaya langit keemasan (inner & sky)
  // - l2Ref: Lapisan dinding gua tengah (mid)
  // - l3Ref: Lapisan dinding gua luar (outer)
  // - l4Ref: Lapisan bingkai gua terluar (frame #05070c)
  const l1Ref = useRef(null);
  const l2Ref = useRef(null);
  const l3Ref = useRef(null);
  const l4Ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    // Deteksi layar sentuh HP/tablet untuk menyesuaikan sensitivitas paralaks
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const sensitivity = isMobile ? 0.35 : 1.0;

    // Fungsi getXY: Mengambil titik koordinat dari mouse atau gesture touch
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

    // Loop animasi lerp halus untuk kedalaman paralaks bertingkat
    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;

      if (l1Ref.current) l1Ref.current.style.transform = `scale(1.04) translate3d(${cx * 10}px, ${cy * 6}px, 0)`;
      if (l2Ref.current) l2Ref.current.style.transform = `scale(1.04) translate3d(${cx * 20}px, ${cy * 12}px, 0)`;
      if (l3Ref.current) l3Ref.current.style.transform = `scale(1.04) translate3d(${cx * 34}px, ${cy * 18}px, 0)`;
      if (l4Ref.current) l4Ref.current.style.transform = `scale(1.04) translate3d(${cx * 46}px, ${cy * 24}px, 0)`;

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
    <div className="cavern-backdrop-container" aria-hidden="true">
      {/* =========================================================================
          LAPISAN 1: Dasar Gua & Cahaya Bulan/Senja Keemasan (inner & sky)
          Nuansa: Twilight Night Sky + Warm Golden Amber Aperture (Selaras Section 1)
          ========================================================================= */}
      <div className="cavern-layer cavern-l1" ref={l1Ref}>
        <svg
          viewBox="0 0 2560 1440"
          preserveAspectRatio="xMidYMid slice"
          className="cavern-full-svg"
        >
          <defs>
            {/* Latar Belakang Langit Gua: Gradien Malam Oriental #04070d -> #121e30 */}
            <linearGradient id="cavernNightSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#04070d" />
              <stop offset="35%" stopColor="#0a121e" />
              <stop offset="70%" stopColor="#121e30" />
              <stop offset="100%" stopColor="#070c14" />
            </linearGradient>

            {/* Cahaya Emas Inti Lubang Gua (Meniru Pendaran Emas Obor & Bulan Section 1) */}
            <radialGradient id="cavernGoldSkyGlow" cx="48%" cy="46%" r="50%">
              <stop offset="0%" stopColor="#0a5370ff" stopOpacity="0.58" />
              <stop offset="18%" stopColor="#063a58ff" stopOpacity="0.88" />
              <stop offset="42%" stopColor="#07354bff" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#043241ff" stopOpacity="0.35" />
              <stop offset="90%" stopColor="#1e293b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0a121e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Dinding Belakang / Langit Gua Terdalam */}
          <rect width="2560" height="1440" fill="url(#cavernNightSky)" />

          {/* Bukaan Langit Gua dengan Pendaran Emas Hangat */}
          <path
            id="sky"
            d="M398.94 423.84c-54.81,70.81 -62.69,5.67 -89.02,118.54 -28.25,121.06 -167.52,18.88 -68,286.97 28.27,76.16 130.68,108.62 187.65,169.03 68.78,72.91 -17.44,66.39 153.72,70.63 116.8,2.88 92.34,44.34 270.97,44.34 61.58,0 16.07,-8.48 83.66,-64.69 158.56,-131.87 149.69,-26.4 328,-66.28 120.68,-27 124.39,49.37 209.71,-44.69 22.49,-24.79 72.9,-51.33 102.29,-62.06 65.7,-23.98 69.04,-62.99 197.03,-93.25 54.3,-12.84 25.14,-41.03 168,-41.03 42.92,0 194.43,-2.83 209.03,-25.6 0.35,-0.56 86.47,-63.88 122.62,-111.43 90.68,-119.27 147.56,-191.97 1.95,-272 -96.4,-52.98 -54.48,-86.97 -202.63,-86.97 -80.37,0 -161.64,8 -252.69,8 -139.21,0 -449.87,-58.05 -533.26,-38.97 -44.21,10.11 11.22,14.55 -88.34,22.28 -37.73,2.93 -229.53,44.47 -246.97,82.75 -30.93,67.87 -151.9,28 -141.03,118.62 -54.22,45.18 -284.33,12 -359.66,-13.71 -7.92,-2.7 -10.01,-6.37 -9.02,9.03l-44.01 -9.51z"
            fill="url(#cavernGoldSkyGlow)"
          // stroke="#fde047"
          // strokeWidth=".5"
          // strokeOpacity="0.5"
          />

          {/* Partikel Debu Emas (Kinpaku) Berkilauan di Depan Cahaya Gua */}
          {[
            [720, 520, 4.4], [880, 480, 1.8], [1050, 560, 2.6], [1220, 490, 2.2],
            [1380, 540, 2.8], [1520, 470, 1.9], [1680, 530, 2.5], [980, 640, 2.0],
            [1310, 620, 2.4], [1160, 430, 2.2], [820, 600, 1.6], [1440, 440, 1.8],
          ].map(([gx, gy, gr], i) => (
            <circle
              key={i}
              cx={gx}
              cy={gy}
              r={gr}
              fill="#fde047"
              opacity={0.75 - (i % 3) * 0.15}
            />
          ))}
        </svg>
      </div>

      {/* =========================================================================
          LAPISAN 2: Dinding Gua Tengah (mid)
          Nuansa: Dark Slate-Bronze (Selaras Puncak Pegunungan Tengah Section 1)
          ========================================================================= */}
      <div className="cavern-layer cavern-l2" ref={l2Ref}>
        <svg
          viewBox="0 0 2560 1440"
          preserveAspectRatio="xMidYMid slice"
          className="cavern-full-svg"
        >
          <defs>
            <linearGradient id="cavernMidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#182535" />
              <stop offset="50%" stopColor="#111c28" />
              <stop offset="100%" stopColor="#0a121c" />
            </linearGradient>
          </defs>
          <path
            id="mid"
            d="M0 0l2560 0 0 154.94c-97.61,103.46 -320.83,224.94 -330.02,224.41 -246.53,-14.17 -84.11,224.9 -253.03,139.66 -71.17,-35.91 -40.52,-34.09 -31.66,-60.69 44.97,-134.88 -114.16,-54.98 -130.62,-5.6 -3.54,0.95 -64.84,40.44 -93.03,21.6 -35.16,-23.48 -66.12,-37.51 -72,-72.34 -9.7,-57.38 -169.27,88.73 -178.06,91.66 -6.83,30.73 -45.58,17.71 -51.66,17.71 -11.95,0 -63.2,-68.9 -62.63,-69.6 -4.01,8.37 -77.06,100.37 -79.31,106.97 -42.49,124.83 -62.44,-89.09 -126.06,-127.77 -93.61,-56.9 -13.14,-56.26 -66.63,-60.57 -170.37,-13.71 -224.16,-20.65 -294.28,109.94 -30.66,57.1 -51.53,88.15 -88.69,146.4 -52.06,81.62 -1.27,172.16 -53.37,166.98 -54.18,-5.39 -113.69,-169.42 -115.66,-219.32 -4.84,-123.21 -98.02,7.07 -100,13.94 -4.12,14.33 -17.57,99.58 -18.4,100.35 -72.31,67.08 -90.1,-129.69 -104.57,-177.03 -122.53,-40.86 -87.08,85.12 -117.71,48 -47.84,-57.97 -173.82,33.69 -189.03,60.34 -1.22,2.14 -2.41,4.15 -3.58,6.08l0 -616.06zm2560 426.02l0 1013.98 -2560 0 0 -473.09c156.09,-14.33 95.67,129.74 180.95,79.76 48.43,-28.39 43.53,-139.44 66.97,-188.69 56.33,-118.33 122.49,-3.27 82.06,91.43 -46.23,108.27 121.15,199.7 168.34,121.6 26.75,-44.27 107.2,-59.83 102.63,12 -2.98,46.92 83,88.12 113.03,54.06 26.04,-29.55 70.76,1.78 77.26,-27.43 103.6,-25.1 -0.3,-66.29 264.34,-66.29 93.91,0 8.25,24 128.34,24 9.92,0 25.24,-7.38 37.03,-12l13.93 19.71 45.12 -100.06c46.85,54.15 57.15,-78.67 201.98,43.32 23.21,19.55 66.69,32.38 94.97,13.03l12.05 -12.35c91.52,-40.93 38.74,-133.23 109.89,-167.65 16.05,21.39 81.06,255.57 148.69,80.69 10.94,-28.29 87.29,-317.02 131.43,-269.72 27.51,29.48 -7.76,25.18 55.31,86.4 65.78,63.86 134.07,297.67 230.97,98.63 58.68,-120.51 112.22,-39.67 99.66,-253.03 -3.56,-60.53 94.23,62.73 120.05,-7.32 0.28,-0.77 20.66,-129.02 20.66,-129.02 -0.82,3.54 47.17,-44.8 54.34,-31.96z"
            fill="url(#cavernMidGrad)"
          // stroke="#fbbf24"
          // strokeWidth=".5"
          // strokeOpacity="0.5"
          />
        </svg>
      </div>

      {/* =========================================================================
          LAPISAN 3: Dinding Gua Luar (outer)
          Nuansa: Deep Dark Indigo-Slate (Selaras Pegunungan Dekat Section 1)
          ========================================================================= */}
      <div className="cavern-layer cavern-l3" ref={l3Ref}>
        <svg
          viewBox="0 0 2560 1440"
          preserveAspectRatio="xMidYMid slice"
          className="cavern-full-svg"
        >
          <defs>
            <linearGradient id="cavernOuterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1520" />
              <stop offset="50%" stopColor="#080e16" />
              <stop offset="100%" stopColor="#05080e" />
            </linearGradient>
          </defs>
          <path
            id="outer"
            d="M2560 967.22l0 472.78 -2560 0 0 -184.95c38.17,-8.49 150.07,-33.03 170.32,-42.67 104.14,-49.58 50.3,-29.64 134.29,-109.03 32.58,-30.8 86.05,-6.35 45.37,53.03 -22.67,33.1 57.84,138.35 128.57,62.63 17.08,-18.29 39.05,18.42 84.69,-5.6 33.08,-17.41 58.63,27.29 162.4,-31.09 47.63,19.72 1.38,77.25 88.68,80.69 32.67,1.29 39.84,48.9 94.63,-12 185.12,-205.76 150.14,-16.39 285.37,-145.37 17.32,-16.52 153.42,-109.8 161.6,-105.6 74.76,38.39 -9.72,47.73 137.03,98.97 144.25,50.36 42.26,106.62 111.32,81.71 11.1,-4 6.63,-18.94 36.68,-32.68 76.06,-34.78 43.08,-79.79 171.89,-48.69 0.55,0.14 70.83,62.93 129.03,14.63 7.61,-6.32 59.9,-5.69 99.77,-52.57 28.15,-33.1 69.49,-22.26 134.63,-132.69 43.43,-73.63 104.49,3.65 169.37,-67.31 41.81,-45.73 79.29,111.64 144.34,105.94 16.48,-1.44 0.21,5.4 49.6,-0.34 7.43,-0.86 14.21,-0.74 20.42,0.21zm-2560 -967.22l2560 0 0 350.2c-52.03,38.13 -108.41,73.15 -112.58,73.15 -107.94,0 -52.9,-22.95 -79.66,-40.34 -90.18,-58.6 -55.49,-70.18 -84.92,-94.63 -85.34,-70.92 -101.88,78.26 -224.45,23.66 -277.39,-123.57 -251.43,105.71 -343.32,150.63 -74.05,36.2 -36.47,53.55 -110.63,31.65 -88.77,-26.2 -90.63,40.34 -90.97,39.32 -26.62,-80.62 -56.86,-26.14 -95.08,-95.32 -44.22,-80.01 -84.81,-112.15 -140.23,-24.57 -63.67,100.62 -105.19,27.12 -141.72,29.6 -100.13,6.8 22.9,-51.57 -45.03,-90.63 -84.58,-48.63 -58.38,-143.39 -177.6,-47.31 -65.35,52.67 -56.48,-75.1 -135.65,4.91 -116.98,118.22 17.12,97.1 -62.75,169.38 -128.32,116.13 -89.71,256.78 -199.65,86.28 -67.25,-104.29 -6.07,23.35 -73.94,-36.91 -29.65,-26.32 -82.58,21.07 -89.72,-40.35 -8.96,-77.1 -52.84,-30.9 -56.34,-55.99 -8.05,-57.71 -95.9,-94.77 -130.63,-26.4 -25.49,50.17 -110.19,111.81 -165.13,166.71l0 -573.04z"
            fill="url(#cavernOuterGrad)"
          // stroke="#fde047"
          // strokeWidth=".5"
          // strokeOpacity="0.5"
          />
        </svg>
      </div>

      {/* =========================================================================
          LAPISAN 4: Bingkai Gua Terluar (frame #05070c)
          Menyatu 100% tanpa batas dengan latar Section 3 (#05070c)
          ========================================================================= */}
      <div className="cavern-layer cavern-l4" ref={l4Ref}>
        <svg
          viewBox="0 0 2560 1440"
          preserveAspectRatio="xMidYMid slice"
          className="cavern-full-svg"
        >
          <path
            id="frame"
            d="M2560 957.02l0 482.98 -2560 0 0 -79.94c72.74,-43.55 86.12,52.53 189.47,-72.71 21.35,-25.86 55.11,-31.46 73.26,9.38 1.95,0.43 31.94,66.62 81.71,66.62 8.73,-33.92 156.09,-188.99 166.97,-225.6 14.43,22.46 43.96,8.69 37.03,62.98 41.73,37.92 117.78,128.23 170.63,68.91 55.08,-61.83 89.54,44.76 165.37,37.71 17.62,-1.63 120.23,39.75 136,-30.97 1.57,-7.02 26.06,-47.81 38.06,-24 14.45,28.69 147.71,142.78 204.23,32.57 39.48,-76.98 -28.38,-97.33 60,-166.97 16.11,-12.7 28.84,-72.23 58.06,-24.68 22.41,36.48 24.85,-7.51 19.65,69.03 -1.44,21.29 62.88,101.87 109.03,109.02 14.53,2.26 63.5,54.77 116,-5.94 23.39,-27.04 68.61,10.59 82.97,-34.74 31.73,-100.11 130.04,-250.35 238.63,-284.34 89.75,-28.1 36.22,33.02 121.72,33.02 52.22,0 10.82,47.19 66.97,60.69 248.39,59.72 106.04,37.57 225.71,-47.66 44.91,-31.98 107.75,62.49 129.6,-16 2.55,-9.16 44.68,-16.28 68.93,-19.36zm-2560 -957.02l2560 0 0 173.64c-6.21,3.6 -12.51,7.08 -18.87,10.4 -29.37,185.99 -61.93,-7.21 -82.74,-26.29 -44.64,-40.92 3.94,-6.55 -27.89,-47.43 -76.87,-98.71 -127.88,61.52 -138.06,74.98 -29.08,38.47 -48.49,20.74 -71.65,-9.6 -46.38,0 -99.4,-121.55 -130.06,-70.75 -23.3,38.62 -142.07,105.13 -176,71.77 -59.11,-58.1 -137.7,3.39 -140.57,12 -9.84,2.19 -43.38,51.2 -62.74,68.92 -104.15,95.31 -36.42,71.5 -31.32,171.08 6.02,117.57 -37.62,46.9 -38.63,46.98 -65.28,4.72 -94.02,-89.55 -95.08,-90.29 -53.75,-37.1 -34.28,-62.96 -42.29,-120.34 -60.33,-28.58 -56.29,-79.91 -54.63,-78.06 -61.86,66.44 -122.28,-39.69 -196.68,-72.34 -100.7,-44.19 -156.93,67.12 -208.69,69.03 -33.36,1.22 -126.08,100.96 -150.06,66.97 -60.3,-85.53 -131.62,1.83 -190.63,40.68 -20.3,13.37 -48.12,87.41 -54.28,88.69 -5.32,51.38 -44.03,-55.37 -65.03,-42.74 -116.88,70.28 33.58,82.05 -135.66,82.05 0,-103.93 -49.65,-94.89 -50.74,-121.03 -98.77,57.36 -55.59,-29.69 -124.57,-46.28 -35.05,-8.43 40.41,-36.69 -83.32,-36.69 -33.47,0 -89.94,90.12 -90.05,90.63 -19.93,93.24 -64.57,74.17 -88.35,118.4 -3.8,7.07 -7.7,12.89 -11.41,17.73l0 -442.11z"
            fill="#05070C"
          // stroke="#fbbf24"
          // strokeWidth=".5"
          // strokeOpacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
