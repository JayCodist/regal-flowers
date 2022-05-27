import { createContext } from "react";
import { AppCurrency, Settings } from "../types/Core";

export interface SettingsControls extends Settings {
  setCurrency: (currency: AppCurrency) => void;
}

const SettingsContext = createContext<SettingsControls>({
  currency: { name: "NGN", conversionRate: 1 },
  setCurrency: () => {}
});

export default SettingsContext;
