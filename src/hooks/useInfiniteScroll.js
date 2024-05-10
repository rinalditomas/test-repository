import { useEffect, useRef } from "react";

export const useInfiniteScroll = (
  elementId,
  callback,
  dispatch,
  dependencies
) => {
  const observer = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(
      (entities) => callback(entities, dispatch),
      options
    );

    return () => {
      observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (element) {
      observer.current.observe(element);
    }
  }, dependencies);
};
