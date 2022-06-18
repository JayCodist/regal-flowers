import { ChangeEvent } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: boolean) => void;
  text?: string | JSX.Element | number;
  name?: string;
  className?: string;
}
const Checkbox = (props: CheckboxProps) => {
  const { onChange = () => {}, text, name, checked, className } = props;

  const _onChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.checked);

  return (
    <label className={[styles.wrapper, className].join(" ")}>
      <input
        name={name}
        className={styles.checkbox}
        checked={checked}
        onChange={_onChange}
        type="checkbox"
      />
      <span className={styles["check-wrapper"]}>
        <span className={styles["check-icon"]} />
      </span>
      {text && <span className={styles.text}>{text}</span>}
    </label>
  );
};

export default Checkbox;
