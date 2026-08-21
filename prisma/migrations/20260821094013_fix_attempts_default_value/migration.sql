/*
  Warnings:

  - The `matchedSkills` column on the `AnonymousAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `missingSkills` column on the `AnonymousAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AnonymousAnalysis" ADD COLUMN     "attemptsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "interviewPreparationQuestions" TEXT[],
ADD COLUMN     "resumeImprovementSuggestions" TEXT[],
ADD COLUMN     "suggestedResumeBullets" TEXT[],
DROP COLUMN "matchedSkills",
ADD COLUMN     "matchedSkills" TEXT[],
DROP COLUMN "missingSkills",
ADD COLUMN     "missingSkills" TEXT[];
