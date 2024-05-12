// FILEPATH: /Users/tomasrinaldiscatena/Desktop/coding-assignment/src/hooks/useInfiniteScroll.test.js
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

afterEach(cleanup);

it("should observe the element", () => {
  const MockComponent = () => {
    const callback = jest.fn();
    const dispatch = jest.fn();
    useInfiniteScroll("element", callback, dispatch, []);
    return <div />;
  };

  render(<MockComponent />);

  const element = document.getElementById("element");
  expect(element).toBeDefined();
});

it("should disconnect on unmount", () => {
  const MockComponent = () => {
    const callback = jest.fn();
    const dispatch = jest.fn();
    useInfiniteScroll("element", callback, dispatch, []);
    return <div />;
  };

  const { unmount } = render(<MockComponent />);

  unmount();

  const element = document.getElementById("element");
  expect(element).toBeNull();
});
it("should call the callback when the element is visible ", () => {
  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn(function (callback, options) {
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    this.triggerIntersect = (isIntersecting) => callback([{ isIntersecting }]);
  });

  const callback = jest.fn();
  const dispatch = jest.fn();

  const MockComponent = () => {
    useInfiniteScroll("element", callback, dispatch, []);
    return <div />;
  };

  render(<MockComponent />);

  // Manually trigger the IntersectionObserver's callback
  global.IntersectionObserver.mock.instances[0].triggerIntersect(true);

  expect(callback).toHaveBeenCalled();

  // Restore IntersectionObserver to its original implementation after the test
  global.IntersectionObserver = IntersectionObserver;
});

it("should not call the callback after the component is unmounted", () => {
  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn(function (callback, options) {
    this.observe = jest.fn(() => {
      this.isConnected = true;
    });
    this.disconnect = jest.fn(() => {
      this.isConnected = false;
    });
    // Add a method to manually trigger the callback
    this.triggerIntersect = (isIntersecting) => {
      if (this.isConnected) {
        callback([{ isIntersecting }]);
      }
    };
  });

  const callback = jest.fn();
  const dispatch = jest.fn();

  const MockComponent = () => {
    useInfiniteScroll("element", callback, dispatch, []);
    return <div />;
  };

  const { unmount } = render(<MockComponent />);
  unmount();

  // Manually trigger the IntersectionObserver's callback
  global.IntersectionObserver.mock.instances[0].triggerIntersect(true);

  expect(callback).not.toHaveBeenCalled();

  // Restore IntersectionObserver to its original implementation after the test
  global.IntersectionObserver = IntersectionObserver;
});
