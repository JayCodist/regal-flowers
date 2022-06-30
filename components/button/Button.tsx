import Link from "next/link";
import React, { CSSProperties, ReactChild } from "react";
import styles from "./Button.module.scss";

export type ButtonType =
  | "primary"
  | "accent"
  | "plain"
  | "transparent"
  | "accent-transparent";

interface ButtonProps {
  children?: ReactChild | ReactChild[];
  className?: string;
  loading?: boolean;
  minWidth?: boolean;
  onClick?: (e?: any) => void;
  size?: "small" | "default" | "large";
  style?: CSSProperties;
  type?: ButtonType;
  url?: string;
  /**
   * This is ignored if `url` property is not set. Defaults to false
   */
  urlOnNewTab?: boolean;
  danger?: boolean;
  startIcon?: string;
  iconOnly?: boolean;
  disabled?: boolean;
  buttonType?: "button" | "submit" | "reset";
  tooltip?: string;
  name?: string;
  responsive?: boolean;
  padded?: boolean;
}

export default function Button(props: ButtonProps) {
  const {
    children,
    onClick,
    type,
    style,
    loading,
    url,
    size,
    minWidth,
    className,
    danger,
    startIcon,
    iconOnly,
    disabled,
    buttonType,
    tooltip,
    urlOnNewTab,
    name,
    padded
  } = props;

  if (url) {
    return (
      <Link href={url}>
        <a
          className={[
            styles.button,
            styles[type || "primary"],
            styles[size || "default"],
            minWidth && styles["min-width"],
            danger && styles.danger,
            iconOnly && styles["icon-only"],
            (loading || disabled) && styles.disabled,
            padded && styles.padded,
            className
          ].join(" ")}
          style={style}
          target={urlOnNewTab ? "_blank" : "_self"}
          title={tooltip}
        >
          {startIcon && (
            <img
              alt="button icon"
              src={startIcon}
              className={styles["start-icon"]}
            />
          )}
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      className={[
        styles.button,
        styles[type || "primary"],
        styles[size || "default"],
        minWidth && styles["min-width"],
        loading && styles.loading,
        danger && styles.danger,
        iconOnly && styles["icon-only"],
        disabled && styles.disabled,
        padded && styles.padded,
        className
      ].join(" ")}
      onClick={onClick}
      name={name}
      type={buttonType || "button"}
      style={style}
      disabled={loading || disabled}
      title={tooltip}
    >
      {startIcon && (
        <img
          alt="button icon"
          src={startIcon}
          className={styles["start-icon"]}
        />
      )}
      {children}
      <img
        src="/icons/loading-icon-white.svg"
        alt="loading"
        className={[styles.loader, loading && styles.active].join(" ")}
      />
    </button>
  );
}
