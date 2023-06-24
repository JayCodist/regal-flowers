import { FormEvent, FunctionComponent, useContext, useState } from "react";
import SettingsContext from "../../utils/context/SettingsContext";
import {
  changePassword,
  login,
  requestOtp,
  signup,
  validteOTP
} from "../../utils/helpers/data/auth";
import AppStorage from "../../utils/helpers/storage-helpers";
import RequestResponse from "../../utils/types/RequestResponse";
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./Layout.module.scss";

type FormType =
  | "login"
  | "signup"
  | "forgotPassword"
  | "validateOtp"
  | "newPassword";

const loginTextMap: Record<FormType, string> = {
  forgotPassword: "Send Code",
  newPassword: "Update Password",
  login: "Login",
  validateOtp: "Submit OTP",
  signup: "Register"
};

const titleMap: Record<FormType, string> = {
  forgotPassword: "Receive code via email",
  newPassword: "Create new password",
  validateOtp: "Enter one-time password",
  login: "Login",
  signup: "Register for Free"
};

const AuthDropdown: FunctionComponent = () => {
  const [formType, setFormType] = useState<FormType>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { notify, user, setUser } = useContext(SettingsContext);

  const handleLogout = async () => {
    AppStorage.remove("userData");
    setUser(null);
  };

  if (user) {
    return (
      <div className={styles["auth-form"]}>
        <div className="flex column center-align">
          <em className="margin-bottom spaced">Logged in as {user.email}</em>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formType === "newPassword") {
      if (password !== passwordConfirm) {
        notify("error", "Passwords do not match");
        return;
      }
    }
    const handlerMap: Partial<Record<
      FormType,
      () => Promise<RequestResponse>
    >> = {
      login: () => login(email, password),
      signup: () => signup(email, password),
      forgotPassword: () => requestOtp(email),
      validateOtp: () => validteOTP(email, otp),
      newPassword: () => changePassword(password)
    };
    setLoading(true);
    const response = await handlerMap[formType]?.();
    setLoading(false);
    if (response?.error) {
      notify(
        "error",
        `Unable to ${titleMap[formType].toLowerCase()}: ${response.message}`
      );
    } else {
      if (formType === "login" || formType === "signup") {
        setUser(response?.data);
        notify(
          "success",
          formType === "login"
            ? `Logged in successfully as ${email}`
            : "User signed up successfully"
        );
      } else if (formType === "forgotPassword") {
        setPassword("");
        setFormType("validateOtp");
        notify("success", `One-time password has been sent to ${email}`);
      } else if (formType === "validateOtp") {
        setPassword("");
        setPasswordConfirm("");
        setFormType("newPassword");
        notify("success", "OTP validated successfully");
      } else if (formType === "newPassword") {
        if (password !== passwordConfirm) {
          notify("error", "Passwords do not match");
          return;
        }
        setPassword("");
        setPasswordConfirm("");
        setFormType("login");
        notify("success", "Password changed successfully and user logged in");
        setUser(response?.data);
      }
    }
  };
  return (
    <div className={styles["auth-form"]}>
      <h2 className="text-center margin-bottom">{titleMap[formType]}</h2>
      <form className="flex column" onSubmit={handleSubmit}>
        {formType !== "newPassword" && formType !== "validateOtp" && (
          <div className="input-group">
            <span className="question">Email address</span>
            <Input
              value={email}
              onChange={setEmail}
              placeholder="Enter email"
              type="email"
              name="email"
              required
              responsive
            />
          </div>
        )}

        {formType !== "forgotPassword" && formType !== "validateOtp" && (
          <div className="input-group">
            <span className="flex between center-align">
              <span className="question">Password</span>
              {formType === "login" && (
                <Button
                  className="red"
                  type="plain"
                  onClick={() => setFormType("forgotPassword")}
                >
                  Forgot Password
                </Button>
              )}
            </span>
            <Input
              value={password}
              onChange={setPassword}
              type="password"
              autoComplete={formType === "signup" ? "new-password" : "password"}
              placeholder="Enter password"
              required
              showPasswordIcon
              responsive
            />
          </div>
        )}

        {formType === "newPassword" && (
          <div className="input-group">
            <span className="question">Confirm Password</span>
            <Input
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              type="password"
              placeholder="Confirm password"
              required
              showPasswordIcon
              responsive
            />
          </div>
        )}

        {formType === "validateOtp" && (
          <Input
            value={otp}
            onChange={setOtp}
            placeholder="Enter OTP sent to your inbox"
            required
            responsive
            className="margin-top spaced"
          />
        )}

        <Button
          buttonType="submit"
          loading={loading}
          className="vertical-margin spaced"
          responsive
        >
          {loginTextMap[formType]}
        </Button>
        {formType === "login" && (
          <span className="flex center">
            <span className="margin-right">New user?</span>
            <Button type="plain" onClick={() => setFormType("signup")}>
              Register
            </Button>
          </span>
        )}
        {formType === "signup" && (
          <span className="flex center">
            <span className="margin-right">Already a user?</span>
            <Button type="plain" onClick={() => setFormType("login")}>
              Login
            </Button>
          </span>
        )}
        {formType !== "login" && formType !== "signup" && (
          <span className="flex center">
            <Button type="plain" onClick={() => setFormType("login")}>
              Back to Login
            </Button>
          </span>
        )}
      </form>
    </div>
  );
};

export default AuthDropdown;
