import { create } from "zustand";

interface AnalysisStore {
  resumeText: string;
  vacancyText: string;
  isLoading: boolean;
  error: string | null;

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
};

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  ...initialState,
  actions: {
    setResumeText: (text) => set({ resumeText: text }),
    setVacancyText: (text) => set({ vacancyText: text }),
    setError: (error) => set({ error }),
    setIsLoading: (isLoading) => set({ isLoading }),
    reset: () => set({ resumeText: "", vacancyText: "", isLoading: false, error: null }),
  },
}));

export const useAnalysisActions = () => useAnalysisStore((state) => state.actions);

export const useIsAnalysisReady = () => {
  return useAnalysisStore((state) => !!state.resumeText.trim() && !!state.vacancyText.trim());
};
