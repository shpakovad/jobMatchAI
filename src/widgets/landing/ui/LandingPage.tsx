import { MainSection } from "./MainSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { useTranslations } from "next-intl";
import { ExampleSection } from "./ExampleSection";

export const LandingPage = () => {
  const t = useTranslations("LandingPage");

  return (
    <div>
      <MainSection translation={t} />
      <HowItWorksSection translation={t} />
      <ExampleSection translation={t} />
    </div>
  );
};
