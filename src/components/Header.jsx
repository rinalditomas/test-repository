import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "../styles/header.scss";
import moviesSlice from "../data/moviesSlice";

const Header = ({ searchMovies, searchQuery }) => {
  const starredMovies = useSelector((state) => state.starred.starredMovies);
  const dispatch = useDispatch();

  return (
    <header>
      <Link
        to="/"
        data-testid="home"
        onClick={() => {
          searchMovies("");
        }}
      >
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink
          to="/starred"
          data-testid="nav-starred"
          className="nav-starred"
        >
          {starredMovies.length > 0 ? (
            <>
              <i className="bi bi-star-fill bi-star-fill-white" />
              <sup className="star-number">{starredMovies.length}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to="/watch-later" className="nav-fav">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded">
        <div onClick={(e) => searchMovies("")} className="search-link">
          <input
            type="search"
            value={searchQuery || ""}
            data-testid="search-movies"
            onChange={(e) => searchMovies(e.target.value)}
            className="form-control rounded"
            placeholder="Search movies..."
            aria-label="Search movies"
            aria-describedby="search-addon"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
