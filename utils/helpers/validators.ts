import { InputValidator } from "../../components/input/Input";

export const emailValidator: InputValidator = str => {
  if (str.length < 3) {
    return "This field must have 3 or more characters";
  }
  if (!/[a-z]+\w*\@[a-z]+\w*\.[a-z]+\w*/i.test(str)) {
    return "Please enter a valid email";
  }
  return "";
};

export const phoneValidator: InputValidator = str => {
  if (str.length < 6) {
    return "This field must have 6 or more characters";
  }
  return "";
};
