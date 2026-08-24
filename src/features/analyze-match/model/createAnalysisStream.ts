import { getTranslations } from "next-intl/server";

import { incrementIpLimit } from "@/src/shared/lib/ratelimit/server";

import { saveAnonymousAnalysis } from "../api/analysisRepository";
import { generateMatchAnalysis } from "../api/geminiService";
import { releaseAttempt } from "../model/quotaService";
import { AnalyzePayload } from "./validation";

type CreateAnalysisStreamParams = {
  payload: AnalyzePayload;
  guestSessionId: string;
  ip: string;
  locale: string;
  signal: AbortSignal;
};

export const createAnalysisStream = async ({
  payload,
  guestSessionId,
  ip,
  locale,
  signal,
}: CreateAnalysisStreamParams): Promise<ReadableStream<Uint8Array>> => {
  const t = await getTranslations({
    locale,
    namespace: "Errors.AnalysisStream",
  });

  const encoder = new TextEncoder();

  const serverAbortController = new AbortController();
  signal.addEventListener("abort", () => serverAbortController.abort(), { once: true });

  return new ReadableStream({
    async start(controller) {
      const sendStep = (step: string) => {
        if (serverAbortController.signal.aborted) return;
        try {
          controller.enqueue(encoder.encode(`${step}\n`));
        } catch {
          serverAbortController.abort();
        }
      };

      try {
        sendStep(t("step1"));
        sendStep(t("step2"));

        if (serverAbortController.signal.aborted) return;

        const abort = serverAbortController.signal;

        const aiParsedResult = await generateMatchAnalysis(payload, locale, abort);

        if (serverAbortController.signal.aborted) {
          const message = t("attemptsError");
          await releaseAttempt(guestSessionId, message);
          return;
        }

        sendStep(t("step3"));
        await saveAnonymousAnalysis({
          id: guestSessionId,
          analysis: aiParsedResult,
        });

        await incrementIpLimit(ip);

        sendStep(t("step4"));
        controller.close();
      } catch (error) {
        if (
          error instanceof Error &&
          (serverAbortController.signal.aborted || error?.name === "AbortError")
        ) {
          const message = t("attemptsError");
          await releaseAttempt(guestSessionId, message);
          return;
        }
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

        if (!serverAbortController.signal.aborted) {
          try {
            controller.enqueue(encoder.encode(`ERROR:${resultMessage}\n`));
          } catch {}
        }
        controller.close();
      }
    },
    cancel() {
      serverAbortController.abort();
    },
  });
};
