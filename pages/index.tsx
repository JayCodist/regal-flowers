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
    </section>
  );
};

export default LandingPage;
