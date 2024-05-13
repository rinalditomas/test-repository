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
      root: null, // The element that the target element is compared to
      rootMargin: "20px", // The margin around the root element
      threshold: 1.0, // The percentage of the target element visible for the callback to be invoked
    };

    // Create a new IntersectionObserver and store it in the ref
    // the callback function is going to be called when the target element becomes visible
    observer.current = new IntersectionObserver(
      (entities) => callback(entities, dispatch),
      options
    );

    // Disconnect the IntersectionObserver when the component is unmounted
    return () => {
      observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = document.getElementById(elementId); // Get the element to observe
    if (element) {
      observer.current.disconnect(); // Disconnect the observer from any elements it's currently observing
      observer.current.observe(element); // Start observing the element
    }
  }, dependencies);
};
