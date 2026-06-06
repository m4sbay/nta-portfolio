import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("../src/component/Lanyard"), {
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#9FA1FF]">
      <section className="relative flex min-h-svh items-center justify-center">
        <div className="h-svh w-screen -translate-y-10 sm:translate-y-0">
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </div>
      </section>
    </main>
  );
}
