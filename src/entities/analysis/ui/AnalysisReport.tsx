"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { ValidatedAnalysisResult } from "@/src/entities/analysis/model/validation";
import { border } from "@/src/shared/styles";

interface AnalysisReportProps {
  data: ValidatedAnalysisResult;
  children?: ReactNode;
}

export const AnalysisReport = ({ data, children }: AnalysisReportProps) => {
  const t = useTranslations("AnalysisPage");

  const { vacancyName, matchPercentage, matchedSkills, missingSkills, recommendation } = data;

  const matchedCount = matchedSkills.length;
  const totalCount = matchedCount + missingSkills.length;

  return (
    <div className={`pb-10 pt-20`}>
      <h2 className="mb-2 text-center text-2xl font-bold text-primary">{t("title")}</h2>
      <p className="mb-12 text-center text-base text-muted-foreground">{t("description")}</p>

      <div className={`bg-card ${border} overflow-hidden rounded-2xl`}>
        {children}

        <div className="grid gap-6 p-6">
          <div className="md:col-span-1">
            <p className="mb-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
              {t("card.vacancyLabel")}
            </p>
            <p className="font-semibold text-primary">{vacancyName}</p>
            <div className="mt-4">
              <p className="mb-1 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("card.matchLabel")}
              </p>
              <p className="font-mono text-4xl font-bold text-blue-400">{matchPercentage}%</p>
            </div>
            <div className="mt-3">
              <p className="mb-1 font-mono text-sm uppercase tracking-wider text-muted-foreground">
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
              <p className="mb-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("card.missingSkillsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {Boolean(missingSkills.length) ? (
                  missingSkills.map((item, index) => (
                    <span
                      key={index}
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
              <p className="mb-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                {t("card.matchedSkillsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {Boolean(matchedSkills.length) ? (
                  matchedSkills.map((item, index) => (
                    <span
                      key={index}
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
              <p className="text-sm leading-relaxed text-primary">{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
