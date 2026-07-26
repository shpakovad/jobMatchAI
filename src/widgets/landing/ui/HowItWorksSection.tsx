import { TranslationProps } from "@/src/shared/types";
import { getHowItWorksSteps } from "@/src/widgets/landing/model/HowItWorksData";
import { border, divider } from "@/src/shared/styles";

export const HowItWorksSection = ({ translation }: TranslationProps) => {
  return (
    <div className={`pb-20 pt-20 ${divider}`}>
      <h2 className="mb-2 text-center text-2xl font-bold text-slate-100">
        {translation("HowItWorksSection.title")}
      </h2>
      <p className="mb-12 text-center text-sm text-slate-500">
        {translation("HowItWorksSection.description")}
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {getHowItWorksSteps(translation).map((step) => {
          const cardClassName = step.result
            ? `md:col-span-2 bg-card border border-border rounded-xl p-5 ${border}`
            : `bg-card border border-border rounded-xl p-5 flex items-start gap-4 ${border}`;
          return (
            <div className={cardClassName} key={step.id}>
              {!step.result && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-400/20 font-mono text-xs font-bold text-blue-500">
                  {step.id}
                </div>
              )}
              <div>
                <div className="mb-1 flex items-center gap-2 text-blue-500">
                  {step.result && (
                    <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-400/20 font-mono text-xs font-bold text-blue-500">
                      {step.id}
                    </div>
                  )}

                  {step.img}
                  <p className="text-sm font-semibold text-slate-100">{step.title}</p>
                </div>
                {step.description ? (
                  <p className="text-muted-foreground text-sm text-slate-500">{step.description}</p>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {step.result?.map((result) => {
                      return (
                        <div
                          key={result.id}
                          className="flex items-center gap-2 rounded-lg border-b border-l border-r border-t border-white/20 bg-slate-950 p-20 px-3 py-2.5 text-sm text-blue-300"
                        >
                          {result.img}
                          <span className="text-slate-100">{result.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
