import dayjs from "dayjs";
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
  getOrder,
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
import { AppCurrency, CartItem } from "../utils/types/Core";
import {
  adaptCheckOutFomData,
  getOptionsFromArray,
  getPriceDisplay
} from "../utils/helpers/type-conversions";
import { Recipient } from "../utils/types/User";
import { Stage } from "../utils/types/Core";
import PhoneInput from "../components/phone-input/PhoneInput";
import { emailValidator } from "../utils/helpers/validators";
import { getResidentTypes } from "../utils/helpers/data/residentTypes";
import { ProductImage } from "../utils/types/Product";

const initialData: CheckoutFormData = {
  senderName: "",
  senderEmail: "",
  senderPhoneNumber: "",
  senderPassword: "",
  freeAccount: true,
  coupon: "",
  deliveryMethod: "pick-up",
  state: "",
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
  zone: ""
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
    redirectUrl,
    setShouldShowAuthDropdown,
    setOrder,
    order,
    setCartItems
  } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  const total = useMemo(() => {
    const total =
      order?.orderProducts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0;

    return formData.deliveryLocation?.amount
      ? total + formData.deliveryLocation?.amount
      : total;
  }, [order?.orderProducts, formData.deliveryLocation]);

  const subTotal = useMemo(() => {
    return (
      order?.orderProducts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0
    );
  }, [order]);

  const payStackConfig: PaystackProps = {
    reference: order?.id as string,
    email: formData.senderEmail || placeholderEmail,
    amount: ((total || 0) * 100) / currency.conversionRate,
    currency: currency.name === "GBP" ? undefined : currency.name, // Does not support GBP
    publicKey: "pk_test_d4948f2002e85ddfd66c71bf10d9fa969fb163b4",
    channels: ["card", "bank", "ussd", "qr", "mobile_money"]
  };

  const initializePayment = usePaystackPayment(payStackConfig);

  const router = useRouter();
  const {
    query: { orderId },
    isReady
  } = router;

  const handleChange = (key: keyof CheckoutFormData, value: unknown) => {
    if (key === "state") {
      setFormData({
        ...formData,
        [key as string]: value,
        zone: ""
      });
      return;
    } else if (key === "zone") {
      setFormData({
        ...formData,
        [key as string]: value,
        deliveryLocation:
          deliveryLocationOptions.find(
            option => option.name === (value as string).split("-")[0]
          ) || null
      });
      return;
    } else if (key === "deliveryMethod" && value === "pick-up") {
      setFormData({
        ...formData,
        [key as string]: value,
        deliveryLocation: null,
        state: "",
        zone: ""
      });
      return;
    }

    setFormData({
      ...formData,
      [key]: value
    });
  };

  const { initializeMonnify, isMonnifyReady } = useMonnify();

  const fetchOrder = async () => {
    setPageLoading(true);
    const res = await getOrder(orderId as string);
    const { error, data } = res;

    if (error) {
      notify("error", "Order not found! Please create an order");
      router.push("/");
    } else {
      setOrder(data);
      const _isPaid =
        /go\s*ahead/i.test(data?.paymentStatus || "") ||
        /^paid/i.test(data?.paymentStatus || "");
      setIsPaid(_isPaid);
      if (_isPaid) {
        setCurrentStage(3);
      }
    }

    setPageLoading(false);
  };

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
    if (isReady) {
      if (orderId) {
        fetchOrder();
      } else {
        notify("error", "Invalid link");
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isReady, currentStage]);

  useEffect(() => {
    fetchPurposes();
    setCurrentStage(1);
    fetchResidentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (order?.orderStatus === "processing") {
      setFormData({
        ...formData,
        ...adaptCheckOutFomData(order),
        freeAccount: Boolean(!user),
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
    } else {
      setFormData({
        ...formData,
        freeAccount: Boolean(!user)
      });
    }
    const _cartItems: CartItem[] =
      order?.orderProducts?.map(item => ({
        image: item.image as ProductImage,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        key: item.key,
        size: item.size,
        description: item.description,
        cartId: item.size || "" + item.key
      })) || [];
    setCartItems(_cartItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (emailValidator(formData.senderEmail)) {
      notify("error", "Please enter a valid email address");
      return;
    } else if (
      formData.deliveryMethod === "pick-up" &&
      !formData.pickUpLocation
    ) {
      notify("error", "Please complete the delivery location");
      return;
    } else if (formData.deliveryMethod === "delivery") {
      if (!formData.state && !formData.zone && !formData.deliveryLocation) {
        notify("error", "Please complete the delivery location");
        return;
      }
    }
    setLoading(true);
    const { error, message } = await updateCheckoutState(orderId as string, {
      ...formData,
      deliveryDate
    });
    setLoading(false);

    if (error) {
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
    } else if (formData.freeAccount && !formData.senderPassword) {
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
    const { error, message } = await saveSenderInfo(orderId as string, {
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

  const deliveryMap = {
    Arranged: "Arranged",
    Delivered: "Delivered",
    Despatched: "Despatched",
    "Not Arranged": "Not Arranged",
    "Delivery Failed/Issues with Delivery": "Delivery Failed",
    "Delivered (drivers update)": "Delivered"
  };

  const isDelivered = (deliveryStatus = "") => {
    return /delivered/i.test(deliveryStatus);
  };

  const pastRecipients = useMemo(
    () =>
      user?.recipients.map(recipient => ({
        label: recipient.name,
        value: recipient.phone
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

  const abujaDeliveryZoneOptions = useMemo(() => {
    return (
      allDeliveryLocationZones["abuja"]?.(
        total || 0,
        currency,
        deliveryDate || dayjs()
      ) || []
    );
  }, [currency, deliveryDate, total]);

  const lagosDeliveryZoneOptions = useMemo(() => {
    return (
      allDeliveryLocationZones["lagos"]?.(
        total || 0,
        currency,
        deliveryDate || dayjs()
      ) || []
    );
  }, [currency, deliveryDate, total]);

  const selectedZone =
    allDeliveryLocationZones[formData.state]?.(
      total || 0,
      currency,
      deliveryDate || dayjs()
    )?.find(zone => zone.value === formData.zone) || null;

  if (pageLoading) {
    return (
      <div className={styles.loader}>
        <img src="/images/spinner.svg" alt="loader" className={styles.icon} />
        <span className={styles["load-intro"]}>
          {currentStage === 1 ? "Preparing your order. . ." : "Loading. . ."}
        </span>
      </div>
    );
  }

  const markAsPaid = () => {
    setIsPaid(true);
    setCurrentStage(3);
  };

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
                    {redirectUrl && (
                      <Link href={redirectUrl}>
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
                              />
                            </div>
                          ) : (
                            <div className="input-group half-width compact">
                              <span className="question">
                                Pickup/Delivery Date
                              </span>
                              <DatePicker
                                value={deliveryDate}
                                onChange={setDeliveryDate}
                                format="D MMMM YYYY"
                                responsive
                                disablePastDays
                              />
                            </div>
                          )}
                        </div>
                        {!user && (
                          <div className="input-group half-width compact">
                            <span className="question">
                              Pickup/Delivery Date
                            </span>
                            <DatePicker
                              value={deliveryDate}
                              onChange={setDeliveryDate}
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
                              {formData.state === "abuja" && (
                                <div className="input-group">
                                  <span className="question">
                                    Delivery Zones
                                  </span>
                                  <Select
                                    onSelect={value =>
                                      handleChange("zone", value)
                                    }
                                    value={formData.zone}
                                    options={abujaDeliveryZoneOptions}
                                    placeholder="Select a zone"
                                    responsive
                                    dimmed
                                    dropdownOnTop
                                  />
                                </div>
                              )}
                              {formData.state === "lagos" && (
                                <div className="input-group">
                                  <span className="question">
                                    Delivery Zones
                                  </span>
                                  <Select
                                    onSelect={value =>
                                      handleChange("zone", value)
                                    }
                                    value={formData.zone}
                                    options={lagosDeliveryZoneOptions}
                                    placeholder="Select a zone"
                                    responsive
                                    dimmed
                                    dropdownOnTop
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {formData.deliveryMethod === "delivery" &&
                            formData.state && (
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
                                    handleChange("pickUpLocation", "Ikoyi")
                                  }
                                  checked={formData.pickUpLocation === "Ikoyi"}
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
                              <span className="question">
                                Select A Past Recipient{" "}
                                <em className="normal">
                                  (for logged in users)
                                </em>
                              </span>

                              <Select
                                onSelect={phone =>
                                  setSelectedRecipient(
                                    user?.recipients.find(
                                      recipient => recipient.phone === phone
                                    ) || null
                                  )
                                }
                                value={selectedRecipient?.phone || ""}
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
                              <span className="question">
                                Detailed Home Address
                              </span>

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
                            <Checkbox
                              checked={formData.shouldSaveAddress}
                              onChange={value =>
                                handleChange("shouldSaveAddress", value)
                              }
                              text="Save Recipient"
                            />
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
                              placeholder="E.g Drop it with the waiter"
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
                        <div className="flex center-align spaced-lg">
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
                    Order{" "}
                    {order?.deliveryStatus &&
                      deliveryMap[
                        order?.deliveryStatus as keyof typeof deliveryMap
                      ]}
                  </p>
                  <p className={styles["order-number"]}>
                    Order No:{" "}
                    <span className={styles.bold}>
                      {order?.fullOrderId || ""}
                    </span>
                  </p>
                  {isDelivered(order?.deliveryStatus) && (
                    <div
                      className={`flex center-align spaced ${styles["order-info"]}`}
                    >
                      <div className={styles.icon}>
                        <img
                          src="icons/info.svg"
                          alt="information"
                          className="generic-icon"
                        />
                      </div>
                      <p>
                        Your order was received, please note your order number
                        in every correspondence with us.
                      </p>
                    </div>
                  )}
                  <Button
                    className={styles["shopping-btn"]}
                    onClick={() => router.push("/product-category/bouquets")}
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
                {deliveryStage === "sender-info" && (
                  <div>
                    <div className="flex align-center between">
                      <p className={styles.title}>Sender's Information</p>
                      {/* <strong className="primary-color underline">Login</strong> */}
                      <Button
                        type="plain"
                        onClick={() => setShouldShowAuthDropdown(true)}
                        className="primary-color underline"
                      >
                        Login
                      </Button>
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
                          required
                          showPasswordIcon
                        />
                      </div>
                    )}

                    <div className="input-group">
                      <span className="question">Pickup/Delivery Date</span>
                      <DatePicker
                        value={deliveryDate}
                        onChange={setDeliveryDate}
                        format="D MMMM YYYY"
                        responsive
                        disablePastDays
                      />
                    </div>

                    {!user && (
                      <Checkbox
                        checked={formData.freeAccount}
                        onChange={value => handleChange("freeAccount", value)}
                        text="Create a Free Account"
                      />
                    )}
                    <Button
                      onClick={() => setDeliveryStage("delivery-type")}
                      className="vertical-margin xl"
                      responsive
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
                    <div className={styles["sender-info"]}>
                      {formData.senderName && <p>{formData.senderName}</p>}
                      {formData.senderEmail && <p>{formData.senderEmail}</p>}
                      {formData.senderPhoneNumber && (
                        <p>{formData.senderPhoneNumber}</p>
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

                            {formData.state === "abuja" && (
                              <div className="input-group">
                                <span className="question">Delivery Zones</span>
                                <Select
                                  onSelect={value =>
                                    handleChange("zone", value)
                                  }
                                  value={formData.zone}
                                  options={abujaDeliveryZoneOptions}
                                  placeholder="Select a zone"
                                  responsive
                                  dimmed
                                  dropdownOnTop
                                />
                              </div>
                            )}
                            {formData.state === "lagos" && (
                              <div className="input-group">
                                <span className="question">Delivery Zones</span>
                                <Select
                                  onSelect={value =>
                                    handleChange("zone", value)
                                  }
                                  value={formData.zone}
                                  options={lagosDeliveryZoneOptions}
                                  placeholder="Select a zone"
                                  responsive
                                  dimmed
                                  dropdownOnTop
                                />
                              </div>
                            )}
                          </>
                        )}

                        {formData.deliveryMethod === "delivery" &&
                          formData.state && (
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

                              {deliveryLocationOptions.map(locationOption => (
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
                                      formData.deliveryLocation ===
                                      locationOption
                                    }
                                  />
                                </div>
                              ))}
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
                                  handleChange("pickUpLocation", "Ikoyi")
                                }
                                checked={formData.pickUpLocation === "Ikoyi"}
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

                    <Button
                      onClick={() =>
                        setDeliveryStage(
                          formData.deliveryMethod === "delivery"
                            ? "receiver"
                            : "customization-message"
                        )
                      }
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
                    <div className={styles["sender-info"]}>
                      {formData.senderName && <p>{formData.senderName}</p>}
                      {formData.senderEmail && <p>{formData.senderEmail}</p>}
                      {formData.senderPhoneNumber && (
                        <p>{formData.senderPhoneNumber}</p>
                      )}
                    </div>
                    <div className="flex between">
                      <p className={styles.title}>Delivery Type</p>
                      <strong
                        onClick={() => setDeliveryStage("delivery-type")}
                        className="primary-color underline"
                      >
                        Edit
                      </strong>
                    </div>
                    <div className={`${styles["sender-info"]} flex between`}>
                      <p>Delivery</p>
                      <p>{formData.state}</p>
                    </div>
                    {formData.deliveryMethod === "delivery" && (
                      <div>
                        <p className={styles.title}>Receiver's Information</p>
                        <div className={styles.padding}>
                          <div className="input-group">
                            <span className="question">
                              Select A Past Recipient{" "}
                              <em className="normal">(for logged in users)</em>
                            </span>

                            <Select
                              onSelect={phone =>
                                setSelectedRecipient(
                                  user?.recipients.find(
                                    recipient => recipient.phone === phone
                                  ) || null
                                )
                              }
                              value={selectedRecipient?.phone || ""}
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
                              options={getOptionsFromArray(["Home", "Office"])}
                              placeholder="Select a residence type"
                              responsive
                              dimmed
                            />
                          </div>
                          <div className="input-group">
                            <span className="question">
                              Detailed Home Address
                            </span>

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
                          <Checkbox
                            checked={formData.shouldSaveAddress}
                            onChange={value =>
                              handleChange("shouldSaveAddress", value)
                            }
                            text="Save Address"
                          />
                        </div>
                        <Button
                          onClick={() =>
                            setDeliveryStage("customization-message")
                          }
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
                    <div className={styles["sender-info"]}>
                      {formData.senderName && <p>{formData.senderName}</p>}
                      {formData.senderEmail && <p>{formData.senderEmail}</p>}
                      {formData.senderPhoneNumber && (
                        <p>{formData.senderPhoneNumber}</p>
                      )}
                    </div>
                    <div className="flex between">
                      <p className={styles.title}>Delivery Type</p>
                      <strong
                        onClick={() => setDeliveryStage("delivery-type")}
                        className="primary-color underline"
                      >
                        Edit
                      </strong>
                    </div>
                    <div className={`${styles["sender-info"]} flex between`}>
                      <p>Delivery</p>
                      <p>{formData.state}</p>
                    </div>
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
                      <div className={`${styles["sender-info"]}`}>
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
                          placeholder="E.g Drop it with the waiter"
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
                <div className={`${styles.border} padded`}>
                  <div className="flex between ">
                    <span className="normal-text">Order Total</span>
                    <span className="normal-text bold">
                      {getPriceDisplay(total, currency)}
                    </span>
                  </div>
                  {formData.deliveryMethod === "pick-up" && (
                    <div className="flex between">
                      <span className="normal-text">Delivery</span>
                      <span className="normal-text bold">
                        {getPriceDisplay(total || 0, currency)}
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
                  <p className={`${styles.info} flex center-align spaced`}>
                    <InfoIcon fill="#1C6DD0" />{" "}
                    <span>
                      Kindly select $ or £ for international payment options
                    </span>{" "}
                  </p>
                  <div className="flex  spaced-lg column ">
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

                  <div className={styles["payment-methods"]}>
                    {paymentMethods.map((method, index) => (
                      <div key={index}>
                        <div
                          className={[styles.method].join(" ")}
                          onClick={() =>
                            paymentHandlerMap[method.paymentName]()
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
                </div>

                <div className={styles["order-summary"]}>
                  <p className={[styles.detail].join(" ")}>Order Details</p>

                  <div className={[styles["order-details"]].join(" ")}>
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
              (
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
    <Modal visible={visible} cancel={cancel}>
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
