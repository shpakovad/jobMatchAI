import { useTranslations } from "next-intl";

import { AnalysisReport } from "@/src/entities/analysis";
import { divider } from "@/src/shared/styles";

const MOCK_DATA = {
  vacancyName: "React Developer",
  matchPercentage: 82,
  matchedSkills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
  missingSkills: ["Docker", "AWS", "Kubernetes"],
  resumeImprovementSuggestions: [
    "Add measurable product impact for recent frontend work.",
    "Show practical backend collaboration with API and data examples.",
  ],
  suggestedResumeBullets: [
    "Built Next.js interfaces with TypeScript and reusable component patterns.",
    "Integrated GraphQL APIs and improved page delivery for production users.",
  ],
  interviewPreparationQuestions: [
    "How would you containerize and deploy this application?",
    "Which AWS services would you choose for a Next.js production setup?",
  ],
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
