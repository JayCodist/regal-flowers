import { FunctionComponent, useState } from "react";
import Button from "../../components/button/Button";
import Checkbox from "../../components/checkbox/Checkbox";
import Input, { TextArea } from "../../components/input/Input";
import Radio from "../../components/radio/Radio";
import Select from "../../components/select/Select";
import { deliveryStates } from "../../utils/constants";
import { InfoRedIcon } from "../../utils/resources";
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
  homeAddress: ""
};

const Checkout: FunctionComponent = () => {
  const [formData, setFormData] = useState(initialData);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const handleChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  return (
    <section className={styles["checkout-page"]}>
      <form className={styles.left}>
        <div className={styles.border}>
          <p className={styles.info}>Sender's Information</p>
          <div className={styles.padding}>
            <div className="flex spaced-xl vertical-margin">
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
            <div className="flex spaced-xl vertical-margin">
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
        <div className={[styles.border, styles["delivey-method"]].join(" ")}>
          <p className={styles.info}>Delivery Method</p>
          <div className={styles.padding}>
            <div className="flex between center-align">
              <div
                className={[
                  styles.method,
                  deliveryMethod === "delivery" && styles.active
                ].join(" ")}
                onClick={() => setDeliveryMethod("delivery")}
              >
                <p className="small-text bold">Delivery</p>
                <p className="small-text">
                  Get it delivered to the recipient's location
                </p>
              </div>
              <div
                className={[
                  styles.method,
                  deliveryMethod === "pickup" && styles.active
                ].join(" ")}
                onClick={() => setDeliveryMethod("pickup")}
              >
                <p className="small-text bold">Pick Up</p>
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
            {deliveryMethod === "pickup" && (
              <div className={styles["pickup-locations"]}>
                <p className="primary-color align-icon normal-text bold margin-bottom">
                  <InfoRedIcon />
                  <span className="margin-left">Pick Up Locations</span>
                </p>
                <div className="">
                  <Radio
                    defaultChecked
                    label="Lagos, Ikoyi"
                    onChange={() => handleChange("pickupLocation", "ikoyi")}
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
                    checked={formData.pickupLocation === "victoria-island"}
                  />
                </div>

                <div className="vertical-margin">
                  <Radio
                    defaultChecked
                    label="Lagos, Lagos Island"
                    onChange={() => handleChange("pickupLocation", "island")}
                    checked={formData.pickupLocation === "island"}
                  />
                </div>
                <div className="vertical-margin">
                  <Radio
                    defaultChecked
                    label="Lagos, Lekki Phase 1 only"
                    onChange={() => handleChange("pickupLocation", "lekki")}
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
                    checked={formData.pickupLocation === "between-lekki"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.border}>
          <p className={styles.info}>Sender's Information</p>
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
                  onChange={value => handleChange("deliveryDate", value)}
                  dimmed
                  responsive
                />
              </div>
            </div>
            <div className="flex spaced-xl vertical-margin">
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
            />
          </div>
        </div>
      </form>

      <form className={styles.right}>
        <div className="flex between margin-bottom spaced">
          <p className="sub-heading bold">Cart Summary</p>
          <p className="sub-heading bold primary-color underline">View Cart</p>
        </div>
        <div className={`${styles.border} padded`}>
          <div className="flex between margin-bottom">
            <span className="normal-text">Subtotal</span>
            <span className="normal-text bold">₦36,000</span>
          </div>
          <div className="flex between">
            <span className="normal-text">Add-Ons total</span>
            <span className="normal-text bold">₦136,000</span>
          </div>
          <div className="flex center-align vertical-margin">
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
          <Button responsive>Proceed to Payment</Button>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
