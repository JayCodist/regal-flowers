import dayjs, { Dayjs } from "dayjs";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./DatePicker.module.scss";

interface DatePickerProps {
  onChange: (date: Dayjs | null) => void;
  value: Dayjs | null;
  format?: string;
  responsive?: boolean;
  disabled?: boolean;
  className?: string;
  iconAtLeft?: boolean;
  /**
   * Defaults to left
   */
  dropdownAlignment?: "left" | "right";
  placeholder?: string;
  content?: React.ReactNode;
}

const DatePicker = (props: DatePickerProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    onChange,
    value,
    format,
    responsive,
    disabled,
    className,
    iconAtLeft,
    placeholder,
    dropdownAlignment = "left",
    content
  } = props;

  const dropDownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClose = (e: globalThis.MouseEvent) => {
    const dropdown = dropDownRef.current;

    if (!dropdown || !dropdown.contains(e.target as Element)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, []);

  const handleSelectClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    const select = selectRef.current;
    if (select && select.contains(e.target as Element)) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleDateSelect = (
    _date: string | number | Dayjs | Date | null | undefined,
    _modifiers: any,
    e: any
  ) => {
    const date = dayjs(_date);
    if (onChange) {
      onChange(date);
    }

    setShowDropdown(false);
    e.stopPropagation();
  };

  const shownValue = useMemo(() => value?.format(format || "YYYY-MM-DD"), [
    value,
    format
  ]);

  const initialMonth = useMemo(() => (value || dayjs()).toDate(), [value]);
  const jsDateValue = useMemo(() => value?.toDate() || new Date(), [value]);

  return (
    <div
      className={[
        styles["select-wrapper"],
        showDropdown ? styles.active : "",
        responsive && styles.responsive,
        className
      ].join(" ")}
      ref={dropDownRef}
      onClick={handleSelectClick}
    >
      <div
        className={[
          styles["main-content"],
          iconAtLeft && styles["icon-at-left"]
        ].join(" ")}
        ref={selectRef}
      >
        {content ? (
          <div>{content}</div>
        ) : (
          <>
            {iconAtLeft && (
              <img
                alt="calendar"
                className={styles.icon}
                src="/icons/calender.svg"
              />
            )}
            {shownValue ? (
              <span className={styles["main-text"]}>{shownValue}</span>
            ) : (
              <span className={styles.placeholder}>
                {placeholder || "Select date"}
              </span>
            )}
            {!iconAtLeft && (
              <img
                alt="calendar"
                className={styles.icon}
                src="/icons/calender.svg"
              />
            )}
          </>
        )}
      </div>
      <div
        className={[
          styles.dropdown,
          showDropdown && styles["show-dropdown"],
          styles[dropdownAlignment]
        ].join(" ")}
      >
        <DayPicker
          defaultMonth={initialMonth}
          selected={jsDateValue}
          onDayClick={handleDateSelect}
        />
      </div>
    </div>
  );
};

export default DatePicker;
