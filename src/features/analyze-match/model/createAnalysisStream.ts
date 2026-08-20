import { getTranslations } from "next-intl/server";

import { AnalyzePayload } from "@/src/features/analyze-match";
import { generateMatchAnalysis, saveAnonymousAnalysis } from "@/src/features/analyze-match/server";
import { db } from "@/src/shared/api/prisma";
import { MAX_ATTEMPTS } from "@/src/shared/constants";
import { incrementIpLimit } from "@/src/shared/lib/ratelimit/server";

type CreateAnalysisStreamParams = {
  payload: AnalyzePayload;
  guestSessionId: string;
  ip: string;
};

export const createAnalysisStream = async ({
  payload,
  guestSessionId,
  ip,
}: CreateAnalysisStreamParams): Promise<ReadableStream<Uint8Array>> => {
  const t = await getTranslations("Errors.AnalysisStream");
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const sendStep = (step: string) => {
        controller.enqueue(encoder.encode(`${step}\n`));
      };

      try {
        const existingAnalysis = await db.anonymousAnalysis.findUnique({
          where: { id: guestSessionId },
        });

        if (existingAnalysis && existingAnalysis.attemptsCount >= MAX_ATTEMPTS) {
          throw new Error(t("limitReached"));
        }

        const nextAttemptNumber = existingAnalysis ? existingAnalysis.attemptsCount + 1 : 1;

        sendStep(t("step1"));
        sendStep(t("step2"));

        const aiParsedResult = await generateMatchAnalysis(payload);

        sendStep(t("step3"));
        await saveAnonymousAnalysis({
          id: guestSessionId,
          analysis: aiParsedResult,
          attemptsCount: nextAttemptNumber,
        });

        await incrementIpLimit(ip);

        sendStep(t("step4"));
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorObj = error as Record<string, unknown>;
        const rawErrorStatus = Number(errorObj?.status || errorObj?.code || 0);

        let resultMessage = errorMessage;
        if (
          errorMessage.toLowerCase().includes("prisma") ||
          errorMessage.toLowerCase().includes("database")
        ) {
          resultMessage = t("databaseError");
        } else if (
          rawErrorStatus === 503 ||
          errorMessage.includes("503") ||
          errorMessage.toLowerCase().includes("high demand") ||
          errorMessage.toLowerCase().includes("service unavailable")
        ) {
          resultMessage = t("overloadedServer");
        } else if (errorMessage.toLowerCase().includes("user location is not supported")) {
          resultMessage = t("notSupportedError");
        }

        controller.enqueue(encoder.encode(`ERROR:${resultMessage}\n`));
        controller.close();
      }
    },
  });
};
