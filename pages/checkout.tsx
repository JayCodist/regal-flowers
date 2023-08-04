import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { useRouter } from "next/router";
import {
  FormEvent,
  FunctionComponent,
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Button from "../components/button/Button";
import Checkbox from "../components/checkbox/Checkbox";
import DatePicker from "../components/date-picker/DatePicker";
import Input, { TextArea } from "../components/input/Input";
import Radio from "../components/radio/Radio";
import Select, { Option } from "../components/select/Select";
import {
  allDeliveryLocationOptions,
  allDeliveryLocationZones,
  deliveryStates,
  freeDeliveryThreshold,
  freeDeliveryThresholdVals,
  paymentMethods,
  placeholderEmail
} from "../utils/constants";
import SettingsContext from "../utils/context/SettingsContext";
import {
  saveSenderInfo,
  updateCheckoutState
} from "../utils/helpers/data/order";
import { InfoIcon, InfoRedIcon } from "../utils/resources";
import { Order, CheckoutFormData, PaymentName } from "../utils/types/Order";
import styles from "./checkout.module.scss";
import useDeviceType from "../utils/hooks/useDeviceType";
import { getPurposes } from "../utils/helpers/data/purposes";
import {
  verifyMonnifyPayment,
  verifyPaypalPayment,
  verifyPaystackPayment
} from "../utils/helpers/data/payments";
import useMonnify from "../utils/hooks/useMonnify";
import Modal, { ModalProps } from "../components/modal/Modal";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveData
} from "@paypal/paypal-js";
import { AppCurrency } from "../utils/types/Core";
import {
  adaptCheckOutFomData,
  getPriceDisplay
} from "../utils/helpers/type-conversions";
import { Recipient } from "../utils/types/User";
import { Stage } from "../utils/types/Core";
import PhoneInput from "../components/phone-input/PhoneInput";
import { emailValidator } from "../utils/helpers/validators";
import { getResidentTypes } from "../utils/helpers/data/residentTypes";
import { formatPhoneNumber } from "../utils/helpers/formatters";
import AppStorage, {
  AppStorageConstants
} from "../utils/helpers/storage-helpers";

const initialData: CheckoutFormData = {
  senderName: "",
  senderEmail: "",
  senderPhoneNumber: "",
  senderPassword: "",
  freeAccount: true,
  coupon: "",
  deliveryMethod: "pick-up",
  state: "lagos",
  pickUpLocation: "",
  deliveryLocation: null,
  recipientName: "",
  deliveryDate: null,
  recipientPhoneNumber: "",
  recipientPhoneNumberAlt: "",
  shouldSaveAddress: true,
  residenceType: "",
  recipientHomeAddress: "",
  additionalInfo: "",
  message: "",
  purpose: "",
  cardName: "",
  cardExpiry: "",
  cardNumber: "",
  cardCVV: "",
  recipientCountryCode: "+234",
  senderCountryCode: "+234",
  recipientCountryCodeAlt: "+234",
  zone: "",
  currency: "NGN",
  deliveryInstruction: ""
};

type DeliverStage =
  | "sender-info"
  | "delivery-type"
  | "receiver"
  | "payment"
  | "customization-message";

interface Tab {
  tabTitle: string;
  TabKey: Stage;
}

const tabs: Tab[] = [
  {
    tabTitle: "Delivery",
    TabKey: 1
  },
  {
    tabTitle: "Payment",
    TabKey: 2
  },
  {
    tabTitle: "Done",
    TabKey: 3
  }
];

