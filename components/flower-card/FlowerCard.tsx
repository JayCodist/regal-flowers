import Link from "next/link";
import React, { FunctionComponent } from "react";
import Button from "../button/Button";
import styles from "./FlowerCard.module.scss";

interface IFlowerCardProps {
  buttonText?: string;
  image: string;
  price: number;
  name: string;
  subTitle: string;
  url: string;
}

const FlowerCard: FunctionComponent<IFlowerCardProps> = props => {
  const { buttonText, image, price, name, subTitle, url } = props;
  return (
    <Link href={url || "#"}>
      <a className={`${styles["flower-card"]} center`}>
        <div className={styles["img-wrapper"]}>
          <img
            className={styles["flower-image"]}
            src={image}
            alt="featured flower"
          />
        </div>
        <div className={styles.detail}>
          <p className="bold">{name}</p>
          <p className="smaller text-secondary">{subTitle}</p>
          <div
            className={`flex margin-top spaced ${price ? "between" : "center"}`}
          >
            <div>
              <p className="smaller text-secondary">From</p>
              <p className="bold">{price}</p>
            </div>
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
