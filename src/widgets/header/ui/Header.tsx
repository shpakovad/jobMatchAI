import { Sparkles } from "lucide-react";
import { Button } from "@/src/shared/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-transparent p-4 dark:border-[var(--chart-3)]">
      <div className="flex items-center">
        <Sparkles color="oklch(70.7% 0.165 254.624)" />
        <span className="pl-3 text-sm font-semibold text-slate-100">JobMatch AI</span>
      </div>
      <Button>Button</Button>
    </header>
  );
};

export default Header;
