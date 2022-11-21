import dayjs from "dayjs";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { useRouter } from "next/router";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Checkbox from "../../components/checkbox/Checkbox";
import DatePicker from "../../components/date-picker/DatePicker";
import Input, { TextArea } from "../../components/input/Input";
import PhoneInput from "../../components/phone-input/PhoneInput";
import Radio from "../../components/radio/Radio";
import Select, { Option } from "../../components/select/Select";
import {
  currencyOptions,
  deliveryStates,
  paymentMethod
} from "../../utils/constants";
import SettingsContext from "../../utils/context/SettingsContext";
import { getOrder, updateOrder } from "../../utils/helpers/data/order";
import { getZoneGroups } from "../../utils/helpers/data/zone-group";
import { emailValidator } from "../../utils/helpers/validators";
import {
  BitcoinGoldIcon,
  BuildingRedIcon,
  InfoIcon,
  InfoRedIcon,
  PaypalBlueIcon
} from "../../utils/resources";
import { Order, OrderUpdate, PaymentName } from "../../utils/types/Order";
import styles from "./index.module.scss";

const initialData = {
  senderName: "",
  senderEmail: "",
  senderPhoneNumber: "",
  senderPassword: "",
  freeAccount: true,
  coupon: "",
  deliveryMethod: "delivery",
  deliveryState: "",
  pickUpLocation: "",
  recipientName: "",
  deliveryDate: null,
  recipientPhoneNumber: "",
  recipientPhoneNumberAlt: "",
  residenceType: "",
  recipientHomeAddress: "",
  additionalInfo: "",
  message: "",
  purpose: "",
  cardName: "",
  cardExpiry: "",
  cardNumber: "",
  cardCVV: "",
  recipientCountryCode: "",
  senderCountryCode: "",
  recipientAltCountryCode: "",
  recipientEmail: "",
  pickUpState: ""
};

const orderSample = {
  name: "A Kiss of Rose",
  price: 6000,
  details: "Single stem rose available in red, white, pink and yel...",
  quantity: 1,
  size: "Extra Small",
  design: "Wrapped Bouquet",
  addons: [
    {
      name: "5 Peas in a pod",
      price: 32999,
      image: "/images/addons/Rectangle131.png"
    },
    {
      name: "5 Peas in a pod",
      price: 36000,
      image: "/images/addons/Rectangle13.png"
    }
  ],
  id: "1",
  image: "/images/sample-flowers/sample-1.png"
};

