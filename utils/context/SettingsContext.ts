import { Dayjs } from "dayjs";
import { createContext } from "react";
import { AppCurrency, Settings, Stage } from "../types/Core";

export interface SettingsControls extends Settings {
  currency: AppCurrency;
  setCurrency: (currency: AppCurrency) => void;
  setCurrentStage: (stage: Stage) => void;
  deliveryDate: Dayjs | null;
  setDeliveryDate: (deliveryDate: Dayjs | null) => void;
}

const SettingsContext = createContext<SettingsControls>({
  currency: { name: "NGN", conversionRate: 1 },
  setCurrency: () => {},
  currentStage: 1,
  setCurrentStage: () => {},
  deliveryDate: null,
  setDeliveryDate: () => {}
});

export default SettingsContext;
