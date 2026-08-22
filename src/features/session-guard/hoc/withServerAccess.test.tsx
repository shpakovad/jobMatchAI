import { vi } from "vitest";

vi.hoisted(() => {
  process.env.SESSION_SECRET = "super_secret_string_32_characters";
});

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

// 🌟 2. Расширяем наши мок-функции (добавляем headersMock и parseSessionMock)
const { cookiesMock, headersMock, getLocaleMock, findUniqueMock, parseSessionMock } = vi.hoisted(
  () => ({
    cookiesMock: vi.fn(),
    headersMock: vi.fn(),
    getLocaleMock: vi.fn(),
    findUniqueMock: vi.fn(),
    parseSessionMock: vi.fn(),
  }),
);

// 🌟 3. Заглушаем "next/headers", отдавая и куки, и заголовки
vi.mock("next/headers", () => ({
  cookies: cookiesMock,
  headers: headersMock,
}));

vi.mock("next-intl/server", () => ({
  getLocale: getLocaleMock,
  // 🌟 СЕНЬОР-ФИКС: Делаем мок переводчика зависимым от getLocaleMock!
  getTranslations: vi.fn().mockImplementation(async () => {
    // Узнаем, какой язык сейчас установлен в конкретном тесте [📡]
    const currentLocale = await getLocaleMock();

    return (key: string) => {
      const messages: Record<string, string> = {
        noSessionError: "A demo access code is required to view this page",
        goToDemoAccessPage: "Go to Demo Access",
        goToMainPage: "Go to Main Page",
      };

      if (key === "freeAnalysesLimitReached") {
        // Если в тесте установлена локаль "ru" — отдаем строго русский текст! [📡]
        return currentLocale === "ru"
          ? "Вы исчерпали лимит бесплатных анализов (максимум 3). Пожалуйста, попробуйте через 2 часа, чтобы продолжить."
          : "You have reached the limit of free analyses (maximum 3). Please try again in 2 hours to continue.";
      }

      return messages[key] || key;
    };
  }),
}));

// 🌟 4. МОКАЕМ КРИПТОГРАФИЮ СЕССИЙ (Защита от падения 401 во время прогона тестов) [📡]
vi.mock("@/src/shared/lib/session/server", () => ({
  parseSession: parseSessionMock,
}));

// 🌟 5. МОКАЕМ РЕЙТ-ЛИМИТЕР СТРАНИЦ (Чтобы он всегда пропускал тесты и не искал Redis) [📡]
vi.mock("@/src/shared/lib/ratelimit/withRateLimit", () => ({
  isPageIpRateLimited: vi.fn().mockResolvedValue(false), // По умолчанию IP чист
}));

vi.mock("@/src/navigation", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/src/shared/api/prisma", () => ({
  db: {
    anonymousAnalysis: {
      findUnique: findUniqueMock,
    },
  },
}));

vi.mock("@/src/shared/ui", () => ({
  Button: ({ children }: { children: ReactNode }) => <button>{children}</button>,
  ErrorPage: ({ message, children }: { message: string; children: ReactNode }) => (
    <div>
      <p>{message}</p>
      {children}
    </div>
  ),
}));

import { ReactNode } from "react";

import { withServerAccess } from "./withServerAccess";

const DummyPage = ({
  sessionId,
  remainingAnalyses,
}: {
  sessionId?: string;
  remainingAnalyses?: number;
}) => (
  <div>
    <span data-testid="session">{sessionId ?? "none"}</span>
    <span data-testid="remaining">{remainingAnalyses}</span>
  </div>
);

const GuardedPage = withServerAccess(DummyPage);

const mockSessionCookie = (value?: string) => {
  cookiesMock.mockResolvedValue({
    get: (name: string) => (name === "guest_session_id" && value ? { value } : undefined),
  });
  // 🌟 Наш мок-парсер возвращает саму строку сессии (эмулируем успешную проверку HMAC) [📡]
  parseSessionMock.mockReturnValue(value || null);
};

describe("withServerAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getLocaleMock.mockResolvedValue("en");
    findUniqueMock.mockResolvedValue(null);

    // 🌟 Насильно учим headers() возвращать фейковый IP для стабильности [📡]
    headersMock.mockResolvedValue({
      get: (name: string) => (name === "x-forwarded-for" ? "127.0.0.1" : null),
    });
  });

  test("must block protected pages when the demo session cookie is missing", async () => {
    mockSessionCookie();
    render(await GuardedPage({ path: "workspace" }));
    expect(
      screen.getByText("A demo access code is required to view this page"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/access");
    expect(screen.queryByTestId("session")).not.toBeInTheDocument();
  });

  test("must allow the access page without a session cookie", async () => {
    mockSessionCookie();
    render(await GuardedPage({ path: "access" }));
    expect(screen.getByTestId("session")).toHaveTextContent("none");
    expect(screen.getByTestId("remaining")).toHaveTextContent("3");
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  test("must render the page and pass remaining analyses when the session is valid", async () => {
    mockSessionCookie("session-1");
    findUniqueMock.mockResolvedValue({ attemptsCount: 1 });
    render(await GuardedPage({ path: "workspace" }));
    expect(screen.getByTestId("session")).toHaveTextContent("session-1");
    expect(screen.getByTestId("remaining")).toHaveTextContent("2");
    expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: "session-1" } });
  });

  test("must treat a missing analysis record as 3 remaining attempts", async () => {
    mockSessionCookie("session-1");
    findUniqueMock.mockResolvedValue(null);
    render(await GuardedPage({ path: "workspace" }));
    expect(screen.getByTestId("remaining")).toHaveTextContent("3");
  });
});

describe("withServerAccess attempt limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getLocaleMock.mockResolvedValue("en");
    headersMock.mockResolvedValue({
      get: (name: string) => (name === "x-forwarded-for" ? "127.0.0.1" : null),
    });
  });

  test("must block workspace when the free analysis limit is reached", async () => {
    mockSessionCookie("session-1");
    findUniqueMock.mockResolvedValue({ attemptsCount: 3 });
    render(await GuardedPage({ path: "workspace" }));
    expect(
      screen.getByText(
        "You have reached the limit of free analyses (maximum 3). Please try again in 2 hours to continue.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
    expect(screen.queryByTestId("session")).not.toBeInTheDocument();
  });

  test("must also block the access page after 3 attempts", async () => {
    mockSessionCookie("session-1");
    findUniqueMock.mockResolvedValue({ attemptsCount: 4 });
    render(await GuardedPage({ path: "access" }));
    expect(screen.getByText(/limit of free analyses/i)).toBeInTheDocument();
  });

  test("must still allow the analysis page so the last report can be viewed", async () => {
    mockSessionCookie("session-1");
    findUniqueMock.mockResolvedValue({ attemptsCount: 3 });
    render(await GuardedPage({ path: "analysis" }));
    expect(screen.getByTestId("session")).toHaveTextContent("session-1");
    expect(screen.queryByText(/limit of free analyses/i)).not.toBeInTheDocument();
  });

  test("must show the Russian limit message when locale is ru", async () => {
    mockSessionCookie("session-1");
    getLocaleMock.mockResolvedValue("ru");
    findUniqueMock.mockResolvedValue({ attemptsCount: 3 });
    render(await GuardedPage({ path: "workspace" }));
    expect(
      screen.getByText(
        "Вы исчерпали лимит бесплатных анализов (максимум 3). Пожалуйста, попробуйте через 2 часа, чтобы продолжить.",
      ),
    ).toBeInTheDocument();
  });
});