const Checkout: FunctionComponent = () => {
  const [formData, setFormData] = useState<OrderUpdate>(initialData);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pick-up">(
    "delivery"
  );
  // const [selectedMethod, setSelectedMethod] = useState<number | null>();
  const [pageLoading, setPageLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [expandedOrderSummary, setExpandedOrderSummary] = useState<{
    order?: boolean;
    payment?: boolean;
  }>({ order: true, payment: false });
  const [isPaid, setIsPaid] = useState(false);
  const [pickUpOptions, setPickUpOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentStage, setCurrentStage, currency, setCurrency } = useContext(
    SettingsContext
  );

  const payStackConfig: PaystackProps = {
    reference: new Date().getTime().toString(),
    email: "jaycodist@gmail.com",
    amount: 200 * 100,
    publicKey: "pk_test_d4948f2002e85ddfd66c71bf10d9fa969fb163b4",
    channels: ["card", "bank", "ussd", "qr", "mobile_money"]
  };

  const initializePayment = usePaystackPayment(payStackConfig);

  const {
    query: { orderId }
  } = useRouter();
  const router = useRouter();

  const handleChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const fetchOrder = async () => {
    setPageLoading(true);
    const res = await getOrder(orderId as string);
    const { error, data } = res;

    if (error) {
      router.push("/");
    } else {
      setOrder(data);
      setFormData({
        ...formData,
        deliveryDate: dayjs(data?.deliveryDate)
      });
      setIsPaid(
        /go\s*ahead/i.test(data?.paymentStatus || "") ||
          /^paid/i.test(data?.paymentStatus || "")
      );
    }

    setPageLoading(false);
  };

  const fetchZoneGroups = async () => {
    const res = await getZoneGroups();
    const { error, message, data } = res;

    if (error) {
      console.log(message);
    } else {
      setPickUpOptions(
        data?.map(item => ({
          label: item,
          value: item
        })) || []
      );

      setPickUpOptions(
        data
          ?.filter(item => {
            if (item !== "Unselected State" && item !== "Outside Nigeria") {
              return item;
            }
          })
          ?.map(item => ({
            label: item,
            value: item
          })) || []
      );
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    fetchZoneGroups();
  }, []);

  useEffect(() => {
    if (isPaid) {
      // setCurrentStage(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid]);

  const handleSubmit = async () => {
    setLoading(true);

    console.log(order);

    const response = await updateOrder(orderId as string, formData);

    const { error, message } = response;

    if (error) {
      console.log(message);
    } else {
      setCurrentStage(2);
    }

    setLoading(false);
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

  if (pageLoading) {
    return (
      <div className={styles.loader}>
        <img src="/images/spinner.svg" alt="loader" />
      </div>
    );
  }

  const paymentHandlerMap: Record<PaymentName, () => void> = {
    paystack: () => {
      interface PaystackSuccessResponse {
        reference: string;
        trans: string;
        status: "success";
        message: "Approved";
        transaction: "2170915167";
        trxref: string;
        redirecturl: "?trxref=1665324172269&reference=1665324172269";
      }
      const successHandler: (ref?: PaystackSuccessResponse) => void = ref => {
        console.log({ ref });
      };
      initializePayment(successHandler, () => {
        console.log("Closed");
      });
    },
    bankTransfer: () => {},
    googlePay: () => {},
    payPal: () => {}
  };

  return (
    <section className={styles["checkout-page"]}>
      {currentStage <= 2 && (
        <div className={styles["checkout-wrapper"]}>
          <form className={`${styles.left} scrollable`}>
            {currentStage === 1 && (
              <>
                <div className={styles.border}>
                  <p className={styles["payment-info"]}>Sender's Information</p>
                  <div className={styles.padding}>
                    <div className="flex spaced-xl">
                      <div className="input-group">
                        <span className="question">Name</span>
                        <Input
                          name="name"
                          placeholder="Name"
                          value={formData.senderName}
                          onChange={value => handleChange("senderName", value)}
                          dimmed
                          responsive
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
                          onBlurValidation={() =>
                            emailValidator(formData.senderEmail)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex spaced-xl">
                      <PhoneInput
                        phoneNumber={
                          (formData.senderPhoneNumber as unknown) as number
                        }
                        countryCode={formData.senderCountryCode || "+234"}
                        onChangePhoneNumber={value =>
                          handleChange("senderPhoneNumber", value)
                        }
                        onChangeCountryCode={value =>
                          handleChange("senderCountryCode", value)
                        }
                      />
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
                        />
                      </div>
                    </div>
                    <Checkbox
                      checked={formData.freeAccount}
                      onChange={value => handleChange("freeAccount", value)}
                      text="Create a Free Account"
                    />
                  </div>
                </div>
                <div
                  className={[styles.border, styles["delivey-method"]].join(
                    " "
                  )}
                >
                  <p className={styles["payment-info"]}>Delivery Method</p>
                  <div className={styles.padding}>
                    <div className="flex between center-align">
                      <div
                        className={[
                          styles.method,
                          deliveryMethod === "delivery" && styles.active
                        ].join(" ")}
                        onClick={() => setDeliveryMethod("delivery")}
                      >
                        <p className={`${styles["method-title"]}`}>Delivery</p>
                        <p className="">
                          Get it delivered to the recipient's location
                        </p>
                      </div>
                      <div
                        className={[
                          styles.method,
                          deliveryMethod === "pick-up" && styles.active
                        ].join(" ")}
                        onClick={() => setDeliveryMethod("pick-up")}
                      >
                        <p className={`${styles["method-title"]}`}>Pick Up</p>
                        <p className="">Pick up from our store</p>
                      </div>
                    </div>
                    <div className="input-group half-width">
                      <span className="question">
                        {" "}
                        {deliveryMethod === "delivery"
                          ? "Delivery"
                          : "Pick Up"}{" "}
                        State
                      </span>

                      <Select
                        onSelect={value =>
                          handleChange(
                            deliveryMethod === "delivery"
                              ? "deliveryState"
                              : "PickUpState",
                            value
                          )
                        }
                        value={
                          deliveryMethod === "delivery"
                            ? formData.deliveryState
                            : formData.pickUpState
                        }
                        options={
                          deliveryMethod === "delivery"
                            ? deliveryStates
                            : pickUpOptions
                        }
                        placeholder="Select a state"
                        responsive
                        dimmed
                      />
                    </div>
                    {deliveryMethod === "pick-up" && (
                      <div className={styles["pickup-locations"]}>
                        <p className="primary-color align-icon normal-text bold margin-bottom">
                          <InfoRedIcon />
                          <span className="margin-left">Pick Up Locations</span>
                        </p>
                        <div className="">
                          <Radio
                            defaultChecked
                            label="Lagos, Ikoyi"
                            onChange={() =>
                              handleChange("pickUpLocation", "ikoyi")
                            }
                            checked={formData.pickUpLocation === "ikoyi"}
                          />
                        </div>
                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Victoria Island"
                            onChange={() =>
                              handleChange("pickUpLocation", "victoria-island")
                            }
                            checked={
                              formData.pickUpLocation === "victoria-island"
                            }
                          />
                        </div>

                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Lagos Island"
                            onChange={() =>
                              handleChange("pickUpLocation", "island")
                            }
                            checked={formData.pickUpLocation === "island"}
                          />
                        </div>
                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Lekki Phase 1 only"
                            onChange={() =>
                              handleChange("pickUpLocation", "lekki")
                            }
                            checked={formData.pickUpLocation === "lekki"}
                          />
                        </div>
                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Bettween Lekki Phase 1 - Ikate/Chevron/Mega Chicken  B/Stop"
                            onChange={() =>
                              handleChange("pickUpLocation", "between-lekki")
                            }
                            checked={
                              formData.pickUpLocation === "between-lekki"
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.border}>
                  <p className={styles["payment-info"]}>
                    Receiver's Information
                  </p>
                  <div className={styles.padding}>
                    <div className="input-group">
                      <span className="question">Select A Past Recipient</span>

                      <Select
                        onSelect={value => handleChange("deliveryState", value)}
                        value={formData.deliveryState}
                        options={[]}
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
                          placeholder=""
                          value={formData.recipientName}
                          onChange={value =>
                            handleChange("recipientName", value)
                          }
                          dimmed
                          responsive
                        />
                      </div>
                      <div className="input-group">
                        <span className="question">Delivery Date</span>
                        <DatePicker
                          value={formData.deliveryDate}
                          onChange={value =>
                            handleChange("deliveryDate", value)
                          }
                          format="DD/MM/YYYY"
                          responsive
                        />
                      </div>
                    </div>
                    <div className="flex spaced-xl">
                      <PhoneInput
                        phoneNumber={
                          (formData.recipientPhoneNumber as unknown) as number
                        }
                        countryCode={formData.recipientCountryCode || "+234"}
                        onChangePhoneNumber={value =>
                          handleChange("recipientPhoneNumber", value)
                        }
                        onChangeCountryCode={value =>
                          handleChange("recipientCountryCode", value)
                        }
                      />

                      <PhoneInput
                        phoneNumber={
                          (formData.recipientPhoneNumberAlt as unknown) as number
                        }
                        countryCode={formData.recipientAltCountryCode || "+234"}
                        onChangePhoneNumber={value =>
                          handleChange("recipientPhoneNumberAlt", value)
                        }
                        onChangeCountryCode={value =>
                          handleChange("recipientAltCountryCode", value)
                        }
                        question="Alternative Phone Number (Optional)"
                      />
                    </div>
                    <div className="input-group half-width">
                      <span className="question">Residence Type</span>

                      <Select
                        onSelect={value => handleChange("residenceType", value)}
                        value={formData.residenceType}
                        options={[]}
                        placeholder="Select a residence type"
                        responsive
                        dimmed
                      />
                    </div>
                    <div className="input-group">
                      <span className="question">Detailed Home Address</span>

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
                      checked={formData.freeAccount}
                      onChange={value => handleChange("freeAccount", value)}
                      text="Save Address"
                      type="transparent"
                    />
                  </div>
                </div>
                <div className={styles.border}>
                  <p className={styles["payment-info"]}>Optional Message</p>
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
                        options={[]}
                        placeholder="Select Purpose"
                        responsive
                        dimmed
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="half-width"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Proceed to Payment
                </Button>
              </>
            )}
            {currentStage === 2 && (
              <>
                <div className={styles.border}>
                  <p className={styles["payment-info"]}>Payment Method</p>
                  <div className={styles.padding}>
                    <div className="flex center-align spaced-lg">
                      <p className="normal-text bold vertical-margin spaced">
                        Select your preferred currency
                      </p>
                      <div className="flex spaced-lg">
                        {currencyOptions.map((_currency, index) => (
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
                      {paymentMethod.map((method, index) => (
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
                <Button
                  className="half-width"
                  onClick={() => setCurrentStage(3)}
                >
                  Pay Now
                </Button>
              </>
            )}
          </form>

          {currentStage <= 2 && (
            <form className={styles.right}>
              <div className="flex between margin-bottom spaced">
                <p className="sub-heading bold">Cart Summary</p>
                <p className="sub-heading bold primary-color underline">
                  View Cart
                </p>
              </div>
              <div className={`${styles.border} padded`}>
                <div className="flex between ">
                  <span className="normal-text">Subtotal</span>
                  <span className="normal-text bold">₦{order?.cost}</span>
                </div>
                <div className="flex between vertical-margin">
                  <span className="normal-text">Add-Ons total</span>
                  <span className="normal-text bold">₦{order?.cost}</span>
                </div>
                {deliveryMethod === "pick-up" && (
                  <div className="flex between">
                    <span className="normal-text">Delivery Charge</span>
                    <span className="normal-text bold">₦{order?.cost}</span>
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
                  <span className="normal-text bold">₦196,000</span>
                </div>
                {currentStage === 1 ? (
                  <Button responsive onClick={handleSubmit} loading={loading}>
                    Proceed to Payment
                  </Button>
                ) : (
                  <Button responsive onClick={() => setCurrentStage(3)}>
                    Pay Now
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
                    <PaypalBlueIcon />
                    <BitcoinGoldIcon />
                    <BuildingRedIcon />
                    <img
                      src="/icons/paystack.png"
                      alt="pay stack"
                      className="generic-icon large"
                    />
                  </div>
                </div>
              )}
            </form>
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
                <span className={styles.bold}>{order?.fullOrderId}</span>{" "}
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
                    Your order was received, please note your order number in
                    every correspondence with us.
                  </p>
                </div>
              )}
              <Button className={styles["shopping-btn"]}>
                Continue Shopping
              </Button>
              {isDelivered(order?.deliveryStatus) && (
                <Link href="/#">
                  <a className={styles.track}>Track Order</a>
                </Link>
              )}
            </div>

            <div className={styles["account-wrapper"]}>
              <p className="sub-heading bold margin-bottom spaced">
                Create a Free Account
              </p>
              <p className="margin-bottom">
                Manage orders, address book and save time when checking out by
                creating a free account today!
              </p>
              <Button className="half-width">Create a Free Account</Button>
            </div>
          </div>
          <div className={styles["order-summary"]}>
            <p className="sub-heading bold">Order Summary</p>
            <p className="normal-text">
              A copy has been sent to your mail for reference.
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
                <div key={index}>
                  <div className="flex between spaced center-align">
                    <img
                      className={styles["order-image"]}
                      src={orderSample.image}
                      alt="order"
                    />
                    <div>
                      <p className="margin-bottom spaced">{item.name}</p>
                      <p>{orderSample.details}</p>
                    </div>
                    <p className="sub-heading bold">₦{orderSample.price}</p>
                  </div>
                  <div className={styles["order-detail"]}>
                    <p>
                      <span className="margin-right">Qty:</span> {item.quantity}
                    </p>
                    <p className="vertical-margin spaced">
                      <span className="margin-right">Size:</span>{" "}
                      {orderSample.size}
                    </p>
                    {/* <p className="margin-bottom spaced">
                      <span className="margin-right">Design:</span>{" "}
                      {orderSample.design}
                    </p> */}
                    {/* <p className="margin-bottom">Add Ons</p> */}
                    {/* {orderSample.addons.map((addon, index) => (
                      <div
                        className="flex between spaced margin-bottom center-align"
                        key={index}
                      >
                        <img
                          src={addon.image}
                          alt="addon image"
                          className={styles["addon-image"]}
                        />
                        <div>
                          <p className="margin-bottom">{addon.name}</p>
                          <p className={styles["light-gray"]}>Tom Ford x 1</p>
                        </div>
                        <p className="normal-text bold">₦{addon.price}</p>
                      </div>
                    ))} */}
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
                <span className="bold">₦{order?.cost}</span>
              </div>
              <div className="flex between normal-text margin-bottom spaced">
                <span>Add-Ons total</span>
                <span className="bold">₦{order?.cost}</span>
              </div>
              <div className="flex between normal-text margin-bottom spaced">
                <div>
                  <span>Delivery Charge</span>
                  <p className={`${styles["light-gray"]}`}>Lagos</p>
                </div>
                <span className="bold">₦6,000</span>
              </div>
              <div className="flex between normal-text margin-bottom spaced">
                <div>
                  <span>Payment Method</span>
                  <p className={`${styles["light-gray"]}`}>
                    Card ending with 3412
                  </p>
                </div>
                <span className="bold">Bank Transfer</span>
              </div>
              <hr className="hr margin-bottom spaced" />
              <div className="flex between sub-heading margin-bottom spaced">
                <span>Total</span>
                <span className="bold primary-color">₦196,000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checkout;

// const isPaid = paymentStatus => {
//   return /go\s*ahead/i.test(paymentStatus) || /^paid/i.test(paymentStatus);
// };
