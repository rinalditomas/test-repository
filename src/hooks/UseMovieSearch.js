import { useDispatch } from "react-redux";
import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from "../constants";
import { useEffect, useRef } from "react";
import moviesSlice, { fetchMovies } from "../data/moviesSlice";

export const UseMovieSearch = (query, pageNumber) => {
  const dispatch = useDispatch();
  const fetchedPages = useRef({});

  useEffect(() => {
    fetchedPages.current = {}; // Reset fetched pages
    dispatch(moviesSlice.actions.clearState());
    // eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    
    if (fetchedPages.current[pageNumber]) {
      // Page already fetched, do nothing
      return;
    }
    if (query) {
      dispatch(
        fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=${pageNumber}`)
      );
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${pageNumber}`));
    }

    fetchedPages.current[pageNumber] = true; // Mark page as fetched

    // eslint-disable-next-line
  }, [query, pageNumber]);
};
