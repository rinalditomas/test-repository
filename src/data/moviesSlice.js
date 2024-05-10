import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk("fetch-movies", async (apiUrl) => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    },
    fetchStatus: "",
  },
  reducers: {
    clearState: (state) => {
      state.movies = {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
        
      };
      state.fetchStatus = "";
    },
    incrementPage: (state, action) => {
      if (state.movies.page < state.movies.total_pages) {
        state.movies.page = state.movies.page + 1;
      }
    },
    resetPage: (state) => {
      state.movies.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const newResults = [...state.movies.results, ...action.payload.results];
        state.movies.results = [...new Set(newResults)];
        state.movies.total_pages = action.payload.total_pages;
        state.movies.total_results = action.payload.total_results;
        state.fetchStatus = "success";
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = "error";
      });
  },
});

export default moviesSlice;
