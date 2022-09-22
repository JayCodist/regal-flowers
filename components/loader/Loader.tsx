import React from "react";
import styles from "./Loader.module.scss";

export default function Loader() {
  return (
    <div className="text-center">
      <div className={styles["lds-ring"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
