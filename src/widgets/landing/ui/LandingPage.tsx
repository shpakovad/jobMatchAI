import { MainSection } from "./MainSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { useTranslations } from "next-intl";

export const LandingPage = () => {
  const t = useTranslations("LandingPage");

  return (
    <div>
      <MainSection translation={t} />
      <HowItWorksSection translation={t} />
    </div>
  );
};
