import { Sparkles } from "lucide-react";
import { Button } from "@/src/shared/ui/button";

const Header = () => {
  return (
    <header className="flex flex-col items-center justify-between border-b border-transparent pb-4 pt-4 dark:border-[var(--chart-3)]">
      <div className="mb-4 flex w-full justify-end">
        <div
          className="flex h-9 items-center overflow-hidden p-1 text-xs font-semibold text-slate-300 shadow-sm"
          aria-label="Language switcher"
        >
          <span className="px-1 py-1 text-slate-50 shadow-sm hover:cursor-pointer">EN</span>
          <span>/</span>
          <span className="px-1 py-1 text-slate-400 hover:cursor-pointer">RU</span>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-end">
          <Sparkles color="oklch(70.7% 0.165 254.624)" />
          <span className="pl-3 text-sm font-semibold text-slate-100">JobMatch AI</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button>Войти</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
