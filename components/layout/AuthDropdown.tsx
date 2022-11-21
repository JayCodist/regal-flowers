import { FunctionComponent, useState } from "react";
import Input from "../input/Input";
import styles from "./Layout.module.scss";

const AuthDropdown: FunctionComponent = () => {
  const [formType, setFormType] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {};
  return (
    <div className={styles["auth-form"]}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <span className="question">Username/Email address</span>
          <Input value={email} onChange={setEmail} type="email" name="email" />
        </div>

        <div className="input-group">
          <span className="question">Password</span>
          <Input
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete={formType === "signup" ? "new-password" : "password"}
          />
        </div>
      </form>
    </div>
  );
};

export default AuthDropdown;
