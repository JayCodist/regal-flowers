import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import styles from "./ContextWrapper.module.scss";

interface ContextWrapperProps {
  anchor: ReactNode;
  children: ReactNode;
  visible?: boolean;
  onOpen?: () => void;
  className?: string;
  anchorClassname?: string;
  cancel?: () => void;
}

const ContextWrapper: FunctionComponent<ContextWrapperProps> = props => {
  const { visible, onOpen, cancel, anchor, children, className } = props;

  const [innerVisible, setInnerVisible] = useState(false);

  useEffect(() => {
    setInnerVisible(Boolean(visible));
  }, [visible]);

  const contextRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleClose = (e: MouseEvent) => {
    const contextBody = contextRef.current;
    const anchorBody = anchorRef.current;
    if (
      !contextBody?.contains(e.target as Node) &&
      !anchorBody?.contains(e.target as Node)
    ) {
      const isStateControlled =
        onOpen && cancel && typeof visible === "boolean";
      if (isStateControlled) {
        cancel();
      } else {
        setInnerVisible(false);
      }
    }
  };

  useEffect(() => {
    if (innerVisible) {
      document.addEventListener("mousedown", handleClose);
    }
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerVisible]);

  const handleAnchorClick = () => {
    const isStateControlled = onOpen && cancel && typeof visible === "boolean";
    if (isStateControlled) {
      if (visible) {
        cancel();
      } else {
        onOpen();
      }
    } else {
      setInnerVisible(!innerVisible);
    }
  };

  return (
    <>
      <span
        ref={anchorRef}
        onClick={handleAnchorClick}
        className={styles.anchor}
      >
        {anchor}
        <div
          ref={contextRef}
          className={[
            styles["context"],
            innerVisible && `scrollable ${styles.active}`,
            className
          ].join(" ")}
        >
          {children}
        </div>
      </span>
      <div
        className={[styles.backdrop, innerVisible && styles.active].join(" ")}
      />
    </>
  );
};

export default ContextWrapper;
