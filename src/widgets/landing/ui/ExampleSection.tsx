import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { border, divider } from "@/src/shared/styles";

const missedItems: Array<string> = ["Docker", "AWS", "Kubernetes"];
const matchedItems: Array<string> = ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"];

export const ExampleSection = () => {
  const t = useTranslations("LandingPage.ExampleSection");

  return (
    <div className={`pb-20 pt-20`}>
      <h2 className="mb-2 text-center text-2xl font-bold text-primary">{t("title")}</h2>
      <p className="mb-12 text-center text-base text-muted-foreground">{t("description")}</p>

      <div className={`bg-card ${border} overflow-hidden rounded-2xl`}>
        <div className={`px-5 py-3 ${divider} bg-muted/20 flex items-center gap-2`}>
          <div className="h-2 w-2 rounded-full bg-destructive" />
          <div className="h-2 w-2 rounded-full bg-amber-600" />
          <div className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="ml-2 font-mono text-sm text-muted-foreground">{t("card.title")}</span>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="mb-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
              {t("card.vacancyLabel")}
            </p>
            <p className="font-semibold text-primary">React Developer</p>
            <p className="mt-0.5 text-sm text-muted-foreground">Stripe</p>
            <div className="mt-4">
              <p className="mb-1 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("card.matchLabel")}
              </p>
              <p className="font-mono text-4xl font-bold text-blue-400">82%</p>
            </div>
            <div className="mt-3">
              <p className="mb-1 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("card.skillsMatchedLabel")}
              </p>
              <p className="font-mono text-xl font-bold text-primary">
                15
                <span className="text-sm font-normal text-muted-foreground">/18</span>
              </p>
            </div>
          </div>
          <div className="space-y-4 md:col-span-2">
            <div>
              <p className="mb-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("card.missingSkillsLabel")}
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
              <p className="mb-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("card.matchedSkillsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedItems.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-xs text-emerald-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-muted/30 border-border rounded-xl border p-4">
              <p className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Info size={18} />
                {t("card.recommendationLabel")}
              </p>
              <p className="text-sm leading-relaxed text-primary">{t("card.recommendationText")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
