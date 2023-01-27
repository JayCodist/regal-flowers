import { ChangeEvent, useEffect, useState } from "react";
import styles from "./Radio.module.scss";

interface RadioProps {
  bordered?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  responsive?: boolean;
  subtitle?: string;
  title?: string;
  blue?: boolean;
  inline?: boolean;
  type?: "default" | "classic";
  disabled?: boolean;
}

const Radio = (props: RadioProps) => {
  const [id, setId] = useState("");

  const {
    name,
    label,
    onChange,
    defaultChecked,
    bordered,
    checked,
    title,
    subtitle,
    responsive,
    blue,
    inline,
    type,
    disabled
  } = props;

  useEffect(() => {
    const _id = `radio${name}${label || title}`.replace(/\W/g, "");
    setId(_id);
  }, [name, label, title]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <span>
      <input
        name={name}
        type="radio"
        onChange={handleChange}
        className={[styles.radio, blue ? styles["radio-blue"] : " "].join(" ")}
        defaultChecked={defaultChecked}
        checked={checked}
        id={id || undefined}
        disabled={disabled}
      />

      <label
        className={[
          styles.wrapper,
          bordered && styles.bordered,
          responsive && styles.responsive,
          inline && styles.inline,
          styles[type ?? "default"],
          disabled && styles.disabled
        ].join(" ")}
        htmlFor={id}
      >
        <span className={styles["radio-icon"]} />
        {(title || subtitle) && (
          <div className={styles.right}>
            {title && <strong className={styles.title}>{title}</strong>}
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
        )}

        {label && <span className={styles.label}>{label}</span>}
      </label>
    </span>
  );
};

export default Radio;
