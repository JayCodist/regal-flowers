import { Router } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = () => {
  const [width, setWidth] = useState(0);
  const [routeChanged, setRouteChanged] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setRouteChanged(false);
      setWidth(0);
      // Simulate progress (for demonstration purposes)
      const interval = setInterval(() => {
        if (width < 90) {
          setWidth(prevWidth => prevWidth + 10);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    };

    const handleRouteChangeComplete = () => {
      console.log("route change completed");
      setRouteChanged(true);
      setWidth(100);
    };

    // Subscribe to route changes
    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", err =>
      console.log("Unable to navigate: ", err)
    );

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router]);

  const showProgressBar = routeChanged ? 0 : width;

  if (showProgressBar === 0) {
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
