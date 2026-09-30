"use client";

import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { useId, type ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { WritingArticleBody } from "./writing/WritingArticleBody";
import { useParagraphAlignment } from "./useParagraphAlignment";

const entryClassName = "grid gap-0.5 rounded-xl border border-border-subtle bg-card p-4 shadow-soft";
const secondaryClassName = "text-muted";

function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className="mt-8 w-full pt-6" aria-labelledby={id}>
      <h2 id={id} className="mb-4 text-base font-normal leading-6 text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function RightColumn() {
  const { locale, t } = useLanguage();
  const { profile } = t;
  const paragraphRef = useParagraphAlignment(profile);
  return (
    <div ref={paragraphRef} className="mx-auto mt-[72px] w-full min-w-0 max-w-2xl px-6 text-base font-normal leading-6 text-muted lg:mt-[104px] lg:px-8" lang={locale}>
      <LanguageSwitcher />
      <header className="flex items-start gap-3 pb-6 sm:gap-4">
        <Image
          src="/nta.PNG"
          alt={profile.name}
          width={64}
          height={64}
          sizes="64px"
          className="h-16 w-16 shrink-0 rounded-12 border border-border-subtle object-cover shadow-avatar"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-base font-normal leading-6 text-foreground">
            <span>{profile.name}</span>
            <Image
              src="/verified.PNG"
              alt={t.verified}
              width={16}
              height={16}
              sizes="16px"
              className="h-4 w-4 shrink-0 object-contain"
            />
          </p>
          <p className="text-base font-normal leading-6">{profile.profession}</p>
          <p className="-mt-1 text-sm font-normal leading-6 text-muted">Universitas Baiturrahmah</p>
        </div>
        <ThemeToggle />
      </header>
      <h1 id="hero-title" className="mt-8 max-w-[38ch] text-balance text-base font-normal leading-6 text-foreground-strong">{profile.headline}</h1>
      <p className="auto-justify mt-1 text-sm font-normal leading-6">{profile.description}</p>

      <ContentSection title={t.sections.about}>
        <WritingArticleBody content={profile.about} className="grid gap-4 text-base font-normal leading-6" paragraphClassName="auto-justify" />
      </ContentSection>

      <ContentSection title={t.sections.education}>
        <div className="grid gap-10">
          {profile.education.map(entry => (
            <article className={entryClassName} key={entry.program}>
              <p className="text-base font-normal leading-6 text-foreground">{entry.program}</p>
              <p>{entry.field} · {entry.institution}</p>
              <p className={secondaryClassName}>{entry.status}</p>
              {entry.clinicalTraining && <p className={secondaryClassName}>{t.clinicalTraining}: {entry.clinicalTraining}</p>}
              <p className="auto-justify mt-2">{entry.description}</p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection title={t.sections.experience}>
        <article className={entryClassName}>
          <p className="text-foreground">{profile.experience.title}</p>
          <p>{profile.experience.location}</p>
          <p className={secondaryClassName}>{profile.experience.duration}</p>
          <p className="auto-justify mt-2">{profile.experience.description}</p>
        </article>
      </ContentSection>

      <ContentSection title={t.sections.organization}>
        <article className={entryClassName}>
          <p className="text-foreground">{profile.organization.name}</p>
          <p>{profile.organization.division}</p>
          <p className={secondaryClassName}>{profile.organization.institution}</p>
        </article>
      </ContentSection>

      <ContentSection title={t.sections.skills}>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {profile.skills.map(skill => (
            <li className="rounded-full border border-border-control bg-card px-3 py-1 text-base font-normal leading-6 text-muted" key={skill}>{skill}</li>
          ))}
        </ul>
      </ContentSection>
    </div>
  );
}
