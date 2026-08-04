import { border, divider } from "@/src/shared/styles";
import { useTranslations } from "next-intl";
import { getHowItWorksSteps } from "@/src/widgets/landing/model/HowItWorksData";

export const HowItWorksSection = () => {
  const t = useTranslations("LandingPage.HowItWorksSection");
  return (
    <div className={`pb-20 pt-20 ${divider}`}>
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
                  <p className="text-sm font-semibold text-primary">{step.title}</p>
                </div>
                {step.description ? (
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {step.result?.map((result) => {
                      return (
                        <div
                          key={result.id}
                          className="flex items-center gap-2 rounded-lg border-b border-l border-r border-t border-white/20 bg-slate-950 p-20 px-3 py-2.5 text-sm text-blue-300"
                        >
                          {result.img}
                          <span className="text-primary">{result.title}</span>
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
