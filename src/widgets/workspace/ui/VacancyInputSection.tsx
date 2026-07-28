import { Textarea } from "@/src/shared/ui/textarea";

export const VacancyInputSection = () => {
  return (
    <div>
      <p className="pb-2 font-mono text-sm text-slate-400">
        Step 2/2 · Paste a job URL or description
      </p>
      <Textarea placeholder="Job URL or description" />
    </div>
  );
};
