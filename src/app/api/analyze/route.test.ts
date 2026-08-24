import { beforeEach, describe, expect, test, vi } from "vitest";

const { cookiesMock, createAnalysisStreamMock, parseSessionMock, validateIpRateLimitMock } =
  vi.hoisted(() => ({
    cookiesMock: vi.fn(),
    createAnalysisStreamMock: vi.fn(),
    parseSessionMock: vi.fn(),
    validateIpRateLimitMock: vi.fn(),
  }));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("@/src/features/analyze-match/server", () => ({
  createAnalysisStream: createAnalysisStreamMock,
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock("@/src/shared/lib/session/server", () => ({
  parseSession: parseSessionMock,
}));

vi.mock("@/src/shared/lib/ratelimit/withRateLimit", () => ({
  validateIpRateLimit: validateIpRateLimitMock,
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

  parseSessionMock.mockReturnValue(value || null);
};

describe("POST /api/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    validateIpRateLimitMock.mockResolvedValue(null);

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
    expect(data.error).toBe("noIdError");
    expect(createAnalysisStreamMock).not.toHaveBeenCalled();
  });

  test("must return 400 when resume or vacancy text fails zod validation", async () => {
    mockSessionCookie("session-1");

    const response = await POST(
      makeRequest({
        resumeText: "short",
        vacancyText: "x",
      }),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("noTextOrVacancyError");
    expect(data.details).toBeDefined();
    expect(createAnalysisStreamMock).not.toHaveBeenCalled();
  });

  test("must return 400 when the request body is not valid JSON", async () => {
    mockSessionCookie("session-1");

    const response = await POST(makeRequest("not-json"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("noTextOrVacancyError");
  });

  test("must stream the analysis when the cookie and payload are valid", async () => {
    mockSessionCookie("session-1");

    const response = await POST(makeRequest(validPayload));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");

    expect(createAnalysisStreamMock).toHaveBeenCalledWith({
      payload: validPayload,
      guestSessionId: "session-1",
      ip: "127.0.0.1",
      locale: "ru",
      signal: expect.any(AbortSignal),
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
      }),
    );

    expect(createAnalysisStreamMock).toHaveBeenCalledWith({
      payload: {
        resumeText: "Experienced React developer",
        vacancyText: "Senior frontend role",
      },
      guestSessionId: "session-1",
      ip: "127.0.0.1",
      locale: "ru",
      signal: expect.any(AbortSignal),
    });
  });
});
