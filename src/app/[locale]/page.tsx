import { LandingPage } from "@/src/widgets/landing";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-start font-sans">
      <main className="w-full">
        <LandingPage />
      </main>
    </div>
  );
}
