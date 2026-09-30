"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "./LanguageProvider";
import RightColumn from "./RightColumn";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => null
});

export default function Hero() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={heroRef}
      className="relative isolate grid min-h-svh items-stretch lg:h-dvh lg:min-h-0 lg:overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="grid w-full items-stretch lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex w-full min-w-0 flex-col justify-center break-words bg-surface px-[clamp(1.25rem,5vw,5rem)] py-[clamp(2.5rem,6vw,6rem)] text-base leading-6 text-muted lg:col-start-2 lg:row-start-1 lg:h-full lg:min-h-0 lg:justify-start lg:overflow-y-auto lg:overscroll-y-contain lg:[scrollbar-gutter:stable]">
          <RightColumn />
        </div>
        <figure
          ref={visualRef}
          className="relative m-0 grid min-h-[clamp(28rem,125vw,44rem)] w-full min-w-0 lg:col-start-1 lg:row-start-1 lg:h-full lg:min-h-0 lg:overflow-hidden"
          aria-label={`${t.identityCard} ${t.profile.name}`}
        >
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} eventSource={visualRef} />
        </figure>
      </div>
    </section>
  );
}
