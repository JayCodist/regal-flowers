import { Router } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleRouteChange = () => {
      setWidth(0);
      // Simulate progress (for demonstration purposes)
      const interval = setTimeout(() => {
        if (width < 90) {
          setWidth(prevWidth => prevWidth + 10);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    };

    // Subscribe to route changes
    Router.events.on("routeChangeStart", handleRouteChange);
    Router.events.on("routeChangeComplete", () => setWidth(100));

    return () => {
      Router.events.off("routeChangeStart", handleRouteChange);
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router]);

  if (width === 0 || width >= 100) {
    return null;
  }

  return (
    <div className={[styles["progress-wrapper"]].join("")}>
      <div
        className={styles["progress-bar"]}
        style={{
          width: `${width}%`
        }}
      ></div>
      <img
        src="/icons/rolling.svg"
        alt="loading"
        className="generic-icon margin-left"
      />
    </div>
  );
};

export default ProgressBar;
