import { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  createSearchParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "reactjs-popup/dist/index.css";
import moviesSlice from "./data/moviesSlice";
import { ENDPOINT, API_KEY } from "./constants";
import Header from "./components/Header";
import Movies from "./components/Movies";
import Starred from "./components/Starred";
import WatchLater from "./components/WatchLater";
import YouTubePlayer from "./components/YoutubePlayer";
import "./app.scss";
import { UseMovieSearch } from "./hooks/UseMovieSearch";
import Modal from "./components/Modal";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { getSearchResults, handleObserver } from "./helpers/movieHelpers";

const App = () => {
  const movies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  UseMovieSearch(searchQuery, movies.movies.page);
  useInfiniteScroll("observe-end", handleObserver, dispatch, [movies]);

  const closeModal = () => setOpen(false);

  const searchMovies = (query) => {
    dispatch(moviesSlice.actions.resetPage());
    navigate("/");
    getSearchResults(query, setSearchParams);
  };

  const viewTrailer = (movie) => {
    getMovie(movie.id);
    if (!videoKey) setOpen(true);
  };

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  return (
    <div className="App">
      <Header
        searchMovies={searchMovies}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <div className="container">
        <Modal isOpen={isOpen} closeModal={closeModal}>
          <YouTubePlayer videoKey={videoKey} />
        </Modal>

        <Routes>
          <Route
            path="/"
            element={<Movies movies={movies} viewTrailer={viewTrailer} />}
          />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
