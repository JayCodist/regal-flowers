import { useEffect, useRef } from "react";

const useOutsideClick = <T = HTMLElement>(onOutsideClick: () => void) => {
  const excludedAreaRef = useRef<T>(null);

  const handleClose = (e: MouseEvent) => {
    const excludedArea = excludedAreaRef.current as HTMLElement | null;

    if (!excludedArea || !excludedArea.contains(e.target as Node)) {
      onOutsideClick();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClose);
    return () => window.removeEventListener("mousedown", handleClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return excludedAreaRef;
};

export default useOutsideClick;
