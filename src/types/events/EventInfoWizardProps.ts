import { Dispatch, SetStateAction } from "react";

export type EventInfoWizardProps = {
  activeStep: number;
  handleBack: () => void;
  isStepOptional: (step: any) => boolean;
  handleSkip: () => void;
  handleNext: () => void;
  steps: string[];
};
