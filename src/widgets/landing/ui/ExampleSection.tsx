import { TranslationProps } from "@/src/shared/types";
import { border, divider } from "@/src/shared/styles";

const missedItems: Array<string> = ["Docker", "AWS", "Kubernetes"];
const matchedItems: Array<string> = ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"];

export const ExampleSection = ({ translation }: TranslationProps) => {
  return (
    <div className={`pb-20 pt-20`}>
      <h2 className="mb-2 text-center text-2xl font-bold text-slate-100">
        {translation("ExampleSection.title")}
      </h2>
      <p className="mb-12 text-center text-base text-slate-500">
        {translation("ExampleSection.description")}
      </p>

      <div className={`bg-slate-900 ${border} overflow-hidden rounded-2xl`}>
        <div className={`px-5 py-3 ${divider} bg-muted/20 flex items-center gap-2`}>
          <div className="h-2 w-2 rounded-full bg-red-600" />
          <div className="h-2 w-2 rounded-full bg-amber-600" />
          <div className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="ml-2 font-mono text-sm text-slate-500">AI Analysis Result</span>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="mb-2 font-mono text-sm uppercase tracking-wider text-slate-500">
              Vacancy
            </p>
            <p className="font-semibold text-slate-100">React Developer</p>
            <p className="mt-0.5 text-sm text-slate-500">Stripe · San Francisco</p>
            <div className="mt-4">
              <p className="mb-1 font-mono text-sm uppercase tracking-wider text-slate-500">
                Match
              </p>
              <p className="font-mono text-4xl font-bold text-blue-400">82%</p>
            </div>
            <div className="mt-3">
              <p className="mb-1 font-mono text-sm uppercase tracking-wider text-slate-500">
                Skills Matched
              </p>
              <p className="font-mono text-xl font-bold text-slate-100">
                15
                <span className="text-sm font-normal text-slate-500">/18</span>
              </p>
            </div>
          </div>
          <div className="space-y-4 md:col-span-2">
            <div>
              <p className="mb-2 font-mono text-sm uppercase tracking-wider text-slate-500">
                Missing skills
              </p>
              <div className="flex flex-wrap gap-2">
                {missedItems.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 font-mono text-xs text-red-500"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-sm uppercase tracking-wider text-slate-500">
                Matched
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedItems.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-xs text-emerald-400"
                  >
                    React
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-muted/30 border-border rounded-xl border p-4">
              <p className="mb-1 flex items-center gap-1 text-sm text-slate-500">Recommendation</p>
              <p className="text-sm leading-relaxed text-slate-100">
                Improve backend knowledge — focus on cloud infrastructure (AWS/GCP) and
                containerization. A portfolio project using Docker would significantly boost your
                score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
