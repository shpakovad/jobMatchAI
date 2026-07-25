import { LandingPage } from "@/src/widgets/landing";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-start bg-zinc-50 font-sans dark:bg-[#0d1117]">
      <main className="w-full">
        <LandingPage />
      </main>
    </div>
  );
}
