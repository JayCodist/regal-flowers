import React, { useState } from "react";
import { _countryCodes } from "../../utils/constants";
import Input from "../input/Input";
import Select from "../select/Select";
import styles from "./PhoneInput.module.scss";

type ValueType = string | number | string[] | number[];

type PhoneInputProps = {
  phoneNumber: number;
  countryCode: string;
  onChangeCountryCode: (value: ValueType) => void;
  onChangePhoneNumber: (value: string) => void;
  question?: string;
};

const PhoneInput = (props: PhoneInputProps) => {
  const {
    phoneNumber,
    countryCode,
    onChangeCountryCode,
    onChangePhoneNumber,
    question
  } = props;

  const [countryCodes, setCountryCodes] = useState(_countryCodes);

  const handleCountryCodeSearch = (props: { searchStr: string }) => {
    setCountryCodes(
      _countryCodes.filter(code => code.value.includes(props.searchStr))
    );
  };

  return (
    <div className="input-group">
      <span className="question">{question || "Phone Number"}</span>
      <div className={styles["input-wrapper"]}>
        <Select
          onSelect={onChangeCountryCode}
          value={countryCode}
          options={countryCodes}
          placeholder="+234"
          responsive
          dimmed
          className={styles["country-code"]}
          onSearch={handleCountryCodeSearch}
        />
        <Input
          placeholder=""
          value={phoneNumber}
          onChange={onChangePhoneNumber}
          dimmed
          responsive
          className={styles["phone-number"]}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
