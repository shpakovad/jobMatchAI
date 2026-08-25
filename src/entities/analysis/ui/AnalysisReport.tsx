"use client";

import { CheckCircle2, CircleHelp, FilePenLine, Info, ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { ValidatedAnalysisResult } from "@/src/entities/analysis/model/validation";
import { border } from "@/src/shared/styles";

interface AnalysisReportProps {
  data: ValidatedAnalysisResult;
  children?: ReactNode;
}

interface ReportListSectionProps {
  title: string;
  items: string[];
  icon: ReactNode;
  markerClassName: string;
}

const ReportListSection = ({ title, items, icon, markerClassName }: ReportListSectionProps) => {
  const t = useTranslations("AnalysisPage");

  return (
    <section className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="border-border bg-background/60 flex size-8 shrink-0 items-center justify-center rounded-lg border text-blue-400">
          {icon}
        </span>
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
          {title}
        </h3>
      </div>
      {Boolean(items.length) ? (
        <ol className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-3 text-xs leading-relaxed text-primary sm:text-sm"
            >
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-xs ${markerClassName}`}
              >
                {index + 1}
              </span>
              <span className="text-xs sm:text-sm">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">{t("card.emptyListLabel")}</p>
      )}
    </section>
  );
};

export const AnalysisReport = ({ data, children }: AnalysisReportProps) => {
  const t = useTranslations("AnalysisPage");

  const {
    vacancyName,
    matchPercentage,
    matchedSkills,
    missingSkills,
    recommendation,
    resumeImprovementSuggestions,
    suggestedResumeBullets,
    interviewPreparationQuestions,
  } = data;

  const matchedCount = matchedSkills.length;
  const totalCount = matchedCount + missingSkills.length;

  return (
    <div className="pb-10 pt-10 sm:pt-20">
      <h2 className="mb-2 text-center text-2xl font-bold text-primary">{t("title")}</h2>
      <p className="mb-12 text-center text-base text-muted-foreground">{t("description")}</p>

      <div className={`bg-card ${border} overflow-hidden rounded-2xl`}>
        {children}

        <div className="flex flex-col gap-6 p-4 sm:p-6">
          <div className="md:col-span-1">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
              {t("card.vacancyLabel")}
            </p>
            <p className="font-semibold text-primary">{vacancyName}</p>
            <div className="mt-4">
              <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t("card.matchLabel")}
              </p>
              <p className="font-mono text-4xl font-bold text-blue-400">{matchPercentage}%</p>
            </div>
            <div className="mt-3">
              <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t("card.skillsMatchedLabel")}
              </p>
              <p className="font-mono text-xl font-bold text-primary">
                {matchedCount}
                <span className="text-sm font-normal text-muted-foreground">/{totalCount}</span>
              </p>
            </div>
          </div>
          <div className="space-y-4 md:col-span-2">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t("card.missingSkillsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {Boolean(missingSkills.length) ? (
                  missingSkills.map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 font-mono text-xs text-red-500"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-normal text-muted-foreground">0</span>
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t("card.matchedSkillsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {Boolean(matchedSkills.length) ? (
                  matchedSkills.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-xs text-emerald-400"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-normal text-muted-foreground">0</span>
                )}
              </div>
            </div>
            <div className="bg-muted/30 border-border rounded-xl border p-4">
              <p className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Info size={18} />
                {t("card.recommendationLabel")}
              </p>
              <p className="text-xs leading-relaxed text-primary sm:text-sm">{recommendation}</p>
            </div>

            <ReportListSection
              title={t("card.resumeImprovementSuggestionsLabel")}
              items={resumeImprovementSuggestions}
              icon={<FilePenLine size={18} />}
              markerClassName="border border-amber-400/20 bg-amber-400/10 text-amber-300"
            />
            <ReportListSection
              title={t("card.suggestedResumeBulletsLabel")}
              items={suggestedResumeBullets}
              icon={<ListChecks size={18} />}
              markerClassName="border border-blue-400/20 bg-blue-400/10 text-blue-300"
            />
            <ReportListSection
              title={t("card.interviewPreparationQuestionsLabel")}
              items={interviewPreparationQuestions}
              icon={<CircleHelp size={18} />}
              markerClassName="border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
            />
          </div>
        </div>
        <div className="border-border flex items-center gap-2 border-t pb-4 pl-6 pt-4 text-sm text-muted-foreground">
          <CheckCircle2 size={18} className="hidden text-emerald-400 sm:block" />
          <span className="text-xs sm:text-sm">{t("card.nextStepsLabel")}</span>
        </div>
      </div>
    </div>
  );
};
