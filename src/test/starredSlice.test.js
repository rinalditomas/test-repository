import starredSlice from "../data/starredSlice";
import { starredMoviesMock } from "./starredMovies.mocks";

describe("starredSlice test", () => {
  const state = { starredMovies: [] };

  it("should set an initial state", () => {
    const initialState = state;
    const action = { type: "" };
    const result = starredSlice.reducer(initialState, action);
    expect(result).toEqual({ starredMovies: [] });
  });

  it("should add movie to starred", () => {
    const initialState = { ...state, starredMovies: [] };
    const action = starredSlice.actions.starMovie(starredMoviesMock[0]);
    const result = starredSlice.reducer(initialState, action);
    expect(result.starredMovies[0]).toBe(starredMoviesMock[0]);
  });
  it("should remove movie from starred", () => {
    const initialState = {
      ...state,
      starredMovies: [starredMoviesMock[0], starredMoviesMock[1]],
    };
    const action = starredSlice.actions.unstarMovie(starredMoviesMock[0]);
    const result = starredSlice.reducer(initialState, action);
    expect(result.starredMovies[0]).toBe(starredMoviesMock[1]);
  });
  it("should remove all movies", () => {
    const initialState = { ...state, starredMovies: starredMoviesMock };
    const action = starredSlice.actions.clearAllStarred(state);
    const result = starredSlice.reducer(initialState, action);
    expect(Object.keys(result.starredMovies).length).toEqual(0);
  });
});
