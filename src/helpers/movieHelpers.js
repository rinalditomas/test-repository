import { createSearchParams } from "react-router-dom";
import moviesSlice from "../data/moviesSlice";

export const handleObserver = (entities, dispatch) => {
  const target = entities[0];

  if (target.isIntersecting) {
    dispatch(moviesSlice.actions.incrementPage());
  }
};

export const getSearchResults = (query, setSearchParams) => {
  if (query !== "") {
    setSearchParams(createSearchParams({ search: query }));
  } else {
    setSearchParams();
  }
};



