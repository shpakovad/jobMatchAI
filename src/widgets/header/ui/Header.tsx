import {Sparkles} from "lucide-react";
import {Button} from "@/src/shared/ui/button";

const Header = () =>
{
    return <header className="flex justify-between items-center p-4 border-b border-transparent dark:border-[var(--chart-3)]">
        <div className="flex items-center">
            <Sparkles color="oklch(70.7% 0.165 254.624)" />
            <span className="font-semibold text-sm text-slate-100 pl-3">JobMatch AI</span>
        </div>
        <Button>Button</Button>
    </header>
}

export default Header