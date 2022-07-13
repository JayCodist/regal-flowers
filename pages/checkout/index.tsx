import Link from "next/link";
import { FunctionComponent, useContext, useState } from "react";
import Button from "../../components/button/Button";
import Checkbox from "../../components/checkbox/Checkbox";
import Input, { TextArea } from "../../components/input/Input";
import Radio from "../../components/radio/Radio";
import Select from "../../components/select/Select";
import {
  defaultCurrency,
  deliveryStates,
  paymentMethod
} from "../../utils/constants";
import SettingsContext from "../../utils/context/SettingsContext";
import {
  BitcoinGoldIcon,
  BuildingRedIcon,
  InfoIcon,
  InfoRedIcon,
  PaypalBlueIcon
} from "../../utils/resources";
import { AppCurrency } from "../../utils/types/Core";
import { Order } from "../../utils/types/Order";
import styles from "./index.module.scss";

const initialData = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  freeAccount: true,
  coupon: "",
  deliveryMethod: "delivery",
  deliveryState: "",
  pickupLocation: "",
  fullName: "",
  deliveryDate: "",
  recipientPhoneNumber: "",
  recipientPhoneNumberAlt: "",
  residenceType: "",
  homeAddress: "",
  additionalInfo: "",
  message: "",
  purpose: "",
  cardName: "",
  cardExpiry: "",
  cardNumber: "",
  cardCVV: ""
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
} as Order;

