import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { cookiesMock, getLocaleMock, findUniqueMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  getLocaleMock: vi.fn(),
  findUniqueMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("next-intl/server", () => ({
  getLocale: getLocaleMock,
}));

vi.mock("@/src/navigation", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
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

import {ReactNode} from "react";

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
};

describe("withServerAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getLocaleMock.mockResolvedValue("en");
    findUniqueMock.mockResolvedValue(null);
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
