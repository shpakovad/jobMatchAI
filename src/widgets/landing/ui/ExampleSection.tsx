import { useTranslations } from "next-intl";
import { divider } from "@/src/shared/styles";
import { AnalysisReport } from "@/src/entities/analysis";

const MOCK_DATA = {
  vacancyName: "React Developer",
  matchPercentage: 82,
  matchedSkills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
  missingSkills: ["Docker", "AWS", "Kubernetes"],
};

export const ExampleSection = () => {
  const t = useTranslations("AnalysisPage");

  const recommendation = t("card.recommendationText");

  const data = {
    ...MOCK_DATA,
    recommendation,
  };

  return (
    <AnalysisReport data={data}>
      <div className={`px-5 py-3 ${divider} bg-muted/20 flex items-center gap-2`}>
        <div className="h-2 w-2 rounded-full bg-destructive" />
        <div className="h-2 w-2 rounded-full bg-amber-600" />
        <div className="h-2 w-2 rounded-full bg-emerald-600" />
        <span className="ml-2 font-mono text-sm text-muted-foreground">{t("card.title")}</span>
      </div>
    </AnalysisReport>
  );
};
