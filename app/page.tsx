import Hero from "../src/component/Hero";
import { profile } from "../src/content/profile";

export default function Home() {
  return (
    <main className="min-h-svh bg-brand">
      <Hero profile={profile} />
    </main>
  );
}
