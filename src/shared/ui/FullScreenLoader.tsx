import { Loader2 } from "lucide-react";

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    </div>
  );
};
