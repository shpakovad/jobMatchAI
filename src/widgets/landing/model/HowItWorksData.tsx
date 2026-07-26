import { TranslationType } from "@/src/shared/types";
import {
  Crosshair,
  FileChartColumnIncreasing,
  FileInput,
  Mail,
  MessageCircleMore,
  Sparkles,
  Upload,
} from "lucide-react";
import { ReactNode } from "react";

interface StepResult {
  id: string;
  title: string;
  img: ReactNode; // Для JSX иконок используем тип ReactNode
}

// 3. Описываем интерфейс для основного шага
interface HowItWorksStep {
  id: string;
  title: string;
  img: ReactNode;
  description?: string; // Знак вопроса, так как у 3-го шага нет описания, только результаты
  result?: StepResult[]; // Необязательный массив результатов
}

export const getHowItWorksSteps = (translation: TranslationType): HowItWorksStep[] => {
  return [
    {
      id: "1",
      title: translation("HowItWorksSection.steps.step1.title"),
      description: translation("HowItWorksSection.steps.step1.description"),
      img: <Upload size={18} />,
    },
    {
      id: "2",
      title: translation("HowItWorksSection.steps.step2.title"),
      description: translation("HowItWorksSection.steps.step2.description"),
      img: <FileInput size={18} />,
    },
    {
      id: "3",
      title: translation("HowItWorksSection.steps.step3.title"),
      img: <Sparkles size={18} />,
      result: [
        {
          id: "3-1",
          title: translation("HowItWorksSection.steps.step3.result.result1"),
          img: <FileChartColumnIncreasing />,
        },
        {
          id: "3-2",
          title: translation("HowItWorksSection.steps.step3.result.result2"),
          img: <Crosshair />,
        },
        {
          id: "3-3",
          title: translation("HowItWorksSection.steps.step3.result.result3"),
          img: <MessageCircleMore />,
        },
        {
          id: "3-4",
          title: translation("HowItWorksSection.steps.step3.result.result4"),
          img: <Mail />,
        },
      ],
    },
  ];
};
