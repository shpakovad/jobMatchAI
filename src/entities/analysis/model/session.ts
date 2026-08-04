export const ANALYSIS_SESSION_KEY = "is_analysis_session_active";

export const activateAnalysisSession = () => {
  sessionStorage.setItem(ANALYSIS_SESSION_KEY, "true");
};

export const isAnalysisSessionActive = () =>
  sessionStorage.getItem(ANALYSIS_SESSION_KEY) === "true";
