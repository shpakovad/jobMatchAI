import { beforeEach, describe, expect, test, vi } from "vitest";

const { cookiesMock, createAnalysisStreamMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  createAnalysisStreamMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("@/src/features/analyze-match/server", () => ({
  createAnalysisStream: createAnalysisStreamMock,
}));

vi.mock("@/src/shared/api/prisma", () => ({
  db: {
    anonymousAnalysis: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { POST } from "./route";

const validPayload = {
  resumeText: "Frontend developer with React and TypeScript experience.",
  vacancyText: "Looking for a React engineer.",
  locale: "en" as const,
};

const makeRequest = (body: unknown) =>
  new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const mockSessionCookie = (value?: string) => {
  cookiesMock.mockResolvedValue({
    get: (name: string) => (name === "guest_session_id" && value ? { value } : undefined),
  });
};

describe("POST /api/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createAnalysisStreamMock.mockReturnValue(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("Success\n"));
          controller.close();
        },
      }),
    );
  });

  test("must return 401 when the guest session cookie is missing", async () => {
    mockSessionCookie();

    const response = await POST(makeRequest(validPayload));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Analysis page not found");
    expect(createAnalysisStreamMock).not.toHaveBeenCalled();
  });

  test("must return a Russian 401 message when locale is ru", async () => {
    mockSessionCookie();

    const response = await POST(makeRequest({ ...validPayload, locale: "ru" }));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Страница Анализа не найдена");
  });

  test("must return 400 when resume or vacancy text fails zod validation", async () => {
    mockSessionCookie("session-1");

    const response = await POST(
      makeRequest({
        resumeText: "short",
        vacancyText: "x",
        locale: "en",
      }),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Resume or vacancy text is missing");
    expect(data.details).toBeDefined();
    expect(createAnalysisStreamMock).not.toHaveBeenCalled();
  });

  test("must return 400 when the request body is not valid JSON", async () => {
    mockSessionCookie("session-1");

    const response = await POST(makeRequest("not-json"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Resume or vacancy text is missing");
  });

  test("must stream the analysis when the cookie and payload are valid", async () => {
    mockSessionCookie("session-1");

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(createAnalysisStreamMock).toHaveBeenCalledWith({
      payload: validPayload,
      guestSessionId: "session-1",
    });

    const body = await response.text();
    expect(body).toContain("Success");
  });

  test("must pass the trimmed payload produced by the zod schema", async () => {
    mockSessionCookie("session-1");

    await POST(
      makeRequest({
        resumeText: "   Experienced React developer   ",
        vacancyText: "  Senior frontend role  ",
        locale: "en",
      }),
    );

    expect(createAnalysisStreamMock).toHaveBeenCalledWith({
      payload: {
        resumeText: "Experienced React developer",
        vacancyText: "Senior frontend role",
        locale: "en",
      },
      guestSessionId: "session-1",
    });
  });
});
