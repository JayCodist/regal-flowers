import React, { ReactChild } from "react";
import styles from "./Button.module.scss";

export interface IButtonProps {
  children?: ReactChild;
  onClick?: () => void;
  transparent?: boolean;
  full?: boolean;
  clasName?: string;
}

export default function Button(props: IButtonProps) {
  const { children, onClick, transparent, full, clasName } = props;
  return (
    <button
      onClick={onClick}
      className={[
        styles.button,
        transparent && styles["transparent"],
        full && styles["full"],
        clasName
      ].join(" ")}
    >
      {children}
    </button>
  );
}
