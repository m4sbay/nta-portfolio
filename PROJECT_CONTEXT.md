# PROJECT_CONTEXT

> Dokumen ini dibuat agar AI lain (ChatGPT sebagai partner diskusi, Claude Code sebagai eksekutor) dapat langsung memahami project **tanpa** membaca seluruh source code.
> Semua informasi diambil dari codebase per commit `009f475`. Setiap tebakan diberi label **Kemungkinan**.

---

## 1. Project Overview

- **Nama project (package):** `nta-portfolio` (`package.json`)
- **Nama pemilik / judul situs:** **Dwi Sinta Maharani** (`app/layout.tsx` → `metadata.title`)
- **Nama folder repo:** `sintafolio`
- **Tujuan website:** Website portfolio pribadi. Saat ini baru berupa **landing / hero page** dengan sebuah kartu identitas (ID card) 3D interaktif yang menggantung pada tali lanyard.
- **Target pengguna:** Pengunjung portfolio — **Kemungkinan** recruiter, klien, atau audiens umum yang ingin melihat profil Dwi Sinta Maharani.
- **Value utama website:** Kesan pertama yang **immersive dan playful** melalui objek 3D fisik yang bisa di-drag (physics-based), bukan portfolio statis biasa.
- **Status pengembangan saat ini:** **Sangat awal (early stage).** Hanya ada 1 halaman (`/`) yang me-render komponen `Lanyard`. Belum ada navigasi, konten teks, section lain, atau data portfolio.
- **Roadmap yang terlihat dari codebase:**
  - `tailwind.config.ts` sudah mendeklarasikan **font** (`cormorant` serif + `dm` sans) dan **brand color palette** (`#9FA1FF`, `light`, `surface`) yang **belum dipakai** di halaman mana pun → sinyal kuat bahwa akan ada section bertipografi dengan branding warna ungu-lavender.
  - `public/sinta.png` (±6.7 MB) sudah ada tetapi **belum di-referensikan** di kode → **Kemungkinan** foto/aset untuk section "About" atau hero berikutnya.
  - Adanya `jsrepo` (registry component installer) menunjukkan rencana menambah komponen UI siap-pakai lain di masa depan.

---

## 2. Design Philosophy

Filosofi desain yang **terbaca dari codebase**:

- **Immersive & tactile (dapat disentuh):** Elemen sentral adalah objek 3D nyata secara fisik — kartu menggantung, berayun, dan bisa ditarik dengan mouse/touch (drag). Ini menekankan interaksi, bukan sekadar tampilan.
- **Cinematic entrance:** Kartu "jatuh" masuk ke layar dengan animasi drop bergaya (`lanyard-drop`, easing `cubic-bezier(0.2, 0.9, 0.24, 1)`), memberi kesan dramatis saat pertama load.
- **Minimal & fokus tunggal:** Satu layar penuh (`min-h-svh`), satu objek di tengah, background warna solid brand (`#9FA1FF`). Tidak ada clutter — perhatian sepenuhnya ke kartu.
- **Premium / craft-oriented:** Material kartu memakai `meshPhysicalMaterial` dengan `clearcoat`, `metalness`, `roughness`, dan pencahayaan `Environment` + beberapa `Lightformer` → mengejar kesan permukaan mahal/realistis (mirip kartu member/ID premium).
- **Typography-first (rencana):** Deklarasi font serif `Cormorant` (elegan, editorial) + sans `DM` (bersih) menandakan arah desain **elegant editorial** untuk konten teks nanti. **Kemungkinan** — karena font belum di-load.

**Penerapan pada UI saat ini:** hero fullscreen, background lavender, kartu 3D di center, animasi masuk halus. Belum ada penerapan tipografi/warna brand lain karena section teks belum dibangun.

---

## 3. Tech Stack

