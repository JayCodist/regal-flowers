import { FormEvent, FunctionComponent, useContext, useState } from "react";
import SettingsContext from "../../utils/context/SettingsContext";
import { login, signup } from "../../utils/helpers/data/auth";
import RequestResponse from "../../utils/types/RequestResponse";
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./Layout.module.scss";

type FormType = "login" | "signup" | "forgotPassword" | "newPassword";

const loginTextMap: Record<FormType, string> = {
  forgotPassword: "Send Code",
  newPassword: "Update Password",
  login: "Login",
  signup: "Register"
};

const titleMap: Record<FormType, string> = {
  forgotPassword: "Receive code via email",
  newPassword: "Enter new password",
  login: "Login",
  signup: "Register for Free"
};

const AuthDropdown: FunctionComponent = () => {
  const [formType, setFormType] = useState<FormType>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { notify, setUser } = useContext(SettingsContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const handlerMap: Partial<Record<
      FormType,
      () => Promise<RequestResponse>
    >> = {
      login: () => login(email, password),
      signup: () => signup(email, password)
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
            ? `Logged in successfully as ${response?.data.email}`
            : "User signed up successfully"
        );
      }
    }
  };
  return (
    <div className={styles["auth-form"]}>
      <h2 className="text-center margin-bottom">{titleMap[formType]}</h2>
      <form className="flex column" onSubmit={handleSubmit}>
        {formType !== "newPassword" && (
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

        {formType !== "forgotPassword" && (
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
      </form>
    </div>
  );
};

export default AuthDropdown;
