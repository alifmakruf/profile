import { useEffect, useRef } from "react";

/**
 * Backdrop lanskap oriental malam / twilight (Nihonga Night) bernuansa gelap
 * dengan garis kontur emas berkilau (kinpaku lines) yang diterangi oleh bilah pedang.
 */
export default function Backdrop({ torchRef }) {
  const sunRef = useRef(null);
  const cloudRef = useRef(null);
  const farRef = useRef(null);
  const midRef = useRef(null);
  const nearRef = useRef(null);
  const mistRef = useRef(null);

  useEffect(() => {
    let raf = null;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    // Ambil koordinat baik dari event mouse maupun sentuhan (touch), supaya
    // parallax tetap hidup di HP/tablet, bukan cuma di desktop.
    const getXY = (e) => {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const onMove = (e) => {
      const { x, y } = getXY(e);
      tx = x / window.innerWidth - 0.5;
      ty = y / window.innerHeight - 0.5;
    };

    const tick = () => {
      // Pergerakan paralaks halus dengan redaman (damping)
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;

      if (sunRef.current) sunRef.current.style.transform = `translate3d(${cx * 8}px, ${cy * 5}px, 0)`;
      if (cloudRef.current) cloudRef.current.style.transform = `translate3d(${cx * 14}px, ${cy * 7}px, 0)`;
      if (farRef.current) farRef.current.style.transform = `translate3d(${cx * 22}px, ${cy * 10}px, 0)`;
      if (midRef.current) midRef.current.style.transform = `translate3d(${cx * 38}px, ${cy * 15}px, 0)`;
      if (mistRef.current) mistRef.current.style.transform = `translate3d(${cx * 48}px, ${cy * 6}px, 0)`;
      if (nearRef.current) nearRef.current.style.transform = `translate3d(${cx * 62}px, ${cy * 22}px, 0)`;

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
  }, []);

  return (
    <>
      {/* 1. Langit Malam / Senja Gelap (Dark Twilight Sky) */}
      <div className="sky dark-night-sky" />

      {/* 3. Awan Kabut Malam dengan Garis Emas (Dark Mist & Gold Lines) */}
      <div className="parallax-layer clouds-layer" ref={cloudRef}>
        <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice" className="backdrop-svg">
          <defs>
            <linearGradient id="darkCloudGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6978ac91" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#141824" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0c101a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-50,220 C120,160 260,240 420,180 C580,120 740,210 920,160 C1100,110 1260,190 1420,140 C1540,100 1650,150 1700,200 L1700,500 L-50,500 Z"
            fill="url(#darkCloudGrad)"
          />
          {/* Garis kontur emas berkilau di awan malam */}
          <path
            d="M80,240 C220,190 350,230 480,190 C620,150 780,220 940,170 C1100,130 1280,190 1480,150"
            stroke="#eab308"
            strokeWidth="1.2"
            fill="none"
            opacity="0.75"
          />
          <path
            d="M300,260 C420,220 540,240 680,200 C820,170 960,230 1120,180"
            stroke="#facc15"
            strokeWidth="1.0"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* 4. Pegunungan Jauh Gelap & Puncak Emas Amber (Far Dark Mountains) */}
      <div className="parallax-layer far-mountains" ref={farRef}>
        <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice" className="backdrop-svg">
          <defs>
            <linearGradient id="darkGoldMtnGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c59121ff" />
              <stop offset="40%" stopColor="#aa790eff" />
              <stop offset="80%" stopColor="#2a180b" />
              <stop offset="100%" stopColor="#141c28" />
            </linearGradient>
            <linearGradient id="darkSlateFarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b4974ff" />
              <stop offset="50%" stopColor="#193e66ff" />
              <stop offset="100%" stopColor="#b3d2fdff" />
            </linearGradient>
          </defs>

          {/* Puncak gunung emas kiri */}
          <path
            d="M-50,480 L30,320 L120,260 L210,330 L320,380 L440,430 L560,490 L-50,600 Z"
            fill="url(#darkGoldMtnGrad)"
            opacity="0.95"
          />
          {/* Garis emas lipatan gunung malam */}
          <path
            d="M120,260 Q170,320 230,370 T360,440"
            stroke="#fde047"
            strokeWidth="1.8"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M80,300 Q140,350 200,410"
            stroke="#fbbf24"
            strokeWidth="1.2"
            fill="none"
            opacity="0.95"
          />

          {/* Pegunungan slate malam di kanan */}
          <path
            d="M280,480 L460,380 L620,420 L780,360 L960,420 L1140,350 L1320,430 L1500,370 L1680,440 L1680,700 L280,700 Z"
            fill="url(#darkSlateFarGrad)"
            opacity="0.85"
          />
          <path
            d="M460,380 Q540,410 620,420 T780,360 T960,420 T1140,350 T1320,430"
            stroke="#eab308"
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* 5. Pegunungan Tengah Gelap Slate-Teal (Midground Dark Mountains) */}
      <div className="parallax-layer mid-mountains" ref={midRef}>
        <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice" className="backdrop-svg">
          <defs>
            <linearGradient id="midDarkSlateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#062e2eff" />
              <stop offset="45%" stopColor="#0d85a3ff" />
              <stop offset="100%" stopColor="#93e0e5ff" />
            </linearGradient>
            <linearGradient id="midDarkGoldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b88311ff" />
              <stop offset="50%" stopColor="#88470bff" />
              <stop offset="100%" stopColor="#251506ff" />
            </linearGradient>
          </defs>

          {/* Punggung bukit emas tengah kiri */}
          <path
            d="M-30,460 Q120,380 260,450 T540,510 L540,650 L-30,650 Z"
            fill="url(#midDarkGoldGrad)"
            opacity="0.9"
          />
          <path
            d="M0,450 Q130,390 270,455 T520,515"
            stroke="#fde047"
            strokeWidth="1.6"
            fill="none"
            opacity="0.8"
          />

          {/* Pegunungan besar di kanan */}
          <path
            d="M480,540 L640,430 L800,480 L1020,330 L1180,410 L1360,320 L1520,420 L1680,360 L1680,700 L480,700 Z"
            fill="url(#midDarkSlateGrad)"
            opacity="0.95"
          />
          <path
            d="M640,430 Q720,460 800,480 T1020,330 T1180,410 T1360,320 T1520,420"
            stroke="#fbbf24"
            strokeWidth="1.6"
            fill="none"
            opacity="0.75"
          />
          <path
            d="M1020,330 Q1060,410 1140,480 T1340,550"
            stroke="#fde047"
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Kabut Mengambang Lembah Malam (Dark Valley Mist) */}
      <div className="fog-band dark-valley-mist" ref={mistRef} />

      {/* 6. Pegunungan Depan Indigo Gelap dengan Garis Emas Menyala (Foreground Kinpaku Lines) */}
      <div className="parallax-layer near-mountains" ref={nearRef}>
        <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice" className="backdrop-svg">
          <defs>
            <linearGradient id="nearDarkIndigoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#131e28" />
              <stop offset="40%" stopColor="#0c141c" />
              <stop offset="100%" stopColor="#050a0e" />
            </linearGradient>
            <linearGradient id="nearDarkGoldAccent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#57381b" />
              <stop offset="50%" stopColor="#43280f" />
              <stop offset="100%" stopColor="#241405" />
            </linearGradient>
          </defs>

          {/* Bukit emas depan kanan bawah */}
          <path
            d="M740,560 Q900,490 1080,560 T1440,520 T1680,580 L1680,700 L740,700 Z"
            fill="url(#nearDarkGoldAccent)"
            opacity="0.88"
          />

          {/* Gunung depan indigo gelap utama */}
          <path
            d="M-50,540 Q160,440 380,520 T860,540 T1320,490 T1680,560 L1680,700 L-50,700 Z"
            fill="url(#nearDarkIndigoGrad)"
          />

          {/* Garis kontur ombak emas bersinar terang di kegelapan */}
          <path
            d="M-40,550 Q160,450 380,530 T860,550 T1320,500 T1680,570"
            stroke="#fbbf24"
            strokeWidth="2.0"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M-40,580 Q180,480 410,560 T890,580 T1340,530 T1680,600"
            stroke="#fde047"
            strokeWidth="1.5"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M-40,610 Q200,520 440,590 T920,610 T1360,570 T1680,630"
            stroke="#fbbf24"
            strokeWidth="1.3"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M-40,640 Q230,560 480,620 T950,640 T1390,600 T1680,660"
            stroke="#eab308"
            strokeWidth="1.1"
            fill="none"
            opacity="0.6"
          />

          {/* Butiran debu emas berkilauan di malam hari */}
          {[
            [120, 520, 2.2], [145, 505, 1.6], [170, 530, 2.8], [195, 515, 1.4],
            [230, 540, 2.2], [260, 525, 1.9], [290, 550, 1.6], [320, 535, 2.4],
            [780, 530, 2.2], [810, 515, 1.6], [840, 540, 2.8], [870, 525, 2.0],
            [1260, 480, 2.4], [1290, 465, 1.6], [1320, 490, 3.0], [1350, 475, 1.8],
          ].map(([gx, gy, gr], i) => (
            <circle
              key={i}
              cx={gx}
              cy={gy}
              r={gr}
              fill="#fde047"
              opacity={0.85 - (i % 3) * 0.15}
            />
          ))}
        </svg>
      </div>

      {/* Tekstur Kertas Washi Tradisional & Vignette Gelap */}
      <div className="grain" />
      <div className="vignette night-vignette" />
    </>
  );
}



