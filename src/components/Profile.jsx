import { useEffect, useRef, useState } from "react";
import ProfileBackdrop from "./ProfileBackdrop";

/**
 * Section 2 — "Data Diri" (About / Profile plaque)
 * Melanjutkan tema dojo/nihonga malam: bingkai emas pada foto, tipografi
 * yang sama dengan hero (Cinzel untuk judul, JetBrains Mono untuk label),
 * dan reveal halus saat section discroll ke dalam viewport.
 *
 * TODO sebelum publish:
 * 1. Taruh foto profil kamu di:  public/profile.jpg
 *    (buat folder "public" di root project kalau belum ada — bukan di dalam src/)
 * 2. Ganti NAME, MOTTO, dan BIO di bawah dengan kalimat kamu sendiri.
 * 3. Sesuaikan isi SKILLS / OTHER_SKILLS / INTERESTS sesuai kebutuhan.
 */

const NAME = "Mohammad Firman Alif Ma'ruf";
const MOTTO = "Kocok Sebelum Diminum";
const BIO =
  "Pengembang web & mobile yang senang meracik pengalaman interaktif — dari dashboard smart home berbasis IoT hingga scene 3D di browser. Tertarik pada detail kecil yang membuat sebuah karya terasa hidup.";

const INTERESTS = ["Smart Home & IoT", "3D Web Experience", "3D Modeling"];
const SKILLS = ["React & Vite", "Three.js / React Three Fiber", "IoT & ESP32", "MQTT & Firebase"];
const OTHER_SKILLS = ["Wiring Design", "3D Design", "UI Design"];

// Titik-titik debu emas melayang di latar belakang section, senada dengan
// Sparkles pada scene 3D di hero — dibuat statis (bukan random) supaya
// tidak berubah-ubah setiap kali komponen re-render.
const DUST = [
  { x: 8, y: 20, size: 6, delay: 0, duration: 7 },
  { x: 14, y: 62, size: 4, delay: 1.2, duration: 8.5 },
  { x: 22, y: 40, size: 4.5, delay: 2.4, duration: 6.5 },
  { x: 30, y: 78, size: 7.5, delay: 0.6, duration: 9 },
  { x: 40, y: 15, size: 2, delay: 3, duration: 7.5 },
  { x: 55, y: 55, size: 2.6, delay: 1.8, duration: 8 },
  { x: 66, y: 25, size: 4, delay: 0.3, duration: 6.8 },
  { x: 74, y: 70, size: 6.5, delay: 2.1, duration: 9.2 },
  { x: 84, y: 35, size: 3.4, delay: 1, duration: 7.2 },
  { x: 92, y: 60, size: 5.2, delay: 2.8, duration: 8.4 },
  { x: 48, y: 85, size: 2.1, delay: 0.9, duration: 7.8 },
  { x: 60, y: 10, size: 3.9, delay: 1.5, duration: 6.9 },
];

export default function Profile() {
  const frameRef = useRef(null);
  const photoWrapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tilt halus pada foto profil mengikuti kursor — mirror logika parallax
  // hero (mousemove + damping), tapi diterapkan sebagai rotasi 3D ringan
  // supaya foto terasa seperti plakat yang menangkap cahaya, cocok untuk
  // konten portrait (bukan pergeseran lanskap seperti di hero).
  // Digating dengan `inView`: listener & rAF loop cuma jalan saat section
  // ini benar-benar terlihat, supaya tidak membebani main thread (dan
  // mengganggu animasi pedang) selagi masih di hero.
  useEffect(() => {
    if (!inView) return;

    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;

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
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;

      if (photoWrapRef.current) {
        photoWrapRef.current.style.transform = `rotateY(${cx * 10}deg) rotateX(${-cy * 10}deg)`;
      }

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
  }, [inView]);

  return (
    <section className="profile-section" id="about">
      {/* Parallax section 2 — logika sama dengan Backdrop (hero), kontennya
          disesuaikan: glow, garis kontur penutup, dan debu emas */}
      <ProfileBackdrop dust={DUST} active={inView} />

      <div className="grain" />

      <span className="profile-divider" aria-hidden="true">
        About.ME
      </span>

      <div className={`profile-frame${inView ? " in-view" : ""}`} ref={frameRef}>
        <div className="profile-photo-wrap" ref={photoWrapRef}>
          {!photoError ? (
            <img
              src="/aliff.png"
              alt={NAME}
              className="profile-photo"
              onError={() => setPhotoError(true)}
            />
          ) : (
            <div className="profile-photo profile-photo-placeholder" aria-hidden="true">
              <span>{NAME.charAt(0)}</span>
            </div>
          )}
          <span className="profile-photo-corner tl" aria-hidden="true" />
          <span className="profile-photo-corner br" aria-hidden="true" />
        </div>

        <div className="profile-info">
          <p className="profile-kicker">MAHASISWA · POLITEKNIK NEGERI JEMBER</p>
          <h2 className="profile-name">{NAME}</h2>
          <p className="profile-motto">&ldquo;{MOTTO}&rdquo;</p>
          <p className="profile-bio">{BIO}</p>

          <div className="profile-block">
            <h3 className="profile-block-title">Interesting With</h3>
            <ul className="profile-tags">
              {INTERESTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="profile-columns">
            <div className="profile-block">
              <h3 className="profile-block-title">Main Skill</h3>
              <ul className="profile-tags">
                {SKILLS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="profile-block">
              <h3 className="profile-block-title">Side Skill</h3>
              <ul className="profile-tags">
                {OTHER_SKILLS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
