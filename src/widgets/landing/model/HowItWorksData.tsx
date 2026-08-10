import {
  CircleQuestionMark,
  Crosshair,
  FileChartColumnIncreasing,
  FileInput,
  FilePenLine,
  List,
  Sparkles,
  Upload,
} from "lucide-react";
import { ReactNode } from "react";

import { TranslationType } from "@/src/shared/types";

interface StepResult {
  id: string;
  title: string;
  img: ReactNode;
}

interface HowItWorksStep {
  id: string;
  title: string;
  img: ReactNode;
  description?: string;
  result?: StepResult[];
}

export const getHowItWorksSteps = (translation: TranslationType): HowItWorksStep[] => {
  return [
    {
      id: "1",
      title: translation("steps.step1.title"),
      description: translation("steps.step1.description"),
      img: <Upload size={18} />,
    },
    {
      id: "2",
      title: translation("steps.step2.title"),
      description: translation("steps.step2.description"),
      img: <FileInput size={18} />,
    },
    {
      id: "3",
      title: translation("steps.step3.title"),
      img: <Sparkles size={18} />,
      result: [
        {
          id: "3-1",
          title: translation("steps.step3.result.result1"),
          img: <FileChartColumnIncreasing />,
        },
        {
          id: "3-2",
          title: translation("steps.step3.result.result2"),
          img: <Crosshair />,
        },
        {
          id: "3-3",
          title: translation("steps.step3.result.result3"),
          img: <List />,
        },
        {
          id: "3-4",
          title: translation("steps.step3.result.result4"),
          img: <FilePenLine />,
        },
        {
          id: "3-5",
          title: translation("steps.step3.result.result5"),
          img: <CircleQuestionMark />,
        },
      ],
    },
  ];
};
