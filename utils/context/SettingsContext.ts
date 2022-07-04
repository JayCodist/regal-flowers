import { createContext } from "react";
import { AppCurrency, Settings, Stage } from "../types/Core";

export interface SettingsControls extends Settings {
  setCurrency: (currency: AppCurrency) => void;
  stage: Stage;
  setStage: (stage: Stage) => void;
}

const SettingsContext = createContext<SettingsControls>({
  currency: { name: "NGN", conversionRate: 1 },
  setCurrency: () => {},
  stage: { name: "delivery", stage: 1 },
  setStage: () => {}
});

export default SettingsContext;
