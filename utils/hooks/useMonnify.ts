import { useEffect, useState } from "react";

export interface MonifyConfig {
  amount: number;
  currency: "NGN";
  reference: string;
  customerFullName: string;
  customerEmail: string;
  apiKey: string;
  contractCode: string;
  paymentDescription: string;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onComplete: (ref: MonnifyCompletedResponse) => void;
  onClose: () => void;
}

export interface MonnifyCompletedResponse {
  amount: number;
  amountPaid: number;
  completed: true;
  completedOn: string;
  createdOn: string;
  currencyCode: "NGN";
  customerEmail: string;
  customerName: string;
  fee: number;
  metaData: {
    deviceType: "mobile" | "desktop";
    ipAddress: string;
  };
  payableAmount: number;
  paymentMethod: "CARD" | "ACCOUNT_TRANSFER" | "USSD" | "PHONE_NUMBER";
  paymentReference: string;
  paymentStatus:
    | "PAID"
    | "OVERPAID"
    | "PARTIALLY_PAID"
    | "PENDING"
    | "ABANDONED"
    | "CANCELLED"
    | "FAILED"
    | "REVERSED"
    | "EXPIRED";
  transactionReference: string;
}

const useMonnify: () => {
  initializeMonnify: (monifyConfig: MonifyConfig) => void;
  isMonnifyReady: boolean;
  initErrorMessage?: string;
} = () => {
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ((window as any).MonnifySDK) {
      setIsReady(true);
    } else {
      const onLoaded = () => {
        setIsReady(true);
      };

      const onError = (e: ErrorEvent) => {
        setErrorMessage(e.message);
      };

      const script = document.createElement("script");
      script.setAttribute("src", "https://sdk.monnify.com/plugin/monnify.js");
      document.body.appendChild(script);

      script.addEventListener("load", onLoaded);
      script.addEventListener("error", onError);

      return () => {
        script.removeEventListener("load", onLoaded);
      };
    }
  }, []);

  return {
    isMonnifyReady: isReady,
    initializeMonnify:
      (typeof window !== "undefined" &&
        (window as any).MonnifySDK?.initialize) ||
      (() => console.warn("Monnify is not yet initialized")),
    initErrorMessage: errorMessage || undefined
  };
};

export default useMonnify;
