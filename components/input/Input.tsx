import Button from "../button/Button";
import styles from "./Input.module.scss";
import {
  ChangeEvent,
  MutableRefObject,
  ReactNode,
  useRef,
  useState
} from "react";

/**
 * This function is called with the current input value
 * and should return an error message, empty string if no errors
 */
export type InputValidator = (value: string) => string;

interface InputProps {
  value: string | number;
  onChange: (value: string) => void;
  dimmed?: boolean;
  startSymbol?: string;
  endSymbol?: ReactNode;
  icon?: string;
  name?: string;
  allowClear?: boolean;
  number?: boolean;
  placeholder?: string;
  required?: boolean;
  responsive?: boolean;
  type?: "text" | "email" | "search" | "password";
  className?: string;
  disabled?: boolean;
  noBorder?: boolean;
  refValue?: any;
  autoComplete?: "username" | "new-password";
  showPasswordIcon?: boolean;
  onBlurValidation?: InputValidator;
  size?: "default" | "small";
}

const Input = (props: InputProps) => {
  const {
    icon,
    startSymbol,
    onChange,
    value,
    placeholder,
    name,
    dimmed,
    endSymbol: _endSymbol,
    responsive,
    number,
    type,
    required,
    className,
    allowClear,
    disabled,
    noBorder,
    refValue: _refValue,
    autoComplete,
    showPasswordIcon,
    onBlurValidation,
    size
  } = props;

  const internalRef = useRef(null);
  const refValue: MutableRefObject<HTMLInputElement | null> = _refValue
    ? _refValue
    : internalRef;

  const [inputActive, setInputActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    const input = refValue.current;
    if (input) {
      setTimeout(() => {
        input.setSelectionRange(input.value.length, input.value.length);
        input.focus();
      });
    }
  };

  const passwordIcon =
    showPasswordIcon && type === "password" ? (
      <Button
        iconOnly
        type="transparent"
        tooltip={showPassword ? "Hide password" : "Show password"}
        onClick={togglePasswordVisibility}
      >
        <img
          alt={showPassword ? "Hide password" : "Show password"}
          src={
            showPassword
              ? "/icons/eye-password-slash.svg"
              : "/icons/eye-password.svg"
          }
          className="generic-icon"
        />
      </Button>
    ) : (
      ""
    );
  const endSymbol = _endSymbol ? _endSymbol : passwordIcon;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | { target: { value: string } }
  ) => {
    setErrorMessage("");
    setCompleted(false);
    if (onChange) {
      let output = e.target.value;
      if (number) {
        output = Number(output.replace(/\D/g, "")).toLocaleString();
        output = output === "0" ? "" : output;
      }
      onChange(output);
    }
  };

  const handleBlur = () => {
    setInputActive(false);
    if (required && !value) {
      setErrorMessage(`${name || "This field"} is required`);
      return;
    }
    const errorMessage = onBlurValidation?.(String(value));
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    setErrorMessage("");
    if (value) {
      setCompleted(true);
    }
  };

  const displayValue =
    number && typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div
      className={[
        styles.wrapper,
        icon ? styles["with-icon"] : "",
        noBorder && styles["no-border"],
        responsive && styles.responsive,
        inputActive && styles["input-active"],
        completed && styles.completed,
        errorMessage && styles.error,
        className
      ].join(" ")}
    >
      {icon && <img alt="input icon" src={icon} className={styles.icon} />}
      {startSymbol && (
        <span className={[styles.symbol, styles.start].join(" ")}>
          <span>{startSymbol}</span>
        </span>
      )}
      <input
        className={[
          styles.input,
          icon ? styles["with-icon"] : "",
          dimmed ? styles.dimmed : "",
          startSymbol && styles["padding-left"],
          styles[size || "default"]
        ].join(" ")}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setInputActive(true)}
        value={displayValue || ""}
        name={name}
        placeholder={placeholder}
        type={
          type === "password"
            ? showPassword
              ? "text"
              : "password"
            : type || "text"
        }
        required={required}
        disabled={disabled}
        ref={refValue}
        autoComplete={autoComplete}
      />
      {endSymbol && (
        <span className={[styles.symbol, styles.end].join(" ")}>
          <span>{endSymbol}</span>
        </span>
      )}
      {allowClear && (
        <span className={[styles.symbol, styles.end].join(" ")}>
          <Button type="transparent" iconOnly>
            <img
              alt="clear"
              onClick={() => handleChange({ target: { value: "" } })}
              src="/icons/delete-icon-gray.svg"
              className={styles["clear-icon"]}
            />
          </Button>
        </span>
      )}

      <span
        className={[
          styles["error-message"],
          errorMessage && styles.active
        ].join(" ")}
      >
        {errorMessage}
      </span>
    </div>
  );
};

interface TextAreaProps {
  value: string | number;
  onChange: (value: string) => void;
  dimmed?: boolean;
  icon?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  rows?: number;
  disableResize?: boolean;
  autoComplete?: "on" | "off";
  onBlurValidation?: InputValidator;
}

export const TextArea = (props: TextAreaProps) => {
  const {
    icon,
    onChange,
    value,
    placeholder,
    name,
    dimmed,
    required,
    className,
    disabled,
    disableResize,
    rows,
    autoComplete,
    onBlurValidation
  } = props;

  const [inputActive, setInputActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | { target: { value: string } }
  ) => {
    setErrorMessage("");
    setCompleted(false);
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setInputActive(false);
    if (required && !value) {
      setErrorMessage(`${name || "This field"} is required`);
      return;
    }
    const errorMessage = onBlurValidation?.(String(value));
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    setErrorMessage("");
    setCompleted(true);
  };

  return (
    <div
      className={[
        styles.wrapper,
        className,
        icon ? styles["with-icon"] : "",
        inputActive && styles["input-active"],
        completed && styles.completed,
        errorMessage && styles.error
      ].join(" ")}
    >
      {icon && <img alt="input icon" src={icon} className={styles.icon} />}
      <textarea
        className={[
          styles.input,
          icon ? styles["with-icon"] : "",
          dimmed ? styles.dimmed : "",
          disableResize && styles["disable-resize"]
        ].join(" ")}
        rows={rows || 6}
        onChange={handleChange}
        value={value || ""}
        name={name}
        placeholder={placeholder}
        onBlur={handleBlur}
        onFocus={() => setInputActive(true)}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <span
        className={[
          styles["error-message"],
          errorMessage && styles.active
        ].join(" ")}
      >
        {errorMessage}
      </span>
    </div>
  );
};

export default Input;