| Library | Versi | Fungsi | Dipakai di | Alasan dipilih (terbaca / Kemungkinan) |
|---|---|---|---|---|
| **Next.js** | `^14.2.23` (App Router) | Framework React, routing, build, SSR/SSG | seluruh `app/` | Standar modern untuk portfolio React; App Router untuk struktur file-based routing. |
| **React** | `^18.3.1` | UI library | semua komponen | Dasar dari seluruh stack. |
| **React DOM** | `^18.3.1` | Renderer DOM | root | Pasangan React. |
| **TypeScript** | `^5.7.3` | Static typing (`strict: true`) | konfig `.ts/.tsx` di `app/` | Type-safety; `strict` aktif. Catatan: komponen `Lanyard` sendiri ditulis **`.jsx`** (JavaScript). |
| **Tailwind CSS** | `^3.4.17` | Utility-first styling | `app/page.tsx`, `globals.css`, config | Styling cepat; brand color + font di-extend di `tailwind.config.ts`. |
| **@react-three/fiber** | `^8.18.0` | React renderer untuk Three.js (`<Canvas>`, `useFrame`) | `Lanyard.jsx` | Menulis scene 3D secara deklaratif ala React. |
| **@react-three/drei** | `^9.122.0` | Helper R3F: `useGLTF`, `useTexture`, `Environment`, `Lightformer` | `Lanyard.jsx` | Menyederhanakan loading model, tekstur, dan lighting. |
| **@react-three/rapier** | `^1.5.0` | Physics engine (Rapier) untuk R3F: `Physics`, `RigidBody`, joints | `Lanyard.jsx` | Menghasilkan ayunan tali & gravitasi realistis pada lanyard. |
| **three** | `^0.170.0` | Core 3D engine | `Lanyard.jsx` | Fondasi semua rendering 3D (Vector3, materials, curve, dsb). |
| **meshline** | `^3.3.1` | Garis tebal ber-tekstur (`MeshLineGeometry/Material`) | `Lanyard.jsx` | Merender **tali lanyard** sebagai kurva ber-tekstur, bukan garis 1px. |
| **jsrepo** | `^3.7.1` (devDep) | CLI penarik komponen dari registry ke `./src/component` | tooling (`jsrepo.config.mts`) | Komponen `Lanyard` **berasal dari registry** (Kemungkinan: ReactBits) lalu di-vendor ke repo. |
| autoprefixer / postcss | — | Pipeline CSS untuk Tailwind | `postcss.config.mjs` | Wajib untuk Tailwind. |
| eslint + eslint-config-next | — | Linting | `.eslintrc.json` | Standar Next.js (`core-web-vitals`). |

> **Tidak ada** Framer Motion, GSAP, Lenis, atau library animasi lain. Semua animasi non-3D dilakukan lewat **CSS keyframes** (`Lanyard.css`) + physics loop `useFrame` di R3F. Jangan berasumsi library itu ada.

---

## 4. Folder Architecture

```
sintafolio/
├── app/                      # Next.js App Router — halaman & layout
│   ├── layout.tsx            # Root layout + metadata (<html lang="id">)
│   ├── page.tsx              # Halaman "/" — me-render <Lanyard>
│   ├── globals.css           # Tailwind directives + reset global
│   └── components/           # (folder ADA tapi KOSONG — placeholder)
├── src/
│   └── component/            # Komponen hasil vendor via jsrepo
│       ├── Lanyard.jsx       # Komponen 3D lanyard (inti visual project)
│       └── Lanyard.css       # Animasi drop + wrapper styling
├── public/
│   ├── sinta.png             # Aset (belum dipakai, ±6.7MB)
│   └── Lanyard/
│       ├── card.glb          # Model 3D kartu (geometry: card, clip, clamp)
│       └── Lanyard.png       # Tekstur tali lanyard
├── tailwind.config.ts        # Brand colors + font families
├── jsrepo.config.mts         # Konfig registry → output ke ./src/component
├── next.config.mjs           # (kosong / default)
├── global.d.ts               # declare module "*.css"
└── tsconfig.json             # strict TS, path alias belum di-set
```

