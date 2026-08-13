import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { ComponentType } from "react";

import { Link } from "@/src/navigation";
import { db } from "@/src/shared/api/prisma";
import { Button, ErrorPage } from "@/src/shared/ui";

interface AccessProps {
  isAnalysis?: boolean;
}

export function withServerAccess<P extends object>(Component: ComponentType<P & AccessProps>) {
  return async (props: P & AccessProps) => {
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get("guest_session_id")?.value;
    const locale = await getLocale();
    const isRussianLang = locale === "ru";

    if (!guestSessionId) {
      const errorMessage = isRussianLang
        ? "Для просмотра этой страницы необходим демо-код доступа"
        : "A demo access code is required to view this page";
      const buttonLabel = isRussianLang
        ? "Перейти на страницу доступа к демо"
        : "Go to demo access page";

      return (
        <ErrorPage message={errorMessage}>
          <Link href="/access">
            <Button variant="secondary">{buttonLabel}</Button>
          </Link>
        </ErrorPage>
      );
    }

    if (!props.isAnalysis) {
      const existingAnalysis = await db.anonymousAnalysis.findUnique({
        where: { id: guestSessionId },
      });

      if (existingAnalysis && existingAnalysis.attemptsCount >= 3) {
        const errorMessage = isRussianLang
          ? "Вы исчерпали лимит бесплатных анализов (максимум 3). Пожалуйста, попробуйте через 2 часа, чтобы продолжить."
          : "You have reached the limit of free analyses (maximum 3). Please try again in 2 hours to continue.";

        const buttonLabel = isRussianLang ? "На главную" : "Go to main";

        return (
          <ErrorPage message={errorMessage}>
            <Link href="/">
              <Button variant="secondary">{buttonLabel}</Button>
            </Link>
          </ErrorPage>
        );
      }
    }

    return <Component {...props} sessionId={guestSessionId} />;
  };
}
