import React, { FunctionComponent } from "react";
import Button from "../Button/Button";
import styles from "./FlowerCard.module.scss";

interface IFlowerCardProps {
  flower: { name: string; price: number; image: string };
}

const FlowerCard: FunctionComponent<IFlowerCardProps> = props => {
  const { flower } = props;
  return (
    <div className={`${styles["flower-card"]} center`}>
      <img className="" src={flower.image} alt="featured flower" />
      <div className={styles.detail}>
        <p className="bold">{flower.name}</p>
        <p className="smaller text-secondary">{flower.name}</p>
        <div className="flex between margin-top spaced">
          <div>
            <p className="smaller text-secondary">From</p>
            <p className="bold">{flower.price}</p>
          </div>
          <Button clasName={`${styles["buy-btn"]}`}>Buy Now</Button>
        </div>
      </div>
    </div>
  );
};

export default FlowerCard;