**Tanggung jawab tiap folder:**
- `app/` — semua routing & entry point halaman (Next.js App Router).
- `app/components/` — **kosong**; disiapkan untuk komponen khusus app (belum dipakai).
- `src/component/` — lokasi output `jsrepo`. Komponen 3D di-vendor ke sini, bukan ditulis manual dari nol.
- `public/` — aset statis yang di-serve langsung dari root URL (mis. `/Lanyard/card.glb`).

> **Catatan penting arsitektur:** Ada **dua** direktori komponen: `app/components/` (kosong) dan `src/component/` (isi Lanyard). Ini karena `jsrepo.config.mts` mengarahkan output ke `./src/component`. Perhatikan **inkonsistensi** ini saat menambah komponen (lihat §16).

---

## 5. Routing

Next.js **App Router**. Halaman yang ada:

| Route | File | Fungsi |
|---|---|---|
| `/` | `app/page.tsx` | Satu-satunya halaman. Hero fullscreen berisi komponen `<Lanyard>` 3D interaktif. |

- **Belum ada** route lain (`/about`, `/work`, `/contact`, dll).
- **Hubungan antar halaman:** tidak ada — project masih single-page. `about`/`work`/`writing`/`contact` di template awal **tidak eksis** di codebase ini; jangan diasumsikan ada.

---

## 6. Component Architecture

Hierarki komponen saat ini sangat dangkal:

```
RootLayout (app/layout.tsx)          ← global shell, <html>/<body>, metadata
 └── Home (app/page.tsx)             ← page "/"
      └── Lanyard (dynamic, ssr:false)   ← wrapper Canvas 3D  [src/component/Lanyard.jsx]
           └── Band                       ← komponen internal (physics + mesh kartu + tali)
```

- **Komponen global:** `RootLayout` (`app/layout.tsx`) — membungkus semua halaman, set `lang="id"`, import `globals.css`.
- **Komponen khusus page:** `Home` (`app/page.tsx`) — struktur `<main><section><div>` untuk memusatkan Canvas.
- **Komponen reusable / vendor:** `Lanyard` — komponen ber-props (`position`, `gravity`, `fov`, `transparent`) sehingga bisa dikonfigurasi ulang. Di-import secara **dynamic** dengan `ssr: false` karena butuh `window`/WebGL (tidak bisa di-render di server).
- **Sub-komponen internal:** `Band` (didefinisikan di file yang sama) — menangani physics joints, geometry tali, material kartu, dan interaksi drag. **Tidak diekspor**; hanya dipakai oleh `Lanyard`.

Belum ada komponen reusable seperti Button, Card, Section, Navbar — semuanya masih menunggu dibangun.

---

## 7. State Management

Sangat sederhana, **hanya local state** dengan React hooks. Tidak ada Context, Redux, Zustand, atau global store.

- **`Lanyard` component:**
  - `isMobile` (`useState`) — dihitung dari `window.innerWidth < 768`, di-update via listener `resize` (`useEffect`). Dipakai untuk menurunkan kualitas/performa di mobile (`dpr`, `timeStep`, `clearcoat`, jumlah segmen kurva).
- **`Band` component:**
  - Banyak `useRef` (`band`, `fixed`, `j1`–`j3`, `card`) → referensi ke RigidBody & mesh untuk physics.
  - `useState` untuk objek Three.js yang harus persist antar-render: `curve` (CatmullRom), `dragged`, `hovered`.
  - `useFrame` (R3F) — **game loop**: menjalankan physics/lerp tiap frame, meng-update posisi kurva tali dan angular velocity kartu.
- **Data flow:** props mengalir dari `page.tsx` → `Lanyard` → `Band`. Tidak ada data fetching, tidak ada API. Semua "data" adalah aset statis (`.glb`, `.png`).

---

## 8. Animation System

Ini area terkuat project. Ada **dua sistem animasi** yang berjalan bersamaan:

