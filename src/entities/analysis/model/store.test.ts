import { beforeEach, describe, expect, test } from "vitest";

import { useAnalysisStore } from "./useAnalysisStore";

describe("useAnalysisStore", () => {
  beforeEach(() => {
    useAnalysisStore.getState().actions.reset();
  });

  test("should be initialized with null defaults", () => {
    const state = useAnalysisStore.getState();

    expect(state.resumeText).toBe("");
    expect(state.vacancyText).toBe("");
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test("must successfully update the summary text via setResumeText", () => {
    useAnalysisStore.getState().actions.setResumeText("Frontend Developer Resume Context");

    const updatedState = useAnalysisStore.getState();
    expect(updatedState.resumeText).toBe("Frontend Developer Resume Context");
  });

  test("must successfully reset all fields when calling the reset action", () => {
    useAnalysisStore.getState().actions.setResumeText("Some Resume");
    useAnalysisStore.getState().actions.setVacancyText("Some Vacancy");
    useAnalysisStore.getState().actions.setError("Some Error");

    useAnalysisStore.getState().actions.reset();

    const clearedState = useAnalysisStore.getState();
    expect(clearedState.resumeText).toBe("");
    expect(clearedState.vacancyText).toBe("");
    expect(clearedState.error).toBeNull();
  });
});
