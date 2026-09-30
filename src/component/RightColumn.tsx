import Image from "next/image";
import type { ReactNode } from "react";
import type { Profile } from "../content/profile";

const entryClassName = "grid gap-0.5 rounded-xl border border-border-subtle bg-white p-4 shadow-soft";
const secondaryClassName = "text-muted opacity-[0.82]";

function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  const id = title.toLowerCase().replaceAll(" ", "-");
  return (
    <section className="mt-8 w-full pt-6" aria-labelledby={id}>
      <h2 id={id} className="mb-4 text-base font-normal leading-6 text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function RightColumn({ profile }: { profile: Profile }) {
  return (
    <div className=" mx-auto w-full min-w-0 max-w-2xl px-6 text-base font-normal leading-6 text-muted lg:px-8" lang="en">
      <header className="flex items-center gap-4 pb-6 max-[479px]:items-start">
        <Image
          src="/nta.PNG"
          alt={profile.name}
          width={64}
          height={64}
          sizes="64px"
          className="h-16 w-16 shrink-0 rounded-full border border-border-subtle object-cover shadow-avatar"
        />
        <div className="min-w-0">
          <p className="text-base font-normal leading-6 text-foreground">{profile.name}</p>
          <p className="text-base font-normal leading-6">{profile.profession}</p>
          <p className="-mt-1 text-sm font-normal leading-6 text-muted opacity-[0.82]">Universitas Baiturrahmah</p>
        </div>
      </header>
      <h1 id="hero-title" className="mt-8 max-w-[38ch] text-balance text-base font-normal leading-6 text-foreground-strong">{profile.headline}</h1>
      <p className="mt-1 text-sm font-normal leading-6">{profile.description}</p>

      <ContentSection title="About">
        <div className="grid gap-4">
          {profile.about.map(paragraph => <p key={paragraph} className="text-base font-normal leading-6">{paragraph}</p>)}
        </div>
      </ContentSection>

      <ContentSection title="Education">
        <div className="grid gap-10">
          {profile.education.map(entry => (
            <article className={entryClassName} key={entry.program}>
              <p className="text-base font-normal leading-6 text-foreground">{entry.program}</p>
              <p>{entry.field} · {entry.institution}</p>
              <p className={secondaryClassName}>{entry.status}</p>
              {entry.clinicalTraining && <p className={secondaryClassName}>Clinical training: {entry.clinicalTraining}</p>}
              <p className="mt-2">{entry.description}</p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Experience">
        <article className={entryClassName}>
          <p className="text-foreground">{profile.experience.title}</p>
          <p>{profile.experience.location}</p>
          <p className={secondaryClassName}>{profile.experience.duration}</p>
          <p className="mt-2">{profile.experience.description}</p>
        </article>
      </ContentSection>

      <ContentSection title="Organization">
        <article className={entryClassName}>
          <p className="text-foreground">{profile.organization.name}</p>
          <p>{profile.organization.division}</p>
          <p className={secondaryClassName}>{profile.organization.institution}</p>
        </article>
      </ContentSection>

      <ContentSection title="Skills">
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {profile.skills.map(skill => (
            <li className="rounded-full border border-border-control bg-white px-3 py-1 text-base font-normal leading-6 text-muted" key={skill}>{skill}</li>
          ))}
        </ul>
      </ContentSection>
    </div>
  );
}