const Checkout: FunctionComponent = () => {
  const [formData, setFormData] = useState(initialData);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pick-up">(
    "delivery"
  );
  const { currentStage, setCurrentStage, currency, setCurrency } = useContext(
    SettingsContext
  );
  const [selectedMethod, setSelectedMethod] = useState<number | null>();

  const handleChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const currencyOptions: AppCurrency[] = [
    { ...defaultCurrency },
    { name: "USD", conversionRate: 415, sign: "$" },
    { name: "GBP", conversionRate: 523, sign: "£" }
  ];

  const [expandedOrderSummary, setExpandedOrderSummary] = useState<{
    order?: boolean;
    payment?: boolean;
  }>({ order: true, payment: false });

  const [order] = useState(orderSample);

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
                        <span className="question">Product name</span>
                        <Input
                          name="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={value => handleChange("name", value)}
                          dimmed
                          responsive
                        />
                      </div>
                      <div className="input-group">
                        <span className="question">Email</span>
                        <Input
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={value => handleChange("email", value)}
                          dimmed
                          responsive
                        />
                      </div>
                    </div>
                    <div className="flex spaced-xl">
                      <div className="input-group">
                        <span className="question">Phone Number</span>
                        <Input
                          name="phoneNumber"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={value => handleChange("phoneNumber", value)}
                          dimmed
                          responsive
                        />
                      </div>
                      <div className="input-group">
                        <span className="question">Create Password</span>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={value => handleChange("password", value)}
                          dimmed
                          responsive
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
                        <p
                          className={`small-text bold ${styles["method-title"]}`}
                        >
                          Delivery
                        </p>
                        <p className="small-text">
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
                        <p
                          className={`small-text bold ${styles["method-title"]}`}
                        >
                          Pick Up
                        </p>
                        <p className="small-text">Pick up from our store</p>
                      </div>
                    </div>
                    <div className="input-group half-width">
                      <span className="question">Delivery State</span>

                      <Select
                        onSelect={value => handleChange("deliveryState", value)}
                        value={formData.deliveryState}
                        options={deliveryStates.map(state => ({
                          value: state.value,
                          label: state.label
                        }))}
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
                              handleChange("pickupLocation", "ikoyi")
                            }
                            checked={formData.pickupLocation === "ikoyi"}
                          />
                        </div>
                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Victoria Island"
                            onChange={() =>
                              handleChange("pickupLocation", "victoria-island")
                            }
                            checked={
                              formData.pickupLocation === "victoria-island"
                            }
                          />
                        </div>

                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Lagos Island"
                            onChange={() =>
                              handleChange("pickupLocation", "island")
                            }
                            checked={formData.pickupLocation === "island"}
                          />
                        </div>
                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Lekki Phase 1 only"
                            onChange={() =>
                              handleChange("pickupLocation", "lekki")
                            }
                            checked={formData.pickupLocation === "lekki"}
                          />
                        </div>
                        <div className="vertical-margin">
                          <Radio
                            defaultChecked
                            label="Lagos, Bettween Lekki Phase 1 - Ikate/Chevron/Mega Chicken  B/Stop"
                            onChange={() =>
                              handleChange("pickupLocation", "between-lekki")
                            }
                            checked={
                              formData.pickupLocation === "between-lekki"
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.border}>
                  <p className={styles["payment-info"]}>Sender's Information</p>
                  <div className={styles.padding}>
                    <div className="input-group">
                      <span className="question">Select A Past Recipient</span>

                      <Select
                        onSelect={value => handleChange("deliveryState", value)}
                        value={formData.deliveryState}
                        options={[]}
                        placeholder="Select Recipient"
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
                          value={formData.fullName}
                          onChange={value => handleChange("fullName", value)}
                          dimmed
                          responsive
                        />
                      </div>
                      <div className="input-group">
                        <span className="question">Delivery Date</span>
                        <Input
                          name="email"
                          placeholder="Email"
                          value={formData.deliveryDate}
                          onChange={value =>
                            handleChange("deliveryDate", value)
                          }
                          dimmed
                          responsive
                        />
                      </div>
                    </div>
                    <div className="flex spaced-xl">
                      <div className="input-group">
                        <span className="question">Phone Number</span>
                        <Input
                          value={formData.recipientPhoneNumber}
                          onChange={value =>
                            handleChange("recipientPhoneNumber", value)
                          }
                          dimmed
                          responsive
                        />
                      </div>
                      <div className="input-group">
                        <span className="question">
                          Alternative Phone Number (Optional)
                        </span>
                        <Input
                          value={formData.recipientPhoneNumberAlt}
                          onChange={value =>
                            handleChange("recipientPhoneNumberAlt", value)
                          }
                          dimmed
                          responsive
                        />
                      </div>
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
                        value={formData.homeAddress}
                        placeholder="To help us deliver better, please be detailed as possible"
                        onChange={value => handleChange("homeAddress", value)}
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
                  onClick={() => setCurrentStage(2)}
                >
                  Proceed to Payment
                </Button>
              </>
            )}
            {currentStage === 2 && (
              <div className={styles.border}>
                <p className={styles["payment-info"]}>Payment Method</p>
                <div className={styles.padding}>
                  <div className="flex center-align spaced-lg">
                    <p className="normal-text bold vertical-margin spaced">
                      Select your preferred currency
                    </p>
                    <div className="flex spaced-lg">
                      {currencyOptions.map(_currency => (
                        <button
                          key={_currency.name}
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
                          className={[
                            styles.method,
                            selectedMethod === index && styles.active
                          ].join(" ")}
                          onClick={() => setSelectedMethod(index)}
                        >
                          <div className="flex spaced-lg center-align">
                            {method.icon}
                            <div>
                              <p className="normal-text bold">{method.name}</p>
                              <p className="small-text">{method.info}</p>
                            </div>
                          </div>
                          <div className="flex spaced center-align">
                            {method.other?.map((other, index) => (
                              <div key={index}>{other.icon}</div>
                            ))}
                          </div>
                        </div>
                        <div
                          className={[
                            styles["method-input"],
                            selectedMethod === index && styles.active
                          ].join(" ")}
                        >
                          <div className="flex spaced-xl">
                            <div className="input-group flex-one">
                              <span className="question">Name on card</span>
                              <Input
                                placeholder=""
                                value={formData.cardName}
                                onChange={value =>
                                  handleChange("cardName", value)
                                }
                                responsive
                              />
                            </div>

                            <div className="input-group responsive">
                              <span className="question">Expiry</span>
                              <Input
                                placeholder="06 / 2024"
                                value={formData.cardExpiry}
                                onChange={value =>
                                  handleChange("cardExpiry", value)
                                }
                                responsive
                              />
                            </div>
                          </div>
                          <div className="flex spaced-xl">
                            <div className="input-group flex-one">
                              <span className="question">Card number</span>
                              <Input
                                placeholder=""
                                value={formData.cardNumber}
                                onChange={value =>
                                  handleChange("cardNumber", value)
                                }
                                responsive
                              />
                            </div>

                            <div className="input-group responsive">
                              <span className="question">CVV</span>
                              <Input
                                value={formData.cardCVV}
                                onChange={value =>
                                  handleChange("cardCVV", value)
                                }
                                responsive
                                position="right"
                                icon="/icons/help.svg"
                              />
                            </div>
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
                <Button
                  className="half-width"
                  onClick={() => setCurrentStage(3)}
                >
                  Pay Now
                </Button>
              </div>
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
                  <span className="normal-text bold">₦36,000</span>
                </div>
                <div className="flex between vertical-margin">
                  <span className="normal-text">Add-Ons total</span>
                  <span className="normal-text bold">₦136,000</span>
                </div>
                {deliveryMethod === "pick-up" && (
                  <div className="flex between">
                    <span className="normal-text">Delivery Charge</span>
                    <span className="normal-text bold">₦136,000</span>
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
                  <Button responsive onClick={() => setCurrentStage(2)}>
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
      {currentStage === 3 && (
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
                Order No: <span className={styles.bold}>#312763612652</span>{" "}
              </p>
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
              <Button className="half-width">Continue Shopping</Button>
              <Link href="/#">
                <a className={styles.track}>Track Order</a>
              </Link>
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
              <div className="flex between spaced center-align">
                <img
                  className={styles["order-image"]}
                  src={order.image}
                  alt="order"
                />
                <div>
                  <p className="margin-bottom spaced">{order.name}</p>
                  <p>{order.details}</p>
                </div>
                <p className="sub-heading bold">₦{order.price}</p>
              </div>
              <div className={styles["order-detail"]}>
                <p className="small-text">
                  <span className="small-text bold margin-right">Qty:</span>{" "}
                  {order.quantity}
                </p>
                <p className="small-text vertical-margin spaced">
                  <span className="small-text bold margin-right">Size:</span>{" "}
                  {order.size}
                </p>
                <p className="small-text margin-bottom spaced">
                  <span className="small-text bold margin-right">Design:</span>{" "}
                  {order.design}
                </p>
                <p className="small-text bold margin-bottom">Add Ons</p>
                {order.addons.map((addon, index) => (
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
                ))}
              </div>
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
                <span className="bold">₦36,000</span>
              </div>
              <div className="flex between normal-text margin-bottom spaced">
                <span>Add-Ons total</span>
                <span className="bold">₦136,000</span>
              </div>
              <div className="flex between normal-text margin-bottom spaced">
                <div>
                  <span>Delivery Charge</span>
                  <p className={`small-text ${styles["light-gray"]}`}>Lagos</p>
                </div>
                <span className="bold">₦6,000</span>
              </div>
              <div className="flex between normal-text margin-bottom spaced">
                <div>
                  <span>Payment Method</span>
                  <p className={`small-text ${styles["light-gray"]}`}>
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
