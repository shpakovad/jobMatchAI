import { useTranslations } from "next-intl";

import { AnalysisReport } from "@/src/entities/analysis";
import { divider } from "@/src/shared/styles";

const MOCK_DATA = {
  vacancyName: "React Developer",
  matchPercentage: 82,
  matchedSkills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
  missingSkills: ["Docker", "AWS", "Kubernetes"],
};

export const ExampleSection = () => {
  const t = useTranslations("AnalysisPage");
  const prompt = useTranslations("LandingPage.ExampleSection");

  const recommendation = t("card.recommendationText");
  const suggestion = prompt.raw("resumeImprovementSuggestions");
  const bullets = prompt.raw("suggestedResumeBullets");
  const questions = prompt.raw("interviewPreparationQuestions");

  const data = {
    ...MOCK_DATA,
    resumeImprovementSuggestions: suggestion,
    suggestedResumeBullets: bullets,
    interviewPreparationQuestions: questions,
    recommendation,
  };

  return (
    <AnalysisReport data={data}>
      <div className={`px-5 py-3 ${divider} bg-muted/20 flex items-center gap-2`}>
        <div className="h-1 w-1 rounded-full bg-destructive sm:h-2 sm:w-2" />
        <div className="h-1 w-1 rounded-full bg-amber-600 sm:h-2 sm:w-2" />
        <div className="h-1 w-1 rounded-full bg-emerald-600 sm:h-2 sm:w-2" />
        <span className="ml-2 font-mono text-xs text-muted-foreground sm:text-sm">
          {t("card.title")}
        </span>
      </div>
    </AnalysisReport>
  );
};
