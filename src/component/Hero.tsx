"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { Profile } from "../content/profile";
import styles from "./Hero.module.css";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => <p className={styles.loading}>Memuat kartu 3D…</p>
});

export default function Hero({ profile }: { profile: Profile }) {
  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLElement>(null);
  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.layout}>
        <header className={styles.info}>
          <div className={styles.infoContent}>
            <p className={styles.eyebrow}>Portofolio</p>
            <h1 id="hero-title" className={styles.name}>{profile.name}</h1>
            {profile.profession && <p className={styles.profession}>{profile.profession}</p>}
            {profile.headline && <p className={styles.headline}>{profile.headline}</p>}
            {profile.description && <p className={styles.description}>{profile.description}</p>}
          </div>
        </header>
        <figure ref={visualRef} className={styles.visual} aria-label={`Kartu identitas ${profile.name}`}>
        </figure>
      </div>
      <div className={styles.stage} aria-hidden="true">
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} eventSource={heroRef} framingElement={visualRef} />
      </div>
    </section>
  );
}
