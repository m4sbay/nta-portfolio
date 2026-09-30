import type { WritingBlock } from "../types/writing";

export type Education = {
  institution: string;
  program: string;
  field: string;
  status: string;
  clinicalTraining?: string;
  description: string;
};

export type Experience = {
  title: string;
  location: string;
  duration: string;
  description: string;
};

export type Organization = {
  name: string;
  division: string;
  institution: string;
};

export type Profile = {
  name: string;
  profession: string;
  headline: string;
  description: string;
  location?: { name: string; flag?: string };
  about: WritingBlock[];
  education: Education[];
  experience: Experience;
  organization: Organization;
  skills: string[];
  links?: { email?: string };
};

export const profile: Profile = {
  name: "Dwi Sinta Maharani",
  profession: "Dentistry Professional Student",
  headline: "Currently completing clinical dental training at RSGMP Baiturrahmah.",
  description: "Bachelor of Dentistry · Universitas Baiturrahmah",
  about: [
    {
      type: "paragraph",
      segments: [
        "Dentistry student at Universitas",
        { type: "mention", entity: "universitas-baiturrahmah" },
        ", currently completing clinical training at ",
        { type: "mention", entity: "rsgmp-baiturrahmah" },
        " Baiturrahmah."
      ]
    },
    "Previously worked as a Dental Assistant for approximately two years, supporting patient communication, chairside assistance, instrument sterilization, clinical documentation, and teamwork in a clinical environment.",
    "Also involved in the Student Executive Board (BEM), contributing to the Strategic Studies and Action Division (Kastrad)."
  ],
  education: [
    {
      institution: "Universitas Baiturrahmah",
      program: "Dentist Professional Program",
      field: "Dentistry",
      status: "In progress",
      clinicalTraining: "RSGMP Baiturrahmah",
      description: "Currently completing professional clinical training in Dentistry."
    },
    {
      institution: "Universitas Baiturrahmah",
      program: "Bachelor of Dentistry",
      field: "Dentistry",
      status: "Started 2021",
      description: "Completed undergraduate education in Dentistry, including academic and preclinical training in fundamental dental sciences, oral health, and patient care."
    }
  ],
  experience: {
    title: "Dental Assistant",
    location: "Padang, West Sumatra, Indonesia",
    duration: "Approximately 2 years",
    description: "Assisted dentists during daily clinical procedures and supported general clinic operations. Responsibilities included patient preparation, chairside assistance, instrument sterilization, clinical documentation, and maintaining an organized treatment environment."
  },
  organization: {
    name: "Student Executive Board (BEM)",
    division: "Strategic Studies and Action Division (Kastrad)",
    institution: "Universitas Baiturrahmah"
  },
  skills: [
    "Patient Communication",
    "Chairside Assistance",
    "Instrument Sterilization",
    "Clinical Documentation",
    "Teamwork"
  ]
};