### A. CSS Keyframe Animation (`src/component/Lanyard.css`)
- **`lanyard-drop`** — animasi masuk (entrance). Kartu jatuh dari `translateY(-65vh) scale(0.98)` → sedikit overshoot ke `translateY(3vh)` → settle di `0`. Durasi `1100ms`, easing `cubic-bezier(0.2, 0.9, 0.24, 1)` (ease-out dramatis dengan sedikit bounce). `opacity` 0→1 untuk fade-in.

### B. Real-time 3D Physics (`Lanyard.jsx`, via Rapier + `useFrame`)
- **Gravity & swing:** `Physics gravity={[0,-40,0]}` membuat kartu berayun natural.
- **Rope/tali:** 3 `useRopeJoint` menyambung 4 titik (`fixed → j1 → j2 → j3`) + 1 `useSphericalJoint` (`j3 → card`), menghasilkan rantai fisika tali.
- **Drag interaction:** `onPointerDown/Up` + unproject pointer ke world-space → kartu jadi `kinematicPosition` saat di-drag, kembali `dynamic` saat dilepas.
- **Smoothing (lerp):** titik `j1`/`j2` di-lerp dengan kecepatan tergantung jarak (clamp 0.1–1) agar tali bergerak halus, bukan patah-patah.
- **Curve tali:** `CatmullRomCurve3` (tipe `chordal`), di-render via `meshline` dengan tekstur berulang (`repeat=[-4,1]`).
- **Self-righting:** angular velocity kartu dikoreksi (`ang.y - rot.y * 0.25`) supaya kartu perlahan menghadap depan.
- **Hover cursor:** berubah `grab`/`grabbing`/`auto` sesuai state.

### Optimasi animasi per device
`isMobile` menurunkan `dpr` (1.5 vs 2), memperbesar `timeStep` physics (1/30 vs 1/60), mematikan `clearcoat`, dan mengurangi segmen kurva (16 vs 32).

> **Tidak ada** page transition, scroll animation, stagger, parallax, atau reveal library — karena belum ada halaman/konten lain. Semua animasi saat ini terpusat pada objek lanyard.

---

## 9. Styling System

Pendekatan **hybrid**: Tailwind utilities untuk layout halaman + CSS file terpisah untuk animasi/3D wrapper.

- **Tailwind convention:** utility classes langsung di JSX (`min-h-svh`, `overflow-hidden`, `flex items-center justify-center`, `-translate-y-10 sm:translate-y-0`).
- **Responsive strategy:** mobile-first, breakpoint `sm:` dipakai di `page.tsx`; di JS pakai ambang `768px` untuk `isMobile`.
- **Custom CSS:** `Lanyard.css` untuk `.lanyard-wrapper` + keyframe (hal yang tidak nyaman ditulis via Tailwind). `globals.css` untuk reset (`margin:0`, `width/min-height 100%`, `scroll-behavior: smooth`).
- **Viewport units:** memakai `svh`/`100svh` (small viewport height) agar aman terhadap address bar mobile.
- **Color palette (`tailwind.config.ts`):**
  - `brand.DEFAULT = #9FA1FF` (lavender/periwinkle — dipakai sebagai background di `page.tsx` via `bg-[#9FA1FF]`)
  - `brand.light = #B5BAFF`
  - `brand.surface = #EEEEFF`
  - *(saat ini background ditulis hardcoded `bg-[#9FA1FF]`, belum via token `bg-brand`.)*
- **Typography (`tailwind.config.ts`):** `font-cormorant` (serif) & `font-dm` (sans) via CSS var `--font-cormorant`/`--font-dm`. **Belum aktif** — var belum di-inject (belum ada `next/font` di layout).
- **Spacing / radius / shadow / blur / z-index:** belum ada sistem eksplisit. Yang ada baru `z-index: 0` pada `.lanyard-wrapper` dan `blur={0.75}` pada `Environment` 3D (bukan CSS blur).

---

## 10. Reusable Pattern

Karena project masih kecil, pola reusable yang **sudah** ada baru sedikit:

