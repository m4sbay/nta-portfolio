import { profile as en } from "../content/profile";
import { profile as id } from "../content/profile.id";
import { getFirstParagraph } from "../lib/writing";

export const locales = ["en", "id"] as const;
export type Locale = typeof locales[number];
export const localeCookie = "sintafolio-locale";
export function parseLocale(value?: string): Locale { return value === "id" ? "id" : "en"; }

export const translations = {
  en: {
    profile: en,
    contact: { intro: "Find me on", or: "or" },
    sections: { about: "About", education: "Education", experience: "Experience", organization: "Organization", skills: "Skills" },
    clinicalTraining: "Clinical training",
    verified: "Verified profile",
    identityCard: "Identity card of",
    language: "Language",
    languages: { en: "English", id: "Bahasa Indonesia" },
    theme: { light: "Switch to light mode", dark: "Switch to dark mode", toggle: "Switch color theme" },
    metadata: { title: "Sinta Maharani Portfolio", description: `${getFirstParagraph(en.about)} With previous experience as a Dental Assistant.` }
  },
  id: {
    profile: id,
    contact: { intro: "Temukan saya di", or: "atau" },
    sections: { about: "Tentang", education: "Pendidikan", experience: "Pengalaman", organization: "Organisasi", skills: "Keahlian" },
    clinicalTraining: "Pendidikan klinis",
    verified: "Profil terverifikasi",
    identityCard: "Kartu identitas",
    language: "Bahasa",
    languages: { en: "English", id: "Bahasa Indonesia" },
    theme: { light: "Beralih ke mode terang", dark: "Beralih ke mode gelap", toggle: "Ganti tema warna" },
    metadata: { title: "Portofolio Sinta Maharani", description: `${getFirstParagraph(id.about)} Berpengalaman sebagai asisten dokter gigi.` }
  }
};
