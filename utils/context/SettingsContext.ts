import { createContext } from "react";
import { AppCurrency, Settings, Stage } from "../types/Core";

export interface SettingsControls extends Settings {
  setCurrency: (currency: AppCurrency) => void;
  // stage: Stage;
  setCurrentStage: (stage: Stage) => void;
}

const SettingsContext = createContext<SettingsControls>({
  currency: { name: "NGN", conversionRate: 1 },
  setCurrency: () => {},
  currentStage: 1,
  setCurrentStage: () => {}
});

export default SettingsContext;
