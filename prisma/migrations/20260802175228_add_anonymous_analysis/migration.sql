-- CreateTable
CREATE TABLE "AnonymousAnalysis" (
    "id" TEXT NOT NULL,
    "vacancyName" TEXT NOT NULL,
    "matchPercentage" INTEGER NOT NULL,
    "matchedSkills" JSONB NOT NULL,
    "missingSkills" JSONB NOT NULL,
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousAnalysis_pkey" PRIMARY KEY ("id")
);
