import { useEffect, useRef } from "react";

const useOutsideClick = <T = HTMLElement>(onOutsideClick: () => void) => {
  const componentToCloseRef = useRef<T>(null);

  const handleClose = (e: MouseEvent) => {
    const componentToClose = componentToCloseRef.current as HTMLElement | null;

    if (!componentToClose || !componentToClose.contains(e.target as Node)) {
      onOutsideClick();
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClose);
    return () => window.removeEventListener("mousedown", handleClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return componentToCloseRef;
};

export default useOutsideClick;
