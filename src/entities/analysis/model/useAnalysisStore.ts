import { create } from "zustand";

interface AnalysisStore {
  resumeText: string;
  vacancyText: string;
  isLoading: boolean;
  error: string | null;
  getIsReady: () => boolean;

  actions: {
    setResumeText: (text: string) => void;
    setError: (error: string | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setVacancyText: (text: string) => void;
    reset: () => void;
  };
}

const initialState: Omit<AnalysisStore, "actions"> = {
  resumeText: "",
  vacancyText: "",
  isLoading: false,
  error: null,
  getIsReady: () => false,
};

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  ...initialState,
  getIsReady: () => {
    const { resumeText, vacancyText, isLoading, error } = get();
    return resumeText.length > 0 && vacancyText.length > 0 && !isLoading && !error;
  },
  actions: {
    setResumeText: (text) => set({ resumeText: text }),
    setVacancyText: (text) => set({ vacancyText: text }),
    setError: (error) => set({ error }),
    setIsLoading: (isLoading) => set({ isLoading }),
    reset: () => set({ resumeText: "", vacancyText: "", isLoading: false, error: null }),
  },
}));

export const useAnalysisActions = () => useAnalysisStore((state) => state.actions);