- **Configurable component via props:** `Lanyard({ position, gravity, fov, transparent })` — pola komponen 3D yang bisa dikonfigurasi ulang tanpa mengubah internal.
- **Shared physics config object:** `segmentProps` di-spread ke banyak `RigidBody` (`{...segmentProps}`) — pola DRY untuk properti fisika berulang.
- **Device-adaptive rendering:** pola `isMobile ? lowQuality : highQuality` diterapkan konsisten di beberapa properti.
- **Dynamic import untuk komponen client-only:** `dynamic(() => import(...), { ssr:false })` — pola untuk komponen yang butuh WebGL/`window`.

Pola yang **belum** ada (dan kemungkinan dibutuhkan nanti): reusable Section, Card, Button, Typography wrapper, animation wrapper, page template. Ini area yang harus dibangun dengan hati-hati agar konsisten.

---

## 11. Content Management

- **Belum ada sistem content management.** Tidak ada folder `content/`, CMS, MDX, JSON data, atau collection untuk `work`/`writing`/`project`.
- **Aset statis** disimpan di `public/` dan direferensikan via path absolut (`/Lanyard/card.glb`, `/Lanyard/Lanyard.png`).
- **Cara menambah aset:** taruh file di `public/`, referensikan dari root URL.
- **Rendering konten:** saat ini tidak ada teks konten dinamis — hanya objek 3D. **Kemungkinan** section konten akan ditambahkan sebagai komponen/JSX langsung, atau lewat data file di masa depan (belum terlihat polanya).

---

## 12. Naming Convention

Berdasarkan file yang ada:

- **File halaman/layout:** lowercase Next.js convention → `page.tsx`, `layout.tsx`, `globals.css`.
- **File komponen:** PascalCase → `Lanyard.jsx`, `Lanyard.css`.
- **Folder:** lowercase → `app/`, `src/component/`, `public/`. (Perhatikan: `component` **singular** di `src`, `components` **plural** di `app` — inkonsisten.)
- **Komponen React:** PascalCase → `RootLayout`, `Home`, `Lanyard`, `Band`.
- **Hook state:** camelCase, kadang tuple `[state, setState]` bergaya singkat → `[dragged, drag]`, `[hovered, hover]` (bukan `setDragged`).
- **Variable:** camelCase (`isMobile`, `clampedDistance`, `segmentProps`).
- **Type/Interface:** minim; hanya `Metadata` (dari Next) dan inline `Readonly<{ children }>`. Belum ada custom type/interface project.

---

## 13. Code Style

- **Functional components** + hooks (tidak ada class component).
- **TypeScript strict** di layer `app/` — namun komponen 3D ditulis **`.jsx` (untyped)**, diadopsi apa adanya dari registry.
- **Composition:** halaman disusun dari komponen (`Home` → `Lanyard` → `Band`).
- **Client vs Server:** `'use client'` hanya di `Lanyard.jsx`; `page.tsx`/`layout.tsx` server components.
- **Separation of concern:** styling animasi di CSS terpisah, logika 3D di komponen, layout di page.
- **Gaya ringkas:** ada penggunaan comma-operator dan arrow inline yang padat (mis. `onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}`) — gaya asli dari sumber komponen, **bukan** konvensi yang harus ditiru untuk kode baru.
- **ESLint:** `next/core-web-vitals`; di `Lanyard.jsx` ada `/* eslint-disable react/no-unknown-property */` (wajar untuk R3F).

---

## 14. Existing Features

Dikelompokkan per halaman:

### Halaman `/` (Home)
- ✅ Hero fullscreen dengan background brand lavender (`#9FA1FF`).
- ✅ Kartu ID 3D (`card.glb`: mesh `card`, `clip`, `clamp`) menggantung pada tali lanyard bertekstur.
- ✅ Physics realistis: gravitasi, ayunan tali, joint rantai.
- ✅ Interaksi **drag** kartu dengan mouse & touch (pointer capture).
- ✅ Animasi entrance "drop" saat load.
- ✅ Hover cursor (`grab`/`grabbing`).
- ✅ Lighting environment (`Environment` + 4 `Lightformer`) + material premium (clearcoat/metalness).
- ✅ Optimasi performa mobile (dpr, timestep, kualitas material, segmen kurva).
- ✅ Responsive vertical offset (`-translate-y-10 sm:translate-y-0`).

