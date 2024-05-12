import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { UseMovieSearch } from "../hooks/UseMovieSearch";
import moviesSlice from "../data/moviesSlice";
import { useDispatch } from "react-redux";
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from "../constants";

jest.mock("../data/moviesSlice", () => ({
  ...jest.requireActual("../data/moviesSlice"),
  fetchMovies: jest.fn(),
  actions: {
    clearState: jest.fn(),
  },
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

afterEach(cleanup);

describe("UseMovieSearch", () => {
  let store;
  let dispatch;
  const fetchMovies = jest.fn();

  beforeEach(() => {
    store = configureStore({
      reducer: {
        movies: moviesSlice.reducer,
      },
    });
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
  });

  it("should clear state and fetch movies when query changes", () => {
    const TestComponent = ({ query, pageNumber }) => {
      UseMovieSearch(query, pageNumber);
      return null;
    };

    const { rerender } = render(
      <Provider store={store}>
        <TestComponent query="old query" pageNumber={1} />
      </Provider>
    );

    rerender(
      <Provider store={store}>
        <TestComponent query="new query" pageNumber={1} />
      </Provider>
    );

    expect(dispatch).toHaveBeenCalledWith(moviesSlice.actions.clearState());
    expect(dispatch).toHaveBeenCalledWith(
      fetchMovies(`${ENDPOINT_SEARCH}&query=new query&page=1`)
    );
  });
  it("should fetch movies from discover endpoint when query is empty", () => {
    const TestComponent = ({ query, pageNumber }) => {
      UseMovieSearch(query, pageNumber);
      return null;
    };

    render(
      <Provider store={store}>
        <TestComponent query="" pageNumber={1} />
      </Provider>
    );

    expect(dispatch).toHaveBeenCalledWith(
      fetchMovies(`${ENDPOINT_DISCOVER}&page=1`)
    );
  });

  it("should not fetch movies again when the same page number is used", () => {
    const TestComponent = ({ query, pageNumber }) => {
      UseMovieSearch(query, pageNumber);
      return null;
    };

    const { rerender } = render(
      <Provider store={store}>
        <TestComponent query="query" pageNumber={1} />
      </Provider>
    );

    rerender(
      <Provider store={store}>
        <TestComponent query="query" pageNumber={1} />
      </Provider>
    );

    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("should fetch movies again when a different page number is used", () => {
    const TestComponent = ({ query, pageNumber }) => {
      UseMovieSearch(query, pageNumber);
      return null;
    };

    const { rerender } = render(
      <Provider store={store}>
        <TestComponent query="query" pageNumber={1} />
      </Provider>
    );

    rerender(
      <Provider store={store}>
        <TestComponent query="query" pageNumber={2} />
      </Provider>
    );

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenCalledWith(
      fetchMovies(`${ENDPOINT_SEARCH}&query=query&page=2`)
    );
  });
});
