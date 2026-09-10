# Wooden Sword — Cursor Follow (React + Vite + Three.js)

Pedang kayu 3D (toon-shaded, garis outline ala komik) melayang di atas latar
diorama dojo senja yang dibuat murni dengan CSS/SVG (lapisan parallax 2D).
Pedang mengejar posisi kursor memakai sistem spring-damper dua tingkat, jadi
gerakannya lentur/mengayun (tidak kaku): grip pedang mengejar kursor lebih
cepat, sementara bilahnya "menyusul" dengan sedikit delay + tilt, seperti efek
cambuk/follow-through.

## Menjalankan

```bash
npm install
npm run dev
```

Buka URL yang muncul di terminal (default http://localhost:5173).

## Build produksi

```bash
npm run build
npm run preview
```

## Struktur penting

- `src/components/Sword.jsx` — logic fisika spring + material toon + outline
- `src/components/Scene.jsx` — canvas three.js, lighting, contact shadow
- `src/components/Backdrop.jsx` — layer 2D (gunung, bambu, kabut) dengan parallax
- `public/models/woodensword.glb` — model pedang kayu yang kamu upload

## Yang bisa diutak-atik

- `stiffness`/`damping` di `Sword.jsx` (spring posisi) — makin kecil damping,
  makin "liar" ayunannya.
- `bStiff`/`bDamp` — kontrol seberapa besar bilah "menyusul" (whip lag).
- Warna kayu ikut warna asli material glTF; ganti gradientMap di
  `useToonGradient()` untuk gaya shading berbeda.
