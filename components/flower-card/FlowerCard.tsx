import Link from "next/link";
import React, { FunctionComponent } from "react";
import Button from "../button/Button";
import styles from "./FlowerCard.module.scss";

interface IFlowerCardProps {
  buttonText?: string;
  image: string;
  price?: number;
  name: string;
  subTitle: string;
  url: string;
  isAddonGroup?: boolean;
  mode?: "four-x-grid" | "three-x-grid";
}

const FlowerCard: FunctionComponent<IFlowerCardProps> = props => {
  const { buttonText, image, price, name, subTitle, url, mode } = props;
  return (
    <Link href={url || "#"}>
      <a
        className={`${styles["flower-card"]} center ${
          styles[mode || "four-x-grid"]
        }`}
      >
        <div className={styles["img-wrapper"]}>
          <img
            className={styles["flower-image"]}
            src={image}
            alt="featured flower"
          />
        </div>
        <div className={styles.detail}>
          <strong>{name}</strong>
          <span className={styles.subtitle}>{subTitle}</span>
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
      </a>
    </Link>
  );
};

export default FlowerCard;
