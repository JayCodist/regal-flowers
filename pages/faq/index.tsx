import Link from "next/link";
import React, { FunctionComponent } from "react";
import FlowerCard from "../../components/FlowerCard/FlowerCard";
import styles from "./index.module.scss";

export const featuredFlowers = [
  {
    name: "5 Peas in a pod",
    price: 6000,
    image: "/images/flower.png"
  },
  {
    name: "5 Peas in a pod",
    price: 36000,
    image: "/images/flower.png"
  },
  {
    name: "5 Peas in a pod",
    price: 36000,
    image: "/images/flower.png"
  },
  {
    name: "5 Peas in a pod",
    price: 36000,
    image: "/images/flower.png"
  }
];

const Index: FunctionComponent = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.hero}>
        <h1>Freqently Asked Questions</h1>
      </div>
      <div className={styles.container}>
        <div className={`${styles.content} flex between spaced-xl`}>
          <ol className={`flex column ${styles.links}`}>
            <p className="title small bold">Table of content</p>
            <Link href="#how-it-works">
              <a className="vertical-margin">
                <span className="margin-right">1</span> How it works
              </a>
            </Link>
            <Link href="#payment-methods">
              <a className="margin-bottom">
                <span className="margin-right">2</span> Payment Method
              </a>
            </Link>
            <Link href="#delivery">
              <a>
                <span className="margin-right">3</span> Delivery
              </a>
            </Link>
          </ol>
          <div className={styles["linked-content"]}>
            <div id="how-it-works">
              <p className="title bold margin-bottom spaced">How it works</p>
              <p className="title small bold margin-bottom">
                How to order flowers and gifts for delivery?
              </p>
              <p className="margin-bottom spaced">
                For delivery of fresh flowers in Lagos, Nigeria or fresh flowers
                in Abuja, Nigeria:
              </p>
              <p>
                Browse, and add your desired flowers and gifts to your cart
                (don't forget to change the currency to USD if you are using a
                Non-Naira card or Paypal). Proceed to checkout where you fill in
                the delivery details (include the preferred delivery date,
                recipient's phone number and your optional message), and pay
                using any of the methods below this page. We can also work to
                suit your budget, desired colours, flower types etc.. Reach us
                at <span>info@regalflowers.com.ng</span> or +234 (0) 7010006665,
                +234 (0) 7011992888 to make your order. For any enquiries or to
                amend delivery details, message on the flowers etc, feel free to
                reach out to us.
              </p>
            </div>
            <div id="payment-methods" className="">
              <p className="title bold margin-bottom spaced">Payment Methods</p>
              <p className="title small bold margin-bottom">
                What payment methods are available?
              </p>
              <p className="margin-bottom">
                Online Payment Methods (Delivery fees included during checkout)
              </p>
              <p className="margin-buttton flex align-center spaced">
                <img
                  className="generic-icon medium"
                  src="./icons/bank-card.svg"
                  alt="card"
                />
                <span>Naira Mastercard/Visa/Verve Cards</span>
              </p>
              <p className="margin-buttton flex align-center spaced">
                <img
                  className="generic-icon medium"
                  src="./icons/paypal.svg"
                  alt="paypal"
                />{" "}
                <span>
                  {" "}
                  Paypal/Other Credit Cards online (change currency to $ in
                  product page first){" "}
                </span>
              </p>
              <div className={styles["payment-info"]}>
                <strong className="primary-color">Paypal to email </strong>
                <p>
                  Email Address: <strong> regalpaypal@gmail.com</strong>
                </p>
                <p>
                  Account Name: <strong> REGAL FLOWERS LTD</strong>
                </p>
              </div>
              <p className="margin-buttton flex align-center spaced">
                <img
                  className="generic-icon medium"
                  src="./icons/building.svg"
                  alt="paypal"
                />{" "}
                <span>
                  Transfer Methods (if applicable don't forget to include
                  delivery fees)
                </span>
              </p>
              <div className={styles["payment-info"]}>
                <strong className="primary-color margin-bottom">
                  Bank Transfers
                </strong>
                <p>
                  Bank Name: <strong>GTB</strong>
                </p>
                <p>
                  Account Name: <strong> REGAL FLOWERS LTD</strong>
                </p>

                <p>
                  Naira Account: <strong> 0252862666</strong>
                </p>
                <p>
                  Pounds Account: <strong> 0252862862</strong>
                </p>
                <p>
                  USD Account: <strong> 0252862673</strong>
                </p>
                <p>
                  Euros Account: <strong> 0252862680</strong>
                </p>
              </div>
              <p className="margin-buttton flex align-center spaced">
                <img
                  className="generic-icon medium"
                  src="./icons/bitcoin.svg"
                  alt="paypal"
                />{" "}
                <span>
                  Bitcoins, Wallet Address{" "}
                  <strong>12W9vKCcCbKFmYr9bYfbd9SqVvhyK5j4E1</strong>{" "}
                </span>
              </p>
              <p className="margin-buttton">
                Of course, we are only a call/email away should you require any
                assistance.
              </p>
            </div>
            <div id="delivery">
              <p className="title bold margin-bottom spaced">Delivery</p>
              <p className="title small bold margin-bottom">
                Is same day flower delivery in Lagos, Nigeria and Abuja, Nigeria
                possible?
              </p>
              <p className="margin-bottom spaced">
                Yes, we usually offer same day flower delivery in Lagos, Nigeria
                and Abuja, Nigeria However, we encourage you to order flowers
                and gifts as soon as possible due to traffic congestion, and to
                ensure we don’t run out of stock for the day.
              </p>
              <p className="title small bold margin-bottom">
                Is a flower delivery in Lagos, Nigeria and Abuja, Nigeria
                possible on weekends and public holidays?
              </p>
              <p className="margin-bottom">
                Yes, <a className="primary-color">Regalflowers.com.ng</a>{" "}
                delivers flowers on all days INCLUDING Saturdays, Sundays, and
                Public Holidays. Can't come in? You can always buy flowers in
                Lagos, Nigeria and Abuja, Nigeria from our online store or by
                phone or WhatsApp and get them delivered.
              </p>
              <p className="title small bold margin-bottom">
                Do you deliver flowers outside Lagos, Nigeria and Abuja, Nigeria
                e.g. Port Harcourt?
              </p>
              <p className="margin-bottom">
                While we do not offer deliveries outside Lagos and Abuja at the
                moment, we can however on a case-by-case basis, make use of
                flights to send them to other states , subject to flight
                availability.
              </p>
              <p>
                If you prefer, you can also provide a representative in Lagos or
                Abuja that we can deliver to, or you can engage a flight courier
                at the airport (we can introduce you to one) who would help fly
                the items to other states in Nigeria.
              </p>
              <p className="title small bold vertical-margin">
                Why do you need the recipient's number for flower and gift
                orders?
              </p>
              <p className="margin-bottom">
                When our delivery partners (typically Uber and other 3rd party
                delivery agents), get to the destination, they usually need to
                communicate with the recipient to collect the flowers and gifts,
                or to confirm who the recipient would prefer the driver drop the
                items with.
              </p>
              <p>
                In addition, as a security precaution many offices and
                residences usually request that the driver put a call through to
                the recipient before accepting the flowers and gifts. Finally,
                there are sometimes issues with locating the given address and
                the driver sometimes needs to communicate with the recipient to
                clarify how to get to the address to complete the delivery.
              </p>
              <p className="title small bold vertical-margin">
                Who do you deliver the items to?
              </p>
              <p>
                Our flower delivery in Lagos, Nigeria and Abuja, Nigeria is
                typically delivered directly to the intended recipient. However,
                if they are unavailable for any reason (meeting, phone off, not
                picking their calls etc), or if they request we do so, we would
                deliver to their receptionist, security guard, household staff,
                friend or colleague at the delivery point.
              </p>
              <p className="title small bold vertical-margin">
                What happens if the recipient doesn't pickup their phone, and
                there is no one to drop the flowers with at the destination?
              </p>
              <p>
                We usually at this point communicate with the sender on phone to
                give an update on the situation. In the event the sender is also
                unreachable for any reason, we would be forced to return the
                items to our flower shop in Lagos, Nigeria, and Abuja, Nigeria
                and the sender would then be required to pick them up, or pay
                another delivery fee.
              </p>
              <p className="vertical-margin">
                Due to the fact that our delivery partners are not able to wait
                at the destination for an email response, we usually return the
                flowers and gifts to our flower shop in Lagos, Nigeria and
                Abuja, Nigeria if the mode of communication with the sender was
                by email.
              </p>
              <p>
                Due to the perishable nature of flowers and some gifts (cakes,
                cupcakes), items returned to our flower shop in Lagos, Nigeria
                and Abuja, Nigeria would be held for a limited amount of time
                and might eventually wither at the buyers expense.
              </p>
            </div>
          </div>
        </div>
        <div className="flex between margin-bottom spaced">
          <span className="title bold">Featured Flowers</span>
          <button className="primary-color bold flex center-align spaced">
            <span>See All</span>{" "}
            <img
              className="generic-icon"
              src="./icons/arrow-right.svg"
              alt="arrow right"
            />
          </button>
        </div>
        <div className="flex between vertical-margin spaced wrap">
          {featuredFlowers.map((item, index) => (
            <FlowerCard key={index} flower={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Index;