---

## 15. Features In Progress

Dari sinyal codebase (bukan kode aktif):

- 🚧 **Sistem tipografi brand** — font `Cormorant` + `DM` dideklarasikan di Tailwind tapi **belum di-load** (`next/font` belum ada di `layout.tsx`, CSS var belum ada). Menunggu section teks.
- 🚧 **Brand color tokens** — `brand.light`/`brand.surface` didefinisikan tapi belum dipakai; background masih hardcoded hex.
- 🚧 **Aset `sinta.png`** — sudah di-commit (±6.7 MB) tapi belum dirender. **Kemungkinan** untuk section About/hero foto.
- 🚧 **`app/components/`** — folder disiapkan namun kosong.

> **Tidak ditemukan** komentar `TODO`/`FIXME`/placeholder eksplisit di kode.

---

## 16. Known Issues

Area yang berpotensi bermasalah / belum selesai:

1. **Inkonsistensi lokasi komponen.** `jsrepo.config.mts` menaruh komponen di `./src/component`, sedangkan Next menyiapkan `./app/components/` (kosong). Menambah komponen tanpa keputusan konvensi akan memperparah kebingungan. → **Rekomendasi:** pilih satu (mis. `src/component/`) dan konsisten.
2. **Tailwind `content` glob tidak mencakup `src/`.** Di `tailwind.config.ts`, glob hanya `./app/**` dan `./components/**`. Komponen di **`./src/component/`** tidak ter-scan Tailwind. Saat ini aman karena `Lanyard.jsx` memakai CSS murni (`.lanyard-wrapper`), **tetapi** jika nanti menambahkan class Tailwind di `src/`, class-nya bisa ter-purge/hilang. → **Perlu** menambah `./src/**/*.{js,ts,jsx,tsx,mdx}` ke `content`.
3. **`app/components/` kosong** — noise struktur; putuskan dipakai atau dihapus.
4. **Aset besar tanpa optimasi.** `public/sinta.png` ±6.7 MB & `card.glb` ±0.6 MB. Jika `sinta.png` dipakai nanti, perlu di-compress / pakai `next/image`.
5. **`.DS_Store` ter-commit** (root & `public/`) — sebaiknya masuk `.gitignore` dan dihapus dari tracking.
6. **Untyped 3D component** — `Lanyard.jsx` tanpa TypeScript; props tidak tervalidasi tipe meski project `strict`.
7. **`tsconfig` tanpa path alias** — import Lanyard memakai relative `../src/component/Lanyard`; belum ada alias `@/`.

---

## 17. Future Direction

Prediksi arah berdasarkan struktur (semua **Kemungkinan**, disimpulkan dari aset & config yang sudah ada):

- Menambah **section konten** di bawah/berdampingan dengan hero: About (memakai `sinta.png`), Work/Projects, Contact.
- Mengaktifkan **tipografi editorial** (Cormorant serif + DM sans) → arah desain elegant & premium.
- Menerapkan **brand color tokens** (`brand.*`) secara konsisten menggantikan hex hardcoded.
- Menambah **navigasi / multi-section scroll** — kemungkinan tetap single-page scroll (mengingat `scroll-behavior: smooth` sudah di-set) daripada multi-route.
- Menggunakan **jsrepo** untuk menambah komponen UI/animasi siap-pakai lain (registry-driven).

---

## 18. AI Collaboration Guide

Pedoman untuk AI (ChatGPT untuk diskusi, Claude Code untuk eksekusi) saat membantu project ini:

