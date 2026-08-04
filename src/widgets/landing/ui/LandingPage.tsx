import { ExampleSection } from "./ExampleSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { MainSection } from "./MainSection";

export const LandingPage = () => {
  return (
    <div>
      <MainSection />
      <HowItWorksSection />
      <ExampleSection />
    </div>
  );
};
