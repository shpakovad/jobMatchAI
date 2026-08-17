import { useLocale, useTranslations } from "next-intl";

import { AnalysisReport } from "@/src/entities/analysis";
import { divider } from "@/src/shared/styles";

const MOCK_DATA = {
  vacancyName: "React Developer",
  matchPercentage: 82,
  matchedSkills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
  missingSkills: ["Docker", "AWS", "Kubernetes"],
};

const getLocaleMockData = (locale: string) =>
  locale === "en"
    ? {
        ...MOCK_DATA,
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
      }
    : {
        ...MOCK_DATA,
        resumeImprovementSuggestions: [
          "Добавить измеримые показатели продуктового влияния (метрики) для недавней коммерческой Frontend-разработки.",
          "Отразить практический опыт взаимодействия с бэкендом, добавив примеры работы с API и структурами данных.",
        ],
        suggestedResumeBullets: [
          "Разрабатывала интерфейсы на Next.js с использованием TypeScript и паттернов переиспользуемых компонентов.",
          "Интегрировала GraphQL API и оптимизировала доставку страниц (Page Delivery) для пользователей в продакшене.",
        ],
        interviewPreparationQuestions: [
          "Как бы вы реализовали контейнеризацию и деплой данного приложения?",
          "Какие сервисы AWS вы бы выбрали для развертывания Next.js проекта в продакшене?",
        ],
      };

export const ExampleSection = () => {
  const t = useTranslations("AnalysisPage");
  const locale = useLocale();

  const recommendation = t("card.recommendationText");

  const data = {
    ...getLocaleMockData(locale),
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
