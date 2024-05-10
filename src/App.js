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

const App = () => {
  const movies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  UseMovieSearch(searchQuery, movies.movies.page);
  const closeModal = () => setOpen(false);

  const getSearchResults = (query) => {
    if (query !== "") {
      setSearchParams(createSearchParams({ search: query }));
    } else {
      setSearchParams();
    }
  };

  const searchMovies = (query) => {
    dispatch(moviesSlice.actions.resetPage());
    navigate("/");
    getSearchResults(query);
  };

  const viewTrailer = (movie) => {
    getMovie(movie.id);
    if (!videoKey) setOpen(true);
    setOpen(true);
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

  const observer = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    return () => {
      observer.current.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (movies.movies.results && movies.movies.results.length > 0) {
      observer.current.observe(document.getElementById("observe-end"));
    }
  }, [movies]);

  const handleObserver = (entities) => {
    const target = entities[0];

    if (target.isIntersecting) {
      dispatch(moviesSlice.actions.incrementPage());
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
            element={
              <Movies
                movies={movies}
                viewTrailer={viewTrailer}
              />
            }
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