1. **Jangan mengubah desain visual lanyard** tanpa diminta — objek 3D ini adalah *centerpiece* dan sudah tuned (lighting, material, physics, animasi drop).
2. **Pertahankan design language:** minimal, immersive, premium, lavender (`#9FA1FF`), calon tipografi Cormorant/DM. Jangan menambah warna/gaya yang bertabrakan.
3. **Utamakan reusable component & hindari duplikasi.** Sebelum membuat komponen baru, cek apakah bisa jadi komponen generik (Section/Card/Button/Typography). Jangan buat komponen kembar.
4. **Tetapkan satu lokasi komponen** (rekomendasi `src/component/`) dan konsisten; jangan menyebar komponen ke dua tempat.
5. **Gunakan TypeScript (`.tsx`) untuk kode baru** dengan `strict` — kecuali saat mengedit `Lanyard.jsx` yang memang di-vendor untyped.
6. **Jangan mengubah arsitektur besar tanpa alasan** (mis. menambah Redux/Context) — kebutuhan state saat ini cukup dengan local state.
7. **Hindari over-engineering & dependency baru** yang tidak perlu. Stack sengaja ramping (tidak ada Framer/GSAP/Lenis) — pertimbangkan CSS/`useFrame` dulu.
8. **Prioritaskan performa** — project ini berat (WebGL + physics). Pertahankan pola `isMobile` untuk menurunkan beban di perangkat lemah; lazy-load/`ssr:false` untuk komponen client-only.
9. **Jika menambah class Tailwind di `src/`,** perbaiki dulu `content` glob di `tailwind.config.ts` (lihat §16.2), atau class akan ter-purge.
10. **Ikuti konvensi yang ada:** PascalCase komponen, file page/layout lowercase, brand token dari config, `svh` untuk viewport height.
11. **Jangan menebak konten** (nama project, section, teks) — sebagian besar konten belum ada. Konfirmasi ke user sebelum mengarang copy.

---

## 19. Current Progress Summary

**Sudah selesai:**
- Setup project Next.js 14 (App Router) + TypeScript + Tailwind 3.
- Halaman `/` dengan komponen 3D lanyard interaktif lengkap: physics, drag, entrance animation, lighting, material premium, optimasi mobile.
- Konfigurasi brand (warna + font) dideklarasikan di Tailwind.
- Aset 3D (`card.glb`, tekstur tali) dan `sinta.png` sudah ada di `public/`.

**Sedang dibangun / disiapkan (belum aktif):**
- Sistem tipografi (font belum di-load).
- Penerapan brand color tokens (masih hardcoded).
- Konten/section tambahan (About/Work/Contact) — belum ada.

**Prioritas berikutnya (saran):**
1. Aktifkan font via `next/font` (inject `--font-cormorant`/`--font-dm`) agar tipografi siap.
2. Rapikan konvensi folder komponen + perbaiki Tailwind `content` glob untuk `src/`.
3. Bangun section pertama non-hero (kemungkinan About memakai `sinta.png`) sebagai template pola reusable.
4. Ganti background/warna hardcoded ke token `brand.*`.

---

## 20. Development Principles

Pedoman prinsip untuk AI dan developer:

- **Reusable over duplication** — buat komponen generik, jangan menyalin.
- **Minimal dependencies** — tambah library hanya jika benar-benar perlu; CSS/`useFrame` lebih dulu sebelum library animasi.
- **Performance matters** — WebGL + physics itu mahal; jaga pola adaptif `isMobile`, lazy-load client-only, optimasi aset besar.
- **Smooth, premium interaction** — kualitas animasi setara aspirasi "Apple-quality": halus, ada easing, terasa fisik.
- **Design language consistency** — minimal, immersive, lavender, editorial typography.
- **Maintainable & clean TypeScript** — `strict`, functional components, separation of concern (styling ↔ logic ↔ layout).
- **Consistent naming** — ikuti konvensi §12.
- **No guessing** — jangan mengarang konten/arsitektur; konfirmasi dulu bila informasi tidak ada di codebase.
- **Progressive enhancement** — bangun di atas fondasi yang ada (brand tokens, font, folder) alih-alih mengganti arsitektur.

---

*Dibuat oleh Claude Code dari analisis codebase. Perbarui dokumen ini setiap kali arsitektur, stack, atau konvensi berubah agar tetap menjadi sumber konteks yang akurat bagi AI partner.*
