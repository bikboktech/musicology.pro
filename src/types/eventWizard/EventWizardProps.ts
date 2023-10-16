export type EventWizardProps = {
  activeStep: number;
  handleBack: () => void;
  isStepOptional: (step: any) => boolean;
  handleSkip: () => void;
  handleNext: () => void;
  steps: string[];
};
