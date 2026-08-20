import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { ComponentType } from "react";

import { Link } from "@/src/navigation";
import { db } from "@/src/shared/api/prisma";
import { MAX_ATTEMPTS } from "@/src/shared/constants";
import { isPageIpRateLimited } from "@/src/shared/lib/ratelimit/withRateLimit";
import { parseSession } from "@/src/shared/lib/session/server";
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

    const cookieStore = await cookies();
    const rawCookie = cookieStore.get("guest_session_id")?.value;
    const guestSessionId = parseSession(rawCookie);

    if (props.path !== "access" && !guestSessionId) {
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

    if (guestSessionId) {
      const existingAnalysis = await db.anonymousAnalysis.findUnique({
        where: { id: guestSessionId },
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

    return <Component {...props} sessionId={guestSessionId} remainingAnalyses={remaining} />;
  };
}
