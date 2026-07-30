import { create } from "zustand";

interface AnalysisStore {
  resumeText: string;
  setResumeText: (text: string) => void;
  vacancyText: string;
  setVacancyText: (text: string) => void;

  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;

  getIsReady: () => boolean;
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  resumeText: "",
  setResumeText: (text) => set({ resumeText: text }),

  vacancyText: "",
  setVacancyText: (text) => set({ vacancyText: text }),

  isLoading: false,
  error: null,
  setError: (error) => set({ error }),

  getIsReady: () => {
    const { resumeText, vacancyText, isLoading, error } = get();
    console.log({ resumeText, vacancyText, isLoading, error });

    return resumeText.length > 0 && vacancyText.length > 0 && !isLoading && !error;
  },
}));
