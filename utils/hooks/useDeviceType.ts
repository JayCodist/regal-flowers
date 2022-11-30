import { useEffect, useState } from "react";

type DeviceType = "desktop" | "mobile";

function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    function handleResize() {
      setDeviceType(window.innerWidth > 650 ? "desktop" : "mobile");
    }

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
}

export default useDeviceType;
