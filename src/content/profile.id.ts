import { profile as english, type Profile } from "./profile";

export const profile: Profile = {
  ...english,
  profession: "Mahasiswa Profesi Dokter Gigi",
  headline: "Sedang menjalani pendidikan klinis kedokteran gigi di RSGMP Baiturrahmah.",
  description: "Sarjana Kedokteran Gigi · Universitas Baiturrahmah",
  about: [
    { type: "paragraph", segments: [
      "Mahasiswa kedokteran gigi di Universitas",
      { type: "mention", entity: "universitas-baiturrahmah" },
      ", saat ini menjalani pendidikan klinis di ",
      { type: "mention", entity: "rsgmp-baiturrahmah" },
      " Baiturrahmah."
    ] },
    "Sebelumnya bekerja sebagai asisten dokter gigi selama sekitar dua tahun, membantu komunikasi dengan pasien, pendampingan tindakan, sterilisasi instrumen, dokumentasi klinis, serta kerja sama tim di lingkungan klinis.",
    "Juga aktif di Badan Eksekutif Mahasiswa (BEM), berkontribusi dalam kegiatan Divisi Kajian Strategis dan Aksi (Kastrad)."
  ],
  education: [
    { ...english.education[0], program: "Program Profesi Dokter Gigi", field: "Kedokteran Gigi", status: "Sedang berlangsung", description: "Sedang menempuh pendidikan klinis profesi kedokteran gigi." },
    { ...english.education[1], program: "Sarjana Kedokteran Gigi", field: "Kedokteran Gigi", status: "Mulai 2021", description: "Telah menyelesaikan pendidikan sarjana kedokteran gigi, mencakup pembelajaran akademik dan praklinis dalam ilmu dasar kedokteran gigi, kesehatan mulut, dan perawatan pasien." }
  ],
  experience: {
    ...english.experience,
    title: "Asisten Dokter Gigi",
    location: "Padang, Sumatera Barat, Indonesia",
    duration: "Sekitar 2 tahun",
    description: "Membantu dokter gigi dalam tindakan klinis sehari-hari dan mendukung operasional klinik. Tanggung jawab mencakup persiapan pasien, pendampingan tindakan, sterilisasi instrumen, dokumentasi klinis, dan menjaga kerapian lingkungan perawatan."
  },
  organization: {
    ...english.organization,
    name: "Badan Eksekutif Mahasiswa (BEM)",
    division: "Divisi Kajian Strategis dan Aksi (Kastrad)"
  },
  skills: ["Komunikasi dengan Pasien", "Pendampingan Tindakan", "Sterilisasi Instrumen", "Dokumentasi Klinis", "Kerja Sama Tim"]
};
