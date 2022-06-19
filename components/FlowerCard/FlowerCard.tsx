import React, { FunctionComponent } from "react";
import Button from "../Button/Button";
import styles from "./FlowerCard.module.scss";

interface IFlowerCardProps {
  buttonText?: string;
  image: string;
  price?: number;
  name: string;
  details: string;
}

const FlowerCard: FunctionComponent<IFlowerCardProps> = props => {
  const { buttonText, image, price, name, details } = props;
  return (
    <div className={`${styles["flower-card"]} center`}>
      <img
        className={styles["flower-image"]}
        src={image}
        alt="featured flower"
      />
      <div className={styles.detail}>
        <p className="bold">{name}</p>
        <p className="smaller text-secondary">{details}</p>
        <div
          className={`flex margin-top spaced ${price ? "between" : "center"}`}
        >
          {price && (
            <div>
              <p className="smaller text-secondary">From</p>
              <p className="bold">{price}</p>
            </div>
          )}
          <Button className={`${styles["buy-btn"]}`}>
            {buttonText ? buttonText : "Buy Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlowerCard;
