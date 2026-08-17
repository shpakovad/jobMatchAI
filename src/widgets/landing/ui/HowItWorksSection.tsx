import { useTranslations } from "next-intl";

import { border, divider } from "@/src/shared/styles";
import { getHowItWorksSteps } from "@/src/widgets/landing/model/HowItWorksData";

export const HowItWorksSection = () => {
  const t = useTranslations("LandingPage.HowItWorksSection");
  return (
    <div className={`pb-10 pt-10 sm:pb-20 sm:pt-20 ${divider}`}>
      <h2 className="mb-2 text-center text-2xl font-bold text-primary">{t("title")}</h2>
      <p className="mb-12 text-center text-base text-muted-foreground">{t("description")}</p>
      <div className="grid gap-6 md:grid-cols-2">
        {getHowItWorksSteps(t).map((step) => {
          const cardClassName = step.result
            ? `md:col-span-2 bg-card border border-border rounded-xl p-5 ${border}`
            : `bg-card border border-border rounded-xl p-5 flex items-start gap-4 ${border}`;
          return (
            <div className={cardClassName} key={step.id}>
              {!step.result && (
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-400/20 font-mono text-xs font-bold text-blue-500 sm:h-8 sm:w-8">
                  {step.id}
                </div>
              )}
              <div>
                <div className="mb-1 flex items-center gap-2 text-blue-500">
                  {step.result && (
                    <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-400/20 font-mono text-xs font-bold text-blue-500 sm:h-8 sm:w-8">
                      {step.id}
                    </div>
                  )}

                  {step.img}
                  <p className="text-xs font-semibold text-primary sm:text-sm">{step.title}</p>
                </div>
                {step.description ? (
                  <p className="text-xs text-muted-foreground sm:text-sm">{step.description}</p>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {step.result?.map((result) => {
                      return (
                        <div
                          key={result.id}
                          className="flex flex-col items-center gap-2 rounded-lg border-b border-l border-r border-t border-white/20 bg-slate-950 p-20 px-3 py-2.5 text-xs text-blue-300 sm:flex-row sm:text-sm"
                        >
                          {result.img}
                          <span className="text-center text-primary sm:text-start">
                            {result.title}
                          </span>
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
