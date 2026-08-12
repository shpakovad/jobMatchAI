import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { ComponentType } from "react";

import { Link } from "@/src/navigation";
import { Button, ErrorPage } from "@/src/shared/ui";

export function withServerAccess<P extends object>(Component: ComponentType<P>) {
  return async (props: P) => {
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get("guest_session_id")?.value;

    if (!guestSessionId) {
      const locale = await getLocale();
      const isRussianLang = locale === "ru";

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

    return <Component {...props} sessionId={guestSessionId} />;
  };
}
