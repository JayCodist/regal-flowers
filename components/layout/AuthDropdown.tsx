import { FunctionComponent, useState } from "react";
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

  const handleSubmit = () => {};
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
              showPasswordIcon
              responsive
            />
          </div>
        )}

        <Button className="vertical-margin spaced" responsive>
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
