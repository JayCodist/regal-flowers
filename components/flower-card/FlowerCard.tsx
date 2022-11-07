import Link from "next/link";
import React, { forwardRef, MouseEvent, useContext } from "react";
import SettingsContext from "../../utils/context/SettingsContext";
import { CartItem } from "../../utils/types/Core";
import Product from "../../utils/types/Product";
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
  product?: Product;
  cart?: boolean;
}

const FlowerCard = forwardRef<HTMLAnchorElement, IFlowerCardProps>(
  (props, ref) => {
    const {
      buttonText,
      image,
      price,
      name,
      subTitle,
      url,
      mode,
      product,
      cart
    } = props;

    const { cartItems, setCartItems } = useContext(SettingsContext);

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const cartItem: CartItem = product
        ? {
            key: product?.key,
            name: product?.name,
            price: product?.price,
            quantity: 1,
            image: product?.images[0]
          }
        : ({} as CartItem);

      const _cartItem = cartItems.find(item => item.key === product?.key);

      if (!_cartItem) {
        setCartItems([...cartItems, cartItem]);
      }
      e.stopPropagation();
    };
    return (
      <Link href={url || "#"}>
        <a
          className={`${styles["flower-card"]} center ${
            styles[mode || "four-x-grid"]
          }`}
          ref={ref}
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
              className={`flex margin-top spaced ${
                price ? "between" : "center"
              }`}
            >
              {price && (
                <div>
                  <p className="smaller text-secondary">From</p>
                  <p className="bold">{price}</p>
                </div>
              )}
              <Button
                className={`${styles["buy-btn"]}`}
                onClick={e => cart && handleAddToCart(e)}
              >
                {buttonText ? buttonText : "Buy Now"}
              </Button>
            </div>
          </div>
        </a>
      </Link>
    );
  }
);

export default FlowerCard;
