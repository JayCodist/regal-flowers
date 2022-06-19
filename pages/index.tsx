import Link from "next/link";
import { FunctionComponent } from "react";
import styles from "./index.module.scss";

const LandingPage: FunctionComponent = () => {
  return (
    <section className="page-content">
      <div className={[styles["hero-bg"], "hero-bg"].join(" ")}>
        <div className="hero-content flex column center center-align">
          <h1 className={styles.title}>
            Same Day Flower Delivery <br />
            In Lagos & Abuja, Nigeria.
          </h1>
        </div>
      </div>
      <section className="featured-section">
        <div className="flex between">
          <h1 className="featured-title">
            Best Selling Flowers In Lagos, Nigeria
          </h1>
          <Link href="/filters/occassions" passHref>
            <span className="flex spaced center-align">
              <h3 className="red">See All</h3>
              <img
                alt="arrow"
                className="generic-icon xsmall"
                src="/icons/arrow-right.svg"
              />
            </span>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default LandingPage;
