import { MutableRefObject, useEffect, useRef, useState } from "react";

interface UseScrollHandlerProps {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number;
  node: HTMLElement | null;
}

/**
 * Custom hook for implementing infinite-scroll on a component
 * @param props `UseScrollHandlerProps`
 * @returns [page, setPage]
 */
const useScrollHandler: (
  props: UseScrollHandlerProps
) => [number, (currentPage: number) => void] = ({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  node
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const observer: MutableRefObject<IntersectionObserver | null> = useRef(null);
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (node) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentPage(current => current + 1);
          }
        },
        {
          root,
          rootMargin,
          threshold: 1
        }
      );
    }

    setTimeout(() => {
      if (node) {
        observer.current?.observe(node);
      }
    }, 100);

    return () => observer.current?.disconnect();
  }, [node, root, rootMargin, threshold]);

  return [currentPage, setCurrentPage];
};

export default useScrollHandler;
