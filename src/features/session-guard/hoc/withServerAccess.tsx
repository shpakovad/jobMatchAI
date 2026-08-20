import { getTranslations } from "next-intl/server";
import { ComponentType } from "react";

import { checkActiveSession } from "@/src/entities/session";
import { Link } from "@/src/navigation";
import { db } from "@/src/shared/api/prisma";
import { MAX_ATTEMPTS } from "@/src/shared/constants";
import { isPageIpRateLimited } from "@/src/shared/lib/ratelimit/withRateLimit";
import { Button, ErrorPage } from "@/src/shared/ui";

interface AccessProps {
  path?: "workspace" | "access" | "analysis";
}

export function withServerAccess<P extends object>(Component: ComponentType<P & AccessProps>) {
  return async (props: P & AccessProps) => {
    const isRateLimit = await isPageIpRateLimited();
    const t = await getTranslations("WithServerAccess");
    if (isRateLimit) {
      return (
        <ErrorPage message={isRateLimit.errorMessage}>
          <Link href="/">
            <Button variant="secondary">{t("goToMainPage")}</Button>
          </Link>
        </ErrorPage>
      );
    }

    const { hasActiveSession, sessionId } = await checkActiveSession();

    if (props.path !== "access" && !hasActiveSession) {
      const errorMessage = t("noSessionError");
      const buttonLabel = t("goToDemoAccessPage");

      return (
        <ErrorPage message={errorMessage}>
          <Link href="/access">
            <Button variant="secondary">{buttonLabel}</Button>
          </Link>
        </ErrorPage>
      );
    }

    let remaining = MAX_ATTEMPTS;

    if (sessionId) {
      const existingAnalysis = await db.anonymousAnalysis.findUnique({
        where: { id: sessionId },
      });

      if (existingAnalysis && existingAnalysis.attemptsCount < MAX_ATTEMPTS) {
        remaining = MAX_ATTEMPTS - existingAnalysis.attemptsCount;
      }

      if (props.path !== "analysis") {
        if (existingAnalysis && existingAnalysis.attemptsCount >= MAX_ATTEMPTS) {
          const errorMessage = t("freeAnalysesLimitReached", { limit: MAX_ATTEMPTS });
          const buttonLabel = t("goToMainPage");

          return (
            <ErrorPage message={errorMessage}>
              <Link href="/">
                <Button variant="secondary">{buttonLabel}</Button>
              </Link>
            </ErrorPage>
          );
        }
      }
    }

    return <Component {...props} sessionId={sessionId} remainingAnalyses={remaining} />;
  };
}