const Checkout: FunctionComponent = () => {
  const [formData, setFormData] = useState<CheckoutFormData>(initialData);
  // const [selectedMethod, setSelectedMethod] = useState<number | null>();
  const [pageLoading, setPageLoading] = useState(false);
  const [expandedOrderSummary, setExpandedOrderSummary] = useState<{
    order?: boolean;
    payment?: boolean;
  }>({ order: true, payment: false });
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingSenderInfo, setSavingSenderInfo] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [isSenderInfoCompleted, setIsSenderInfoCompleted] = useState(false);

  const [deliveryStage, setDeliveryStage] = useState<DeliverStage>(
    "sender-info"
  );
  const [allPurposes, setAllPurposes] = useState<Option[]>([]);
  const [allresidentTypes, setAllResidentTypes] = useState<Option[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );

  const {
    user,
    currentStage,
    setCurrentStage,
    currency,
    setCurrency,
    allCurrencies,
    notify,
    deliveryDate,
    setDeliveryDate,
    setShouldShowCart,
    redirect,
    setShouldShowAuthDropdown,
    order,
    confirm,
    setCartItems,
    setOrderId,
    orderLoading
  } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  const total = useMemo(() => {
    const total =
      order?.orderProducts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0;

    return total + (formData.deliveryLocation?.amount || 0);
  }, [order?.orderProducts, formData.deliveryLocation]);

  const subTotal = useMemo(() => {
    return (
      order?.orderProducts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0
    );
  }, [order]);

  const deliveryZoneOptions = useMemo(() => {
    return formData.state
      ? allDeliveryLocationZones[formData.state](
          subTotal / currency.conversionRate,
          currency,
          deliveryDate || dayjs()
        )
      : [];
  }, [subTotal, currency, deliveryDate, formData.state]);

  const markAsPaid = () => {
    setIsPaid(true);
    setCartItems([]);
    setCurrentStage(3);
    setOrderId("");
    AppStorage.remove(AppStorageConstants.ORDER_ID);
    AppStorage.remove(AppStorageConstants.CART_ITEMS);
  };

  const payStackConfig: PaystackProps = {
    reference: order?.id as string,
    email: formData.senderEmail || placeholderEmail,
    amount: Math.ceil(((total || 0) * 100) / currency.conversionRate),
    currency: currency.name === "GBP" ? undefined : currency.name, // Does not support GBP
    publicKey: "pk_test_3840ef4162a5542a0b92ba1eca94147059df955d",
    channels: ["card", "bank", "ussd", "qr", "mobile_money"]
  };

  const initializePayment = usePaystackPayment(payStackConfig);

  const router = useRouter();
  const {
    query: { orderId: _orderId },
    isReady
  } = router;

  const handleChange = (key: keyof CheckoutFormData, value: unknown) => {
    if (key === "state") {
      setFormData({
        ...formData,
        [key as string]: value,
        zone: value === "other-locations" ? value : "",
        pickUpLocation: "",
        deliveryLocation: null
      });
      return;
    }
    if (key === "zone") {
      setFormData({
        ...formData,
        [key as string]: value,
        deliveryLocation:
          deliveryLocationOptions.find(
            option => option.name === (value as string).split("-")[0]
          ) || null
      });
      return;
    }
    if (key === "deliveryMethod") {
      if (value === "pick-up") {
        setFormData({
          ...formData,
          [key as string]: value,
          deliveryLocation: null,
          state: "",
          zone: ""
        });
        return;
      } else {
        setFormData({
          ...formData,
          [key as string]: value,
          pickUpLocation: ""
        });
        return;
      }
    }
    if (
      key === "senderPhoneNumber" ||
      key === "recipientPhoneNumber" ||
      key === "recipientPhoneNumberAlt"
    ) {
      const phoneNumber = formatPhoneNumber(value as string);
      setFormData({
        ...formData,
        [key as string]: phoneNumber
      });
      return;
    }

    setFormData({
      ...formData,
      [key]: value
    });
  };

  const { initializeMonnify, isMonnifyReady } = useMonnify();

  useEffect(() => {
    if (selectedRecipient) {
      setFormData({
        ...formData,
        recipientName: selectedRecipient.name,
        recipientPhoneNumber: selectedRecipient.phone,
        recipientPhoneNumberAlt: selectedRecipient.phoneAlt,
        recipientHomeAddress: selectedRecipient.address,
        message: selectedRecipient.message,
        deliveryMethod: selectedRecipient.method,
        residenceType: selectedRecipient.residenceType,
        state: selectedRecipient.state
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipient]);

  const fetchPurposes = async () => {
    const { error, message, data } = await getPurposes();
    if (error) {
      notify("error", `Unable to fetch purposes: ${message}`);
    } else {
      setAllPurposes(
        data?.map(item => ({
          label: item,
          value: item
        })) || []
      );
    }
  };

  const fetchResidentTypes = async () => {
    const { error, message, data } = await getResidentTypes();
    if (error) {
      notify("error", `Unable to fetch purposes: ${message}`);
    } else {
      setAllResidentTypes(
        data?.map(item => ({
          label: item,
          value: item
        })) || []
      );
    }
  };

  const {
    pickUpLocation,
    state,
    zone,
    deliveryLocation,
    recipientName,
    recipientPhoneNumber,
    recipientHomeAddress,
    residenceType
  } = formData;

  const completedDeliveryLocation = Boolean(deliveryLocation && state && zone);

  const completedPickUpLocation = Boolean(pickUpLocation);

  const completedReceiverInfo = Boolean(
    recipientName &&
      recipientPhoneNumber &&
      residenceType &&
      recipientHomeAddress
  );

  useEffect(() => {
    fetchPurposes();
    fetchResidentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReady) {
      setOrderId(_orderId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_orderId, isReady]);

  useEffect(() => {
    const _isPaid =
      /go\s*ahead/i.test(order?.paymentStatus || "") ||
      /^paid/i.test(order?.paymentStatus || "");

    setIsPaid(_isPaid);
    if (_isPaid) {
      markAsPaid();
    } else {
      if (order?.orderStatus === "processing") {
        const isZoneValid = Boolean(
          deliveryZoneOptions.find(
            option => option.value === order.deliveryDetails.zone
          )
        );

        setFormData({
          ...formData,
          ...adaptCheckOutFomData(order),
          freeAccount: false,
          state: isZoneValid ? order.deliveryDetails.state : "",
          zone: isZoneValid ? order.deliveryDetails.zone : "",
          deliveryLocation:
            allDeliveryLocationOptions[order.deliveryDetails.state]?.(
              currency,
              dayjs(order.deliveryDate) || dayjs()
            ).find(
              option => option.name === order.deliveryDetails.zone.split("-")[0]
            ) || null
        });
        setDeliveryDate(dayjs(order?.deliveryDate));
        setIsSenderInfoCompleted(true);
        !isZoneValid
          ? setDeliveryStage("delivery-type")
          : setDeliveryStage("customization-message");
      } else if (
        order?.client.name &&
        order?.client.phone &&
        order.client.email &&
        order.deliveryDate
      ) {
        setFormData({
          ...formData,
          senderName: order?.client.name,
          senderPhoneNumber: order?.client.phone,
          deliveryDate: dayjs(order.deliveryDate),
          senderEmail: order.client.email
        });
        setDeliveryDate(dayjs(order?.deliveryDate));
        setIsSenderInfoCompleted(true);
        setDeliveryStage("delivery-type");
      } else {
        setFormData({
          ...formData,
          freeAccount: Boolean(!user)
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (user && !formData.senderName && !formData.senderEmail) {
      setFormData({
        ...formData,
        senderName: user.name,
        senderEmail: user.email,
        senderPhoneNumber: user.phone
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStage]);

  const validateDeliveryMethod = () => {
    if (formData.deliveryMethod === "pick-up" && !formData.pickUpLocation) {
      notify("error", "Please complete the delivery location");
      return false;
    } else if (
      formData.deliveryMethod === "delivery" &&
      (!formData.state || !formData.zone || !formData.deliveryLocation)
    ) {
      notify("error", "Please complete the delivery location");
      return false;
    }

    return true;
  };

  const validateReceiverInfo = () => {
    if (
      formData.deliveryMethod === "delivery" &&
      (!formData.recipientPhoneNumber ||
        !formData.recipientName ||
        !formData.residenceType ||
        !formData.recipientHomeAddress)
    ) {
      notify("error", "Please complete the receiver's information");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isDeliveryMethodComplete = validateDeliveryMethod();
    const isReceiverInfoComplete = validateReceiverInfo();

    if (!isDeliveryMethodComplete || !isReceiverInfoComplete) {
      return;
    }

    setLoading(true);
    const { error, message } = await updateCheckoutState(_orderId as string, {
      ...formData,
      deliveryDate,
      currency: currency.name
    });
    setLoading(false);

    if (error) {
      if (message === "User already exists") {
        confirm({
          title: "Create Account",
          body:
            "We couldn't create an account for you, as the user already exists",
          onOk() {
            setShouldShowAuthDropdown(true);
          },
          cancelText: "Continue as Guest",
          okText: "Login",
          onCancel: async () => {
            const { error, message } = await updateCheckoutState(
              _orderId as string,
              {
                ...formData,
                deliveryDate,
                freeAccount: false,
                currency: currency.name
              }
            );
            if (error) {
              notify("error", `Unable to save order: ${message}`);
              return;
            }
            setCurrentStage(2);
            setDeliveryStage("payment");
          }
        });
        return;
      }
      notify("error", `Unable to save order: ${message}`);
    } else {
      setCurrentStage(2);
      setDeliveryStage("payment");
    }
  };

  const handleSaveSenderInfo = async () => {
    if (emailValidator(formData.senderEmail)) {
      notify("error", "Please enter a valid email address");
      return;
    } else if (!deliveryDate) {
      notify("error", "Please select a delivery date");
      return;
    } else if (!formData.senderName) {
      notify("error", "Please enter a sender name");
      return;
    } else if (formData.freeAccount && !formData.senderPassword && !user) {
      notify(
        "error",
        "Please enter a password or uncheck the free account box"
      );
      return;
    } else if (!formData.senderPhoneNumber) {
      notify("error", "Please enter a sender phone number");
      return;
    }
    setSavingSenderInfo(true);
    const { error, message } = await saveSenderInfo(_orderId as string, {
      userData: {
        email: formData.senderEmail,
        name: formData.senderName,
        phone: formData.senderCountryCode + formData.senderPhoneNumber,
        phoneCountryCode: formData.senderCountryCode
      },
      deliveryDate: deliveryDate?.format("YYYY-MM-DD") || ""
    });

    if (error) {
      notify("error", `Unable to save sender Info: ${message}`);
    } else {
      notify("success", "Saved successfully");
      setDeliveryStage("delivery-type");
      setIsSenderInfoCompleted(true);
    }
    setSavingSenderInfo(false);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setDeliveryDate(date);
    setFormData({
      ...formData,
      zone: "",
      deliveryLocation: null,
      state: ""
    });
  };

  const isDelivered = (deliveryStatus = "") => {
    return /delivered/i.test(deliveryStatus);
  };

  const pastRecipients = useMemo(
    () =>
      user?.recipients.map(recipient => ({
        label: `${recipient.name} | ${recipient.phone} | ${recipient.phoneAlt} | ${recipient.address}`,
        value: `${recipient.name}${recipient.phone}`
      })) || [],
    [user]
  );

  const deliveryLocationOptions = useMemo(() => {
    return (
      allDeliveryLocationOptions[formData.state]?.(
        currency,
        deliveryDate || dayjs()
      ) || []
    );
  }, [currency, deliveryDate, formData.state]);

  const selectedZone = useMemo(() => {
    const amount = Math.ceil(subTotal / currency.conversionRate);
    return (
      allDeliveryLocationZones[formData.state]?.(
        amount,
        currency,
        deliveryDate || dayjs()
      )?.find(zone => zone.value === formData.zone) || null
    );
  }, [currency, deliveryDate, formData.state, formData.zone, subTotal]);

  if (pageLoading || orderLoading) {
    return (
      <div className={styles.loader}>
        <img src="/images/spinner.svg" alt="loader" className={styles.icon} />
        <span className={styles["load-intro"]}>
          {currentStage === 1 ? "Preparing your order. . ." : "Loading. . ."}
        </span>
      </div>
    );
  }

  const paymentHandlerMap: Record<PaymentName, () => void> = {
    paystack: () => {
      interface PaystackSuccessResponse {
        reference: string;
        trans: string;
        status: "success" | "error";
        message: "Approved" | "Declined";
        transaction: string;
        trxref: string;
        redirecturl: string;
      }
      const successHandler: (
        response?: PaystackSuccessResponse
      ) => Promise<void> = async response => {
        setPageLoading(true);
        const { error, message } = await verifyPaystackPayment(
          response?.reference as string
        );
        setPageLoading(false);
        if (error) {
          notify("error", `Unable to make payment: ${message}`);
        } else {
          notify("success", `Order paid successfully`);
          markAsPaid();
        }
      };
      initializePayment(successHandler, () => {});
    },
    monnify: () => {
      if (isMonnifyReady) {
        initializeMonnify({
          amount: order?.amount || 0,
          customerEmail: formData.senderEmail || placeholderEmail,
          customerFullName: formData.senderName || "N/A",
          apiKey: "MK_PROD_Z0NZF5VHDS",
          contractCode: "252548871448",
          currency: "NGN",
          reference: order?.id as string, // Problematic for repeat/cancelled payments
          paymentDescription: "Regal Flowers Order",
          onComplete: async response => {
            setPageLoading(true);
            const { error, message } = await verifyMonnifyPayment(
              response.paymentReference as string
            );
            setPageLoading(false);
            if (error) {
              notify("error", `Unable to make payment: ${message}`);
            } else {
              notify("success", `Order paid successfully`);
              markAsPaid();
            }
          },
          onClose: () => {}
        });
      }
    },
    payPal: () => {
      setShowPaypal(true);
    },
    manualTransfer: () => {},
    googlePay: () => {}
  };

  return (
    <form onSubmit={handleSubmit}>
      {deviceType === "desktop" ? (
        <section className={styles["checkout-page"]}>
          {currentStage <= 2 && (
            <div className={styles["checkout-wrapper"]}>
              <div className={`${styles.left}`}>
                {currentStage === 1 && (
                  <>
                    {redirect && (
                      <Link href={redirect}>
                        <a className="margin-bottom">{"< Back to Shop"}</a>
                      </Link>
                    )}

                    <div className={`${styles.border} margin-top`}>
                      <p className={styles["payment-info"]}>
                        Sender's Information
                      </p>
                      <div className={styles.padding}>
                        <div className="flex spaced-xl">
                          <div className="input-group half-width">
                            <span className="question">Name</span>
                            <Input
                              name="name"
                              placeholder="Name"
                              value={formData.senderName}
                              onChange={value =>
                                handleChange("senderName", value)
                              }
                              dimmed
                              required
                              responsive
                            />
                          </div>
                          <div className="input-group half-width">
                            <span className="question">Email</span>
                            <Input
                              name="email"
                              placeholder="Email"
                              value={formData.senderEmail}
                              onChange={value =>
                                handleChange("senderEmail", value)
                              }
                              dimmed
                              responsive
                              required={formData.freeAccount}
                            />
                          </div>
                        </div>
                        <div className="flex spaced-xl">
                          <PhoneInput
                            phoneNumber={formData.senderPhoneNumber}
                            countryCode={formData.senderCountryCode}
                            onChangePhoneNumber={value =>
                              handleChange("senderPhoneNumber", value)
                            }
                            onChangeCountryCode={value =>
                              handleChange("senderCountryCode", value)
                            }
                            className="input-group half-width"
                          />

                          {!user && (
                            <div className="input-group half-width compact">
                              <span className="question">
                                Pickup/Delivery Date
                              </span>
                              <DatePicker
                                value={deliveryDate}
                                onChange={date => handleDateChange(date)}
                                format="D MMMM YYYY"
                                responsive
                                disablePastDays
                              />
                            </div>
                          )}
                        </div>
                        {!user ? (
                          <div className="input-group half-width">
                            <span className="question">Create Password</span>
                            <Input
                              name="password"
                              type="password"
                              placeholder="Password"
                              value={formData.senderPassword}
                              onChange={value =>
                                handleChange("senderPassword", value)
                              }
                              dimmed
                              autoComplete="new-password"
                              required={formData.freeAccount}
                              showPasswordIcon
                              disabled={!formData.freeAccount}
                            />
                          </div>
                        ) : (
                          <div className="input-group half-width compact">
                            <span className="question">
                              Pickup/Delivery Date
                            </span>
                            <DatePicker
                              value={deliveryDate}
                              onChange={date => handleDateChange(date)}
                              format="D MMMM YYYY"
                              responsive
                              disablePastDays
                            />
                          </div>
                        )}

                        {!user && (
                          <div className="flex between center-align">
                            <Checkbox
                              checked={formData.freeAccount}
                              onChange={value =>
                                handleChange("freeAccount", value)
                              }
                              text="Create a Free Account"
                            />
                            <div className="flex center">
                              <span className="margin-right">
                                Already a user?
                              </span>
                              <Button
                                type="plain"
                                onClick={() => setShouldShowAuthDropdown(true)}
                              >
                                Login
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {!isSenderInfoCompleted && (
                      <Button
                        loading={savingSenderInfo}
                        onClick={handleSaveSenderInfo}
                      >
                        Continue
                      </Button>
                    )}

                    {isSenderInfoCompleted && (
                      <div
                        className={[
                          styles.border,
                          styles["delivey-method"]
                        ].join(" ")}
                      >
                        <p className={styles["payment-info"]}>
                          Delivery Method
                        </p>
                        <div className={styles.padding}>
                          <div className="flex between center-align">
                            <div
                              className={[
                                styles.method,
                                formData.deliveryMethod === "pick-up" &&
                                  styles.active
                              ].join(" ")}
                              onClick={() =>
                                handleChange("deliveryMethod", "pick-up")
                              }
                            >
                              <p className={`${styles["method-title"]}`}>
                                Pick Up
                              </p>
                              <p>Pick up from our stores</p>
                            </div>
                            <div
                              className={[
                                styles.method,
                                formData.deliveryMethod === "delivery" &&
                                  styles.active
                              ].join(" ")}
                              onClick={() =>
                                handleChange("deliveryMethod", "delivery")
                              }
                            >
                              <p className={`${styles["method-title"]}`}>
                                Delivery
                              </p>
                              <p>
                                Get it delivered to the recipient's location
                              </p>
                            </div>
                          </div>
                          <div className="margin-top primary-color">
                            <em>
                              {["13-02", "14-02", "15-02"].includes(
                                deliveryDate?.format("DD-MM") || ""
                              ) && formData.deliveryMethod === "delivery"
                                ? `Free Valentine (Feb 13th, 14th, 15th) Delivery in selected zones across Lagos and Abuja on orders above ${
                                    currency.sign
                                  }${freeDeliveryThresholdVals[
                                    currency.name
                                  ].toLocaleString()}`
                                : formData.deliveryMethod === "delivery"
                                ? `Free Delivery in selected zones across Lagos and Abuja on orders above ${
                                    currency.sign
                                  }${freeDeliveryThreshold[
                                    currency.name
                                  ].toLocaleString()}`
                                : ""}
                            </em>
                          </div>

                          {formData.deliveryMethod === "delivery" && (
                            <div className="flex spaced-xl">
                              <div className="input-group">
                                <span className="question">Delivery State</span>
                                <Select
                                  onSelect={value => {
                                    handleChange("state", value);
                                  }}
                                  value={formData.state}
                                  options={deliveryStates}
                                  placeholder="Select a state"
                                  responsive
                                  dimmed
                                />
                              </div>
                              {formData.state &&
                                formData.state !== "other-locations" && (
                                  <div className="input-group">
                                    <span className="question">
                                      Delivery Zones
                                    </span>
                                    <Select
                                      onSelect={value =>
                                        handleChange("zone", value)
                                      }
                                      value={formData.zone}
                                      options={deliveryZoneOptions}
                                      placeholder="Select a zone"
                                      responsive
                                      dimmed
                                      dropdownOnTop
                                      optionColor="gray-white"
                                    />
                                  </div>
                                )}
                            </div>
                          )}

                          {formData.deliveryMethod === "delivery" &&
                            formData.zone && (
                              <div className={styles["pickup-locations"]}>
                                {deliveryLocationOptions.length > 0 && (
                                  <p className="primary-color align-icon normal-text bold margin-bottom">
                                    <InfoRedIcon />
                                    <span className="margin-left">
                                      Delivery Locations
                                    </span>
                                  </p>
                                )}

                                {deliveryLocationOptions.length === 0 && (
                                  <div className="flex center-align primary-color normal-text margin-bottom spaced">
                                    <InfoRedIcon className="generic-icon xl" />
                                    <span>
                                      At the moment, we only deliver VIP Orders
                                      to other states on request, by either
                                      chartering a vehicle or by flight. Kindly
                                      contact us on Phone/WhatsApp:
                                      <br />
                                      <a
                                        href="tel:+2347011992888"
                                        className="clickable neutral underline"
                                      >
                                        +234 7011992888
                                      </a>
                                      ,{" "}
                                      <a
                                        href="tel:+2347010006665"
                                        className="clickable neutral underline"
                                      >
                                        +234 7010006665
                                      </a>
                                    </span>
                                  </div>
                                )}

                                {deliveryLocationOptions.map(locationOption => {
                                  return (
                                    <div
                                      className="vertical-margin spaced"
                                      key={locationOption.name}
                                    >
                                      <Radio
                                        label={locationOption.label}
                                        onChange={() =>
                                          handleChange(
                                            "deliveryLocation",
                                            locationOption
                                          )
                                        }
                                        disabled={
                                          locationOption.name !==
                                          (
                                            (selectedZone?.value as string) ||
                                            ""
                                          )?.split("-")[0]
                                        }
                                        checked={
                                          formData.deliveryLocation?.name ===
                                          locationOption.name
                                        }
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                          {formData.deliveryMethod === "pick-up" && (
                            <div className={styles["pickup-locations"]}>
                              <p className="primary-color align-icon normal-text bold margin-bottom">
                                <InfoRedIcon />
                                <span className="margin-left">
                                  Pick Up Locations
                                </span>
                              </p>
                              <div>
                                <Radio
                                  label="Lagos Pickup - 81b, Lafiaji Way, Dolphin Estate, Ikoyi, Lagos"
                                  onChange={() =>
                                    handleChange("pickUpLocation", "Lagos")
                                  }
                                  checked={formData.pickUpLocation === "Lagos"}
                                />
                              </div>
                              <div className="vertical-margin">
                                <Radio
                                  label="Abuja Pickup - 5, Nairobi Street, off Aminu Kano Crescent, Wuse 2, Abuja"
                                  onChange={() =>
                                    handleChange("pickUpLocation", "Abuja")
                                  }
                                  checked={formData.pickUpLocation === "Abuja"}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {formData.deliveryMethod === "delivery" &&
                      completedDeliveryLocation && (
                        <div className={styles.border}>
                          <p className={styles["payment-info"]}>
                            Receiver's Information
                          </p>
                          <div className={styles.padding}>
                            <div className="input-group">
                              <span className="question flex spaced">
                                <span>Select A Past Recipient </span>
                                {user ? (
                                  <em className="normal">(if available)</em>
                                ) : (
                                  <span className="normal flex spaced">
                                    (
                                    <button
                                      onClick={() =>
                                        setShouldShowAuthDropdown(true)
                                      }
                                      className="primary-color bold"
                                      type="button"
                                    >
                                      Login
                                    </button>
                                    <span>to use</span>)
                                  </span>
                                )}
                              </span>

                              <Select
                                onSelect={value => {
                                  setSelectedRecipient(
                                    user?.recipients.find(
                                      recipient =>
                                        `${recipient.name}${recipient.phone}` ===
                                        value
                                    ) || null
                                  );
                                }}
                                value={
                                  selectedRecipient
                                    ? `${selectedRecipient.name}${selectedRecipient?.phone}`
                                    : ""
                                }
                                options={pastRecipients}
                                placeholder="Select Past Recipient"
                                responsive
                                dimmed
                              />
                            </div>
                            <div className="flex center-align spaced vertical-margin">
                              <span className={styles["line-through"]}></span>
                              <span>OR</span>
                              <span className={styles["line-through"]}></span>
                            </div>
                            <div className="flex spaced-xl margin-bottom">
                              <div className="input-group">
                                <span className="question">Full Name</span>
                                <Input
                                  name="name"
                                  placeholder="Enter recipient name"
                                  value={formData.recipientName}
                                  onChange={value =>
                                    handleChange("recipientName", value)
                                  }
                                  dimmed
                                />
                              </div>

                              <PhoneInput
                                phoneNumber={formData.recipientPhoneNumber}
                                countryCode={formData.recipientCountryCode}
                                onChangePhoneNumber={value =>
                                  handleChange("recipientPhoneNumber", value)
                                }
                                onChangeCountryCode={value =>
                                  handleChange("recipientCountryCode", value)
                                }
                                className="input-group"
                                question="Receiver Phone number"
                              />
                            </div>

                            <div className="flex spaced-xl margin-bottom">
                              <PhoneInput
                                phoneNumber={formData.recipientPhoneNumberAlt}
                                countryCode={formData.recipientCountryCodeAlt}
                                onChangePhoneNumber={value =>
                                  handleChange("recipientPhoneNumberAlt", value)
                                }
                                onChangeCountryCode={value =>
                                  handleChange("recipientCountryCodeAlt", value)
                                }
                                className="input-group"
                                question="Enter alternative phone (if available)"
                              />
                              <div className="input-group">
                                <span className="question">Residence Type</span>

                                <Select
                                  onSelect={value =>
                                    handleChange("residenceType", value)
                                  }
                                  value={formData.residenceType}
                                  options={allresidentTypes}
                                  placeholder="Select a residence type"
                                  responsive
                                  dimmed
                                />
                              </div>
                            </div>
                            <div className="input-group">
                              <span className="question">Detailed Address</span>

                              <TextArea
                                value={formData.recipientHomeAddress}
                                placeholder="To help us deliver better, please be detailed as possible"
                                onChange={value =>
                                  handleChange("recipientHomeAddress", value)
                                }
                                dimmed
                                rows={3}
                              />
                            </div>
                            <div className="input-group">
                              <span className="question">
                                Any Delivery Instructions
                              </span>

                              <TextArea
                                value={formData.deliveryInstruction}
                                placeholder="e.g. Ask for security guard called Segun"
                                onChange={value =>
                                  handleChange("deliveryInstruction", value)
                                }
                                dimmed
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    {(formData.deliveryMethod === "delivery"
                      ? completedReceiverInfo
                      : completedPickUpLocation) && (
                      <div className={styles.border}>
                        <p className={styles["payment-info"]}>
                          Optional Message
                        </p>
                        <div className={styles.padding}>
                          <div className="input-group">
                            <span className="question">Message to include</span>

                            <TextArea
                              value={formData.message}
                              placeholder="Eg: I love you"
                              onChange={value => handleChange("message", value)}
                              dimmed
                              rows={3}
                            />
                          </div>
                          <div className="input-group">
                            <span className="question">
                              Additional Information for Us
                            </span>

                            <TextArea
                              value={formData.additionalInfo}
                              onChange={value =>
                                handleChange("additionalInfo", value)
                              }
                              dimmed
                              rows={3}
                            />
                          </div>
                          <div className="input-group half-width">
                            <span className="question">Purpose</span>

                            <Select
                              onSelect={value => handleChange("purpose", value)}
                              value={formData.purpose}
                              options={allPurposes}
                              placeholder="Select Purpose"
                              responsive
                              dropdownOnTop
                              dimmed
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {isSenderInfoCompleted && (
                      <Button
                        className="half-width"
                        loading={loading}
                        buttonType="submit"
                      >
                        Proceed to Payment
                      </Button>
                    )}
                  </>
                )}
                {currentStage === 2 && (
                  <>
                    <button
                      onClick={() => setCurrentStage(1)}
                      className="margin-bottom"
                    >
                      {"<< Back To Checkout"}
                    </button>
                    <div className={styles.border}>
                      <p className={styles["payment-info"]}>Payment Method</p>
                      <div className={styles.padding}>
                        <div className="flex center-align spaced-lg vertical-margin spaced">
                          <p className="normal-text bold ">
                            Select your preferred currency
                          </p>
                          <div className="flex spaced-lg">
                            {allCurrencies.map((_currency, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrency(_currency)}
                                className={[
                                  styles.currency,
                                  currency.name === _currency.name &&
                                    styles.active
                                ].join(" ")}
                                type="button"
                              >
                                {_currency.sign}
                              </button>
                            ))}
                          </div>
                        </div>
                        <p
                          className={`${styles.info} flex center-align spaced`}
                        >
                          <InfoIcon fill="#1C6DD0" />{" "}
                          <span>
                            Kindly select $ or £ for international payment
                            options
                          </span>{" "}
                        </p>
                        <div className={styles["payment-methods"]}>
                          <p
                            className={`${styles.info} flex center-align spaced margin-bottom`}
                          >
                            <InfoIcon fill="#1C6DD0" />{" "}
                            <span>
                              Payment issues? Simply Email
                              payments@regalflowers.com.ng or Call/Whatsapp
                              +2347011992888
                            </span>{" "}
                          </p>
                          {paymentMethods.map((method, index) => (
                            <div key={index}>
                              <div
                                className={[
                                  styles.method,
                                  !method.supportedCurrencies.includes(
                                    currency.name
                                  ) && styles.inactive
                                ].join(" ")}
                                onClick={
                                  method.supportedCurrencies.includes(
                                    currency.name
                                  )
                                    ? () =>
                                        paymentHandlerMap[method.paymentName]()
                                    : undefined
                                }
                                title={
                                  !method.supportedCurrencies.includes(
                                    currency.name
                                  )
                                    ? `This payment method does not support ${currency.name}`
                                    : ""
                                }
                              >
                                <div className="flex spaced-lg center-align">
                                  {method.icon}
                                  <div>
                                    <p className="normal-text bold">
                                      {method.title}
                                    </p>
                                    <p>{method.info}</p>
                                  </div>
                                </div>
                                <div className="flex spaced center-align">
                                  {method.other?.map((other, index) => (
                                    <div key={index}>{other.icon}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={styles.security}>
                          {" "}
                          <div className={styles["lock-icon"]}>
                            <img
                              src="icons/lock.svg"
                              className={`generic-icon small `}
                              alt="lock"
                            />
                          </div>{" "}
                          We protect your payment information using encryption
                          to provide bank-level security.
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {currentStage <= 2 && (
                <div className={styles.right}>
                  <div className="flex between margin-bottom spaced">
                    <p className="sub-heading bold">Cart Summary</p>
                    <p
                      className="sub-heading bold primary-color underline clickable"
                      onClick={() => setShouldShowCart(true)}
                    >
                      View Cart
                    </p>
                  </div>
                  <div className={`${styles.border} padded`}>
                    <div className="flex between ">
                      <span className="normal-text">Subtotal</span>
                      <span className="normal-text bold">
                        {getPriceDisplay(subTotal || 0, currency)}
                      </span>
                    </div>
                    <div className="flex between vertical-margin">
                      <span className="normal-text">Add-Ons total</span>
                      <span className="normal-text bold">
                        {getPriceDisplay(0, currency)}
                      </span>
                    </div>
                    {formData.deliveryMethod === "delivery" && (
                      <div className="flex between">
                        <span className="normal-text">Delivery Charge</span>
                        <span className="normal-text bold">
                          {getPriceDisplay(
                            formData.deliveryLocation?.amount || 0,
                            currency
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex center-align">
                      <div className="input-group">
                        <Input
                          placeholder="Enter Coupon Code"
                          value={formData.coupon}
                          onChange={value => handleChange("coupon", value)}
                          dimmed
                          responsive
                        />
                      </div>
                      <Button className={styles["apply-btn"]}>Apply</Button>
                    </div>
                    <hr className={`${styles.hr} hr`} />
                    <div className="flex between margin-bottom">
                      <span className="normal-text">Total</span>
                      <span className="normal-text bold">
                        {getPriceDisplay(total, currency)}
                      </span>
                    </div>
                    {currentStage === 1 && (
                      <Button responsive buttonType="submit" loading={loading}>
                        Proceed to Payment
                      </Button>
                    )}
                  </div>
                  {currentStage === 1 && (
                    <div>
                      <p className="margin-bottom spaced normal-text">
                        Accepted Payments
                      </p>
                      <div
                        className={`${styles["accepted-payments"]} flex between`}
                      >
                        <img
                          src="/icons/visa.svg"
                          alt="visa"
                          className="generic-icon large"
                        />
                        <img
                          src="/icons/master-card.svg"
                          alt="master card"
                          className="generic-icon large"
                        />
                        <img
                          src="/icons/paypal-blue.svg"
                          alt="paypal"
                          className="generic-icon large"
                        />
                        <img
                          src="/icons/paystack.png"
                          alt="pay stack"
                          className="generic-icon large"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {currentStage === 3 && isPaid && (
            <div className="flex between">
              <div className={styles["complete-checkout"]}>
                <div className="text-center">
                  <img
                    src="icons/checkout-complete.svg"
                    alt="completed"
                    className={`text-center ${styles["complete-image"]}`}
                  />
                  <p className={styles["order-received"]}>
                    Order Received Succesfully
                  </p>
                  <p className={styles["order-number"]}>
                    Order No:{" "}
                    <span className={styles.bold}>
                      {order?.fullOrderId || ""}
                    </span>
                  </p>

                  <div
                    className={`flex column center-align spaced normal-text ${styles["order-info"]}`}
                  >
                    <p>
                      Your order was received, please note your order number in
                      every correspondence with us.
                    </p>
                    <div className="flex spaced">
                      <img
                        src="icons/info.svg"
                        alt="information"
                        className={["generic-icon", styles.icon].join(" ")}
                      />
                      <p>
                        If your order is a pickup, please mention your order
                        number on arrival.
                      </p>
                    </div>
                  </div>

                  <Button
                    className={styles["shopping-btn"]}
                    onClick={() =>
                      router.push(
                        "/product-category/birthday-flowers-anniversary-flowers-love-amp-romance-flowers-valentine-flowers-mothers-day-flowers"
                      )
                    }
                  >
                    Continue Shopping
                  </Button>
                  {isDelivered(order?.deliveryStatus) && (
                    <Link href="/#">
                      <a className={styles.track}>Track Order</a>
                    </Link>
                  )}
                </div>

                {!user && (
                  <div className={styles["account-wrapper"]}>
                    <div className="sub-heading bold margin-bottom">
                      Create a Free Account
                    </div>
                    <div className="margin-bottom spaced">
                      Manage orders, address book and save time when checking
                      out by creating a free account today!
                    </div>
                    <Button className="half-width">
                      Create a Free Account
                    </Button>
                  </div>
                )}
              </div>
              <div className={styles["order-summary"]}>
                <p className="sub-heading bold">Order Summary</p>
                <p className="normal-text">
                  Payment successful. A copy has been sent to your mail for
                  reference.
                </p>
                <div className="flex between vertical-margin spaced center-align">
                  <p
                    className={[
                      styles.detail,
                      expandedOrderSummary.order && styles.active
                    ].join(" ")}
                  >
                    Order Details
                  </p>
                  <div
                    className={[
                      styles["circle-outline"],
                      expandedOrderSummary.order && styles.active
                    ].join(" ")}
                    onClick={() =>
                      setExpandedOrderSummary({
                        ...expandedOrderSummary,
                        order: !expandedOrderSummary.order,
                        payment: false
                      })
                    }
                  >
                    <span
                      className={[
                        styles.vertical,
                        expandedOrderSummary.order && styles.active
                      ].join(" ")}
                    ></span>
                    <span
                      className={[
                        styles.horizontal,
                        expandedOrderSummary.order && styles.active
                      ].join(" ")}
                    ></span>
                  </div>
                </div>
                <hr className="hr" />

                <div
                  className={[
                    styles["order-details"],
                    expandedOrderSummary.order && styles.active
                  ].join(" ")}
                >
                  {order?.orderProducts?.map((item, index) => (
                    <div key={index} className="flex column spaced">
                      <div className={styles["order-detail"]}>
                        <span className="flex between">
                          <strong>Name</strong>
                          <span className={styles["detail-value"]}>
                            {item.name}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Qty</strong>
                          <span className={styles["detail-value"]}>
                            {item.quantity}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex between vertical-margin spaced center-align">
                  <p
                    className={[
                      styles.detail,
                      expandedOrderSummary.payment && styles.active
                    ].join(" ")}
                  >
                    Payment Details
                  </p>
                  <div
                    className={[
                      styles["circle-outline"],
                      expandedOrderSummary.payment && styles.active
                    ].join(" ")}
                    onClick={() =>
                      setExpandedOrderSummary({
                        ...expandedOrderSummary,
                        payment: !expandedOrderSummary.payment,
                        order: false
                      })
                    }
                  >
                    <span
                      className={[
                        styles.vertical,
                        expandedOrderSummary.payment && styles.active
                      ].join(" ")}
                    ></span>
                    <span
                      className={[
                        styles.horizontal,
                        expandedOrderSummary.payment && styles.active
                      ].join(" ")}
                    ></span>
                  </div>
                </div>
                <div
                  className={[
                    styles["order-details"],
                    expandedOrderSummary.payment && styles.active
                  ].join(" ")}
                >
                  <hr className="hr margin-bottom spaced" />
                  <div className="flex between normal-text margin-bottom spaced">
                    <span>Subtotal</span>
                    <span className="bold">
                      {getPriceDisplay(subTotal || 0, currency)}
                    </span>
                  </div>
                  <div className="flex between normal-text margin-bottom spaced">
                    <span>Add-Ons total</span>
                    <span className="bold">{getPriceDisplay(0, currency)}</span>
                  </div>
                  <div className="flex between normal-text margin-bottom spaced">
                    <div>
                      <span>Delivery Charge</span>
                      <p className={`${styles["light-gray"]}`}>Lagos</p>
                    </div>
                    <span className="bold">
                      {getPriceDisplay(
                        formData.deliveryLocation?.amount || 0,
                        currency
                      )}
                    </span>
                  </div>
                  <div className="flex between normal-text margin-bottom spaced">
                    <div>
                      <span>Payment Method</span>
                    </div>
                    <span className="bold">
                      {order?.paymentStatus
                        ?.match(/\(.+\)/)?.[0]
                        ?.replace(/[()]/g, "")}
                    </span>
                  </div>
                  <hr className="hr margin-bottom spaced" />
                  <div className="flex between sub-heading margin-bottom spaced">
                    <span>Total</span>
                    <span className="bold primary-color">
                      {getPriceDisplay(total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className={styles["checkout-mobile"]}>
          <div className={styles.tabs}>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={[
                  styles.tab,
                  currentStage === tab.TabKey && styles.active
                ].join(" ")}
                // onClick={() => setActiveTab(tab.TabKey)}
              >
                {tab.tabTitle}
              </div>
            ))}
          </div>
          <div className={styles.content}>
            {currentStage === 1 && (
              <div>
                <Link href={redirect}>
                  <a className="margin-bottom spaced">{"< Back to Shop"}</a>
                </Link>
                {deliveryStage === "sender-info" && (
                  <div>
                    <div className="flex align-center between">
                      <p className={styles.title}>Sender's Information</p>
                    </div>
                    <div className="input-group">
                      <span className="question">Name</span>
                      <Input
                        name="name"
                        placeholder="Name"
                        value={formData.senderName}
                        onChange={value => handleChange("senderName", value)}
                        dimmed
                        responsive
                        required
                      />
                    </div>
                    <div className="input-group">
                      <span className="question">Email</span>
                      <Input
                        name="email"
                        placeholder="Email"
                        value={formData.senderEmail}
                        onChange={value => handleChange("senderEmail", value)}
                        dimmed
                        responsive
                        required={formData.freeAccount}
                        onBlurValidation={() =>
                          emailValidator(formData.senderEmail)
                        }
                      />
                    </div>
                    <PhoneInput
                      phoneNumber={formData.senderPhoneNumber}
                      countryCode={formData.senderCountryCode}
                      onChangePhoneNumber={value =>
                        handleChange("senderPhoneNumber", value)
                      }
                      onChangeCountryCode={value =>
                        handleChange("senderCountryCode", value)
                      }
                      className="input-group"
                    />

                    <div className="input-group">
                      <span className="question">Pickup/Delivery Date</span>
                      <DatePicker
                        value={deliveryDate}
                        onChange={date => handleDateChange(date)}
                        format="D MMMM YYYY"
                        responsive
                        disablePastDays
                        dropdownTop
                      />
                    </div>
                    {!user && (
                      <div className="input-group">
                        <span className="question">Create Password</span>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Password"
                          value={formData.senderPassword}
                          onChange={value =>
                            handleChange("senderPassword", value)
                          }
                          dimmed
                          responsive
                          autoComplete="new-password"
                          required={formData.freeAccount}
                          showPasswordIcon
                          disabled={!formData.freeAccount}
                        />
                      </div>
                    )}

                    {!user && (
                      <div className="flex between">
                        <Checkbox
                          checked={formData.freeAccount}
                          onChange={value => handleChange("freeAccount", value)}
                          text="Create a Free Account"
                        />
                        <p className="flex spaced">
                          <span>or</span>
                          <Button
                            type="plain"
                            onClick={() => setShouldShowAuthDropdown(true)}
                            className="primary-color"
                          >
                            Login
                          </Button>
                        </p>
                      </div>
                    )}

                    <Button
                      loading={savingSenderInfo}
                      onClick={handleSaveSenderInfo}
                      className="vertical-margin xl"
                    >
                      Continue
                    </Button>
                    <p className={styles.next}>
                      Next: <strong>Delivery Type</strong>
                    </p>
                  </div>
                )}

                {deliveryStage === "delivery-type" && (
                  <>
                    <div className="flex between">
                      <p className={styles.title}>Sender's Information</p>
                      <strong
                        onClick={() => setDeliveryStage("sender-info")}
                        className="primary-color underline"
                      >
                        Edit
                      </strong>
                    </div>
                    <div
                      className={[styles["sender-info"], "normal-text"].join(
                        " "
                      )}
                    >
                      {formData.senderName && <p>{formData.senderName}</p>}
                      {formData.senderEmail && <p>{formData.senderEmail}</p>}
                      {formData.senderPhoneNumber && (
                        <p>{formData.senderPhoneNumber}</p>
                      )}
                      {deliveryDate && (
                        <p>{deliveryDate.format("dddd, MMMM DD YYYY")}</p>
                      )}
                    </div>

                    <div>
                      <p className={styles.title}>Delivery Method</p>
                      <div>
                        <div className="margin-top">
                          <em>
                            {["13-02", "14-02", "15-02"].includes(
                              deliveryDate?.format("DD-MM") || ""
                            )
                              ? `Free Valentine (Feb 13th, 14th, 15th) Delivery in selected zone in Lagos and Abuja on orders above ${
                                  currency.sign
                                }${freeDeliveryThresholdVals[
                                  currency.name
                                ].toLocaleString()}`
                              : formData.deliveryMethod === "delivery"
                              ? `Free Delivery in selected in Lagos and Abuja on orders above ${
                                  currency.sign
                                }${freeDeliveryThreshold[
                                  currency.name
                                ].toLocaleString()}`
                              : ""}
                          </em>
                        </div>
                        <div className="vertical-margin spaced">
                          <Radio
                            label="Pick Up"
                            onChange={() =>
                              handleChange("deliveryMethod", "pick-up")
                            }
                            checked={formData.deliveryMethod === "pick-up"}
                          />
                        </div>
                        {formData.deliveryMethod === "pick-up" && (
                          <div className={styles["pickup-locations"]}>
                            <p className="align-icon normal-text bold margin-bottom">
                              Pick Up Locations
                            </p>
                            <div>
                              <Radio
                                label="Lagos Pickup - 81b, Lafiaji Way, Dolphin Estate, Ikoyi, Lagos"
                                onChange={() =>
                                  handleChange("pickUpLocation", "Lagos")
                                }
                                checked={formData.pickUpLocation === "Lagos"}
                              />
                            </div>
                            <div className="vertical-margin">
                              <Radio
                                label="Abuja Pickup - 5, Nairobi Street, off Aminu Kano Crescent, Wuse 2, Abuja"
                                onChange={() =>
                                  handleChange("pickUpLocation", "Abuja")
                                }
                                checked={formData.pickUpLocation === "Abuja"}
                              />
                            </div>
                          </div>
                        )}
                        <div className="vertical-margin spaced">
                          <Radio
                            label="Delivery"
                            onChange={() =>
                              handleChange("deliveryMethod", "delivery")
                            }
                            checked={formData.deliveryMethod === "delivery"}
                          />
                        </div>
                        {formData.deliveryMethod === "delivery" && (
                          <>
                            <div className="input-group">
                              <span className="question">Delivery State</span>
                              <Select
                                onSelect={value => handleChange("state", value)}
                                value={formData.state}
                                options={deliveryStates}
                                placeholder="Select a state"
                                responsive
                                dimmed
                              />
                            </div>

                            {formData.state &&
                              formData.state !== "other-locations" && (
                                <div className="input-group">
                                  <span className="question">
                                    Delivery Zones
                                  </span>
                                  <Select
                                    onSelect={value =>
                                      handleChange("zone", value)
                                    }
                                    value={formData.zone}
                                    options={deliveryZoneOptions}
                                    placeholder="Select a zone"
                                    responsive
                                    dimmed
                                    dropdownOnTop
                                    optionColor="gray-white"
                                  />
                                </div>
                              )}
                          </>
                        )}

                        {formData.deliveryMethod === "delivery" &&
                          formData.zone && (
                            <div className={styles["pickup-locations"]}>
                              {deliveryLocationOptions.length > 0 && (
                                <p className="primary-color align-icon normal-text bold margin-bottom">
                                  <InfoRedIcon />
                                  <span className="margin-left">
                                    Delivery Locations
                                  </span>
                                </p>
                              )}

                              {deliveryLocationOptions.length === 0 && (
                                <div className="flex center-align primary-color normal-text margin-bottom spaced">
                                  <InfoRedIcon className="generic-icon xl" />
                                  <span>
                                    At the moment, we only deliver VIP Orders to
                                    other states on request, by either
                                    chartering a vehicle or by flight. Kindly
                                    contact us on Phone/WhatsApp:
                                    <br />
                                    <a
                                      href="tel:+2347011992888"
                                      className="clickable neutral underline"
                                    >
                                      +234 7011992888
                                    </a>
                                    ,{" "}
                                    <a
                                      href="tel:+2347010006665"
                                      className="clickable neutral underline"
                                    >
                                      +234 7010006665
                                    </a>
                                  </span>
                                </div>
                              )}

                              {deliveryLocationOptions.map(locationOption => {
                                return (
                                  <div
                                    className="vertical-margin spaced"
                                    key={locationOption.name}
                                  >
                                    <Radio
                                      label={locationOption.label}
                                      onChange={() =>
                                        handleChange(
                                          "deliveryLocation",
                                          locationOption
                                        )
                                      }
                                      disabled={
                                        locationOption.name !==
                                        (
                                          (selectedZone?.value as string) || ""
                                        )?.split("-")[0]
                                      }
                                      checked={
                                        formData.deliveryLocation?.name ===
                                        locationOption.name
                                      }
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        const isDeliveryMethodComplete = validateDeliveryMethod();
                        if (!isDeliveryMethodComplete) {
                          return;
                        }
                        setDeliveryStage(
                          formData.deliveryMethod === "delivery"
                            ? "receiver"
                            : "customization-message"
                        );
                      }}
                      className="vertical-margin xl"
                      responsive
                    >
                      Continue
                    </Button>
                    <p className={styles.next}>
                      Next:{" "}
                      <strong>
                        {formData.deliveryMethod === "delivery"
                          ? "Receiver's Information"
                          : "Customization Message"}
                      </strong>
                    </p>
                  </>
                )}

                {deliveryStage === "receiver" && (
                  <>
                    <div className="flex between">
                      <p className={styles.title}>Sender's Information</p>
                      <strong
                        onClick={() => setDeliveryStage("sender-info")}
                        className="primary-color underline"
                      >
                        Edit
                      </strong>
                    </div>
                    <div
                      className={[styles["sender-info"], "normal-text"].join(
                        " "
                      )}
                    >
                      {formData.senderName && <p>{formData.senderName}</p>}
                      {formData.senderEmail && <p>{formData.senderEmail}</p>}
                      {formData.senderPhoneNumber && (
                        <p>{formData.senderPhoneNumber}</p>
                      )}
                      {deliveryDate && (
                        <p>{deliveryDate.format("dddd, MMMM DD YYYY")}</p>
                      )}
                    </div>
                    {formData.deliveryMethod && (
                      <div className="flex between">
                        <p className={styles.title}>Delivery Type</p>
                        <strong
                          onClick={() => setDeliveryStage("delivery-type")}
                          className="primary-color underline"
                        >
                          Edit
                        </strong>
                      </div>
                    )}
                    {formData.deliveryMethod === "delivery" && formData.state && (
                      <div
                        className={`${styles["sender-info"]} normal-text flex between`}
                      >
                        <p>Delivery</p>
                        {formData.state && (
                          <p className="capitalize">{formData.state}</p>
                        )}
                      </div>
                    )}
                    {formData.deliveryMethod === "pick-up" &&
                      formData.pickUpLocation && (
                        <div
                          className={`${styles["sender-info"]} normal-text flex between`}
                        >
                          <p>Pick Up</p>
                          {<p>{formData.pickUpLocation}</p>}
                        </div>
                      )}
                    {formData.deliveryMethod === "delivery" && (
                      <div>
                        <p className={styles.title}>Receiver's Information</p>
                        <div className={styles.padding}>
                          <div className="input-group">
                            <span className="question flex spaced">
                              <span>Select A Past Recipient </span>
                              {user ? (
                                <em className="normal">(if available)</em>
                              ) : (
                                <span className="normal flex spaced">
                                  (
                                  <button
                                    onClick={() =>
                                      setShouldShowAuthDropdown(true)
                                    }
                                    className="primary-color bold"
                                    type="button"
                                  >
                                    Login
                                  </button>
                                  <span>to use</span>)
                                </span>
                              )}
                            </span>

                            <Select
                              onSelect={value => {
                                setSelectedRecipient(
                                  user?.recipients.find(
                                    recipient =>
                                      `${recipient.name}${recipient.phone}` ===
                                      value
                                  ) || null
                                );
                              }}
                              value={
                                selectedRecipient
                                  ? `${selectedRecipient.name}${selectedRecipient?.phone}`
                                  : ""
                              }
                              options={pastRecipients}
                              placeholder="Select Past Recipient"
                              responsive
                              dimmed
                              optionColor="gray-white"
                            />
                          </div>
                          <div className="flex center-align spaced vertical-margin">
                            <span className={styles["line-through"]}></span>
                            <span>OR</span>
                            <span className={styles["line-through"]}></span>
                          </div>

                          <div className="input-group">
                            <span className="question">Full Name</span>
                            <Input
                              name="name"
                              placeholder="Enter recipient name"
                              value={formData.recipientName}
                              onChange={value =>
                                handleChange("recipientName", value)
                              }
                              dimmed
                              responsive
                            />
                          </div>

                          <PhoneInput
                            phoneNumber={formData.recipientPhoneNumber}
                            countryCode={formData.recipientCountryCode}
                            onChangePhoneNumber={value =>
                              handleChange("recipientPhoneNumber", value)
                            }
                            onChangeCountryCode={value =>
                              handleChange("recipientCountryCode", value)
                            }
                            className="input-group"
                            question="Receiver Phone number"
                          />

                          <PhoneInput
                            phoneNumber={formData.recipientPhoneNumberAlt}
                            countryCode={formData.recipientCountryCodeAlt}
                            onChangePhoneNumber={value =>
                              handleChange("recipientPhoneNumberAlt", value)
                            }
                            onChangeCountryCode={value =>
                              handleChange("recipientCountryCodeAlt", value)
                            }
                            className="input-group"
                            question="Enter alternative phone (if available)"
                          />
                          <div className="input-group">
                            <span className="question">Residence Type</span>

                            <Select
                              onSelect={value =>
                                handleChange("residenceType", value)
                              }
                              value={formData.residenceType}
                              options={allresidentTypes}
                              placeholder="Select a residence type"
                              responsive
                              dimmed
                            />
                          </div>
                          <div className="input-group">
                            <span className="question">Detailed Address</span>

                            <TextArea
                              value={formData.recipientHomeAddress}
                              placeholder="To help us deliver better, please be detailed as possible"
                              onChange={value =>
                                handleChange("recipientHomeAddress", value)
                              }
                              dimmed
                              rows={3}
                            />
                          </div>
                          <div className="input-group">
                            <span className="question">
                              Any Delivery Instructions
                            </span>

                            <TextArea
                              value={formData.deliveryInstruction}
                              placeholder="e.g. Ask for security guard called Segun"
                              onChange={value =>
                                handleChange("deliveryInstruction", value)
                              }
                              dimmed
                              rows={3}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            const isReceiverInfoComplete = validateReceiverInfo();

                            if (!isReceiverInfoComplete) {
                              return;
                            }
                            setDeliveryStage("customization-message");
                          }}
                          className="vertical-margin xl"
                          responsive
                        >
                          Continue
                        </Button>
                        <p className={styles.next}>
                          Next: <strong>Customize Message</strong>
                        </p>
                      </div>
                    )}
                  </>
                )}

                {deliveryStage === "customization-message" && (
                  <>
                    <div className="flex between">
                      <p className={styles.title}>Sender's Information</p>
                      <strong
                        onClick={() => setDeliveryStage("sender-info")}
                        className="primary-color underline"
                      >
                        Edit
                      </strong>
                    </div>
                    <div
                      className={[styles["sender-info"], "normal-text"].join(
                        " "
                      )}
                    >
                      {formData.senderName && <p>{formData.senderName}</p>}
                      {formData.senderEmail && <p>{formData.senderEmail}</p>}
                      {formData.senderPhoneNumber && (
                        <p>{formData.senderPhoneNumber}</p>
                      )}
                      {deliveryDate && (
                        <p>{deliveryDate.format("dddd, MMMM DD YYYY")}</p>
                      )}
                    </div>
                    {formData.deliveryMethod && (
                      <div className="flex between">
                        <p className={styles.title}>Delivery Type</p>
                        <strong
                          onClick={() => setDeliveryStage("delivery-type")}
                          className="primary-color underline"
                        >
                          Edit
                        </strong>
                      </div>
                    )}
                    {formData.deliveryMethod === "delivery" && formData.state && (
                      <div
                        className={`${styles["sender-info"]} normal-text flex between`}
                      >
                        <p>Delivery</p>
                        {formData.state && (
                          <p className="capitalize">{formData.state}</p>
                        )}
                      </div>
                    )}
                    {formData.deliveryMethod === "pick-up" &&
                      formData.pickUpLocation && (
                        <div
                          className={`${styles["sender-info"]} normal-text flex between`}
                        >
                          <p>Pick Up</p>
                          {<p>{formData.pickUpLocation}</p>}
                        </div>
                      )}
                    {formData.deliveryMethod === "delivery" && (
                      <div className="flex between">
                        <p className={styles.title}>Receiver's Information</p>
                        <strong
                          onClick={() => setDeliveryStage("receiver")}
                          className="primary-color underline"
                        >
                          Edit
                        </strong>
                      </div>
                    )}
                    {formData.deliveryMethod === "delivery" && (
                      <div className={`${styles["sender-info"]} normal-text`}>
                        <p>{formData.recipientName}</p>
                        <p className={styles.grayed}>Pickup/Delivery Date</p>
                        <p>{deliveryDate?.format("YYYY-MM-DD")}</p>
                        <p>{formData.recipientPhoneNumber}</p>
                        <p className={styles.grayed}>Alternative Number</p>
                        <p>{formData.recipientPhoneNumberAlt}</p>
                        <p>{formData.recipientHomeAddress}</p>
                      </div>
                    )}
                    <div>
                      <p className={styles.title}>Optional Message</p>
                      <div className="input-group">
                        <span className="question">Message to include</span>

                        <TextArea
                          value={formData.message}
                          placeholder="Eg: I love you"
                          onChange={value => handleChange("message", value)}
                          dimmed
                          rows={3}
                        />
                      </div>
                      <div className="input-group">
                        <span className="question">
                          Additional Information for Us
                        </span>

                        <TextArea
                          value={formData.additionalInfo}
                          onChange={value =>
                            handleChange("additionalInfo", value)
                          }
                          dimmed
                          rows={3}
                        />
                      </div>
                      <div className="input-group">
                        <span className="question">Purpose</span>

                        <Select
                          onSelect={value => handleChange("purpose", value)}
                          value={formData.purpose}
                          options={allPurposes}
                          placeholder="Select Purpose"
                          responsive
                          dimmed
                        />
                      </div>
                      <Button
                        buttonType="submit"
                        className="vertical-margin xl"
                        loading={loading}
                        responsive
                      >
                        Continue
                      </Button>

                      <p className={styles.next}>
                        Next: <strong>Payment</strong>
                      </p>
                    </div>
                  </>
                )}

                <div className={styles.footer}>
                  <p className="margin-bottom">Accepted Payment</p>
                  <div
                    className={`${styles["accepted-payments"]} flex between`}
                  >
                    <img
                      src="/icons/visa.svg"
                      alt="visa"
                      className="generic-icon large"
                    />
                    <img
                      src="/icons/master-card.svg"
                      alt="master card"
                      className="generic-icon large"
                    />
                    <img
                      src="/icons/paypal-blue.svg"
                      alt="paypal"
                      className="generic-icon large"
                    />
                    <img
                      src="/icons/paystack.png"
                      alt="pay stack"
                      className="generic-icon large"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStage === 2 && (
              <div className={styles["payment-tab"]}>
                <button
                  onClick={() => setCurrentStage(1)}
                  className="margin-bottom"
                >
                  {"<< Back To Checkout"}
                </button>
                <div className={`${styles.border} padded`}>
                  <div className="flex between ">
                    <span className="normal-text">Order Total</span>
                    <span className="normal-text bold">
                      {getPriceDisplay(subTotal, currency)}
                    </span>
                  </div>
                  {formData.deliveryMethod === "delivery" && (
                    <div className="flex between">
                      <span className="normal-text">Delivery</span>
                      <span className="normal-text bold">
                        {getPriceDisplay(
                          formData.deliveryLocation?.amount || 0,
                          currency
                        )}
                      </span>
                    </div>
                  )}
                  <br />
                  <hr className="hr" />
                  <div className="flex between vertical-margin">
                    <span className="normal-text">Sum Total</span>
                    <span className="normal-text bold">
                      {getPriceDisplay(total || 0, currency)}
                    </span>
                  </div>
                </div>

                <div className={styles.padding}>
                  <div className="flex  spaced-lg column margin-bottom">
                    <p className="normal-text bold vertical-margin spaced">
                      Select your preferred currency
                    </p>
                    <div className="flex spaced-lg">
                      {allCurrencies.map((_currency, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrency(_currency)}
                          className={[
                            styles.currency,
                            currency.name === _currency.name && styles.active
                          ].join(" ")}
                          type="button"
                        >
                          {_currency.sign}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className={`${styles.info} flex center-align spaced`}>
                    <InfoIcon fill="#1C6DD0" />{" "}
                    <span>
                      Kindly select $ or £ for international payment options
                    </span>{" "}
                  </p>

                  <div className={styles["payment-methods"]}>
                    <p className={`${styles.info} flex center-align spaced`}>
                      <InfoIcon fill="#1C6DD0" />{" "}
                      <span>
                        Payment issues? Simply Email
                        payments@regalflowers.com.ng or Call/Whatsapp
                        +2347011992888
                      </span>{" "}
                    </p>
                    {paymentMethods.map((method, index) => (
                      <div key={index}>
                        <div
                          className={[
                            styles.method,
                            !method.supportedCurrencies.includes(
                              currency.name
                            ) && styles.inactive
                          ].join(" ")}
                          onClick={
                            method.supportedCurrencies.includes(currency.name)
                              ? () => paymentHandlerMap[method.paymentName]()
                              : undefined
                          }
                          title={
                            !method.supportedCurrencies.includes(currency.name)
                              ? `This payment method does not support ${currency.name}`
                              : ""
                          }
                        >
                          <div className="flex spaced-lg center-align">
                            {method.icon}
                            <div>
                              <p className="normal-text bold margin-bottom">
                                {method.title}
                              </p>
                              <p>{method.info}</p>
                              <div className="flex spaced center-align">
                                {method.other?.map((other, index) => (
                                  <div key={index}>{other.icon}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setCurrentStage(3)}
                    className="vertical-margin xl"
                    responsive
                  >
                    Continue
                  </Button>
                  <p className={styles.security}>
                    {" "}
                    <div className={styles["lock-icon"]}>
                      <img
                        src="icons/lock.svg"
                        className={`generic-icon small `}
                        alt="lock"
                      />
                    </div>{" "}
                    We protect your payment information using encryption to
                    provide bank-level security.
                  </p>
                </div>
              </div>
            )}

            {currentStage === 3 && (
              <div>
                <div className="text-center">
                  <div className={styles["order-received"]}>
                    <p>Order Received Succesfully</p>
                    <p className={styles["order-number"]}>
                      Order No:{" "}
                      <span className={styles.bold}>{order?.fullOrderId}</span>{" "}
                    </p>
                  </div>

                  {isDelivered(order?.deliveryStatus) && (
                    <div className={`${styles["order-info"]}`}>
                      <p>
                        Your order was received, please check your mail for
                        order confirmation.
                      </p>
                    </div>
                  )}
                  <div
                    className={`flex column center-align spaced normal-text ${styles["order-info"]}`}
                  >
                    <p>
                      Your order was received, please note your order number in
                      every correspondence with us.
                    </p>
                    <div className="flex spaced">
                      <img
                        src="icons/info.svg"
                        alt="information"
                        className={["generic-icon", styles.icon].join(" ")}
                      />
                      <p>
                        If your order is a pickup, please mention your order
                        number on arrival.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles["order-summary"]}>
                  <p className={[styles.detail].join(" ")}>Order Details</p>

                  <div className={[styles["order-details"]].join(" ")}>
                    {order?.orderProducts?.map((item, index) => (
                      // <div key={index} className="flex column spaced">
                      <div className={styles["order-detail"]} key={index}>
                        <span className="flex between">
                          <strong>Name</strong>
                          <span className={styles["detail-value"]}>
                            {item.name}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Qty</strong>
                          <span className={styles["detail-value"]}>
                            {item.quantity}
                          </span>
                        </span>
                      </div>
                      // </div>
                    ))}
                  </div>

                  <div className="flex between vertical-margin spaced center-align">
                    <p className={[styles.detail].join(" ")}>Payment Details</p>
                  </div>
                  <div className={[styles["order-details"]].join(" ")}>
                    <div className="flex between small-text margin-bottom spaced">
                      <strong className={styles.grayed}>Subtotal</strong>
                      <span className="bold">
                        {getPriceDisplay(subTotal, currency)}
                      </span>
                    </div>
                    <div className="flex between small-text margin-bottom spaced">
                      <strong className={styles.grayed}>Add-Ons total</strong>
                      <span className="bold">
                        {getPriceDisplay(0, currency)}
                      </span>
                    </div>
                    <div className="flex between small-text margin-bottom spaced">
                      <div>
                        <strong className={styles.grayed}>
                          Delivery Charge
                        </strong>
                      </div>
                      <span className="bold">
                        {getPriceDisplay(
                          formData.deliveryLocation?.amount || 0,
                          currency
                        )}
                      </span>
                    </div>
                    <div className="flex between small-text margin-bottom spaced">
                      <div>
                        <strong className={styles.grayed}>
                          Payment Method
                        </strong>
                      </div>
                      <span className="bold">
                        {order?.paymentStatus
                          ?.match(/\(.+\)/)?.[0]
                          ?.replace(/[()]/g, "")}
                      </span>
                    </div>
                    <hr className="hr margin-bottom spaced" />
                    <div className="flex between sub-heading margin-bottom spaced small-text">
                      <span>Total</span>
                      <span className="bold primary-color">
                        {getPriceDisplay(total || 0, currency)}
                      </span>
                    </div>
                  </div>
                </div>
                {!user && (
                  <div className={styles["account-wrapper"]}>
                    <p className="sub-heading bold margin-bottom">
                      Create a Free Account
                    </p>
                    <p className="margin-bottom spaced">
                      Manage orders, address book and save time when checking
                      out by creating a free account today!
                    </p>
                    <Button>Create a Free Account</Button>
                  </div>
                )}
                <div className={styles["done-footer"]}>
                  <Button
                    responsive
                    className={styles["shopping-btn"]}
                    onClick={() => router.push("/product-category/bouquets")}
                  >
                    Continue Shopping
                  </Button>
                  {isDelivered(order?.deliveryStatus) && (
                    <Link href="#">
                      <a className={styles.track}>Track Order</a>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      <PaypalModal
        visible={showPaypal}
        cancel={() => setShowPaypal(false)}
        order={order}
        onComplete={markAsPaid}
      />
    </form>
  );
};

const PaypalModal: FunctionComponent<ModalProps & {
  order: Order | null;
  onComplete: () => void;
}> = ({ visible, cancel, order, onComplete }) => {
  const { currency, notify } = useContext(SettingsContext);
  const currencyRef: MutableRefObject<AppCurrency> = useRef(currency);

  currencyRef.current = currency;

  const handleSessionCreate = (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: String(
              Math.ceil(
                (order?.amount || 0) /
                  (currencyRef.current?.conversionRate || 1)
              ).toFixed(2)
            )
          },
          reference_id: order?.id
        }
      ]
    });
  };

  const handleApprove = async (data: OnApproveData) => {
    const { error, message } = await verifyPaypalPayment(data.orderID);
    if (error) {
      notify("error", `Unable to verify paystack payment: ${message}`);
    } else {
      notify("success", "Successfully paid for order");
      onComplete();
      cancel?.();
    }
  };

  const canInitialize = useMemo(() => {
    return paymentMethods
      .find(method => method.paymentName === "payPal")
      ?.supportedCurrencies.includes(currency.name);
  }, [currency]);

  return (
    <Modal visible={visible} cancel={cancel} className="scrollable">
      <h1 className="title thin margin-bottom spaced">
        Complete Paypal Payment
      </h1>
      {canInitialize && (
        <PayPalScriptProvider
          options={{
            "client-id":
              "AW_ULm5wau1-h9eyogtL-x_9sbXZSMCqqPbCWwyn_K77VgFufBPgtDVmaXHeE4KMYiTgm8OYLcU7Nyqy",
            currency: currencyRef.current?.name,
            "buyer-country": currencyRef.current?.name === "USD" ? "US" : "GB"
          }}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              shape: "pill",
              label: "pay"
            }}
            className="vertical-margin spaced"
            createOrder={handleSessionCreate}
            onApprove={handleApprove}
          />
        </PayPalScriptProvider>
      )}
    </Modal>
  );
};

export default Checkout;
