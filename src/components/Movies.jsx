import Movie from "./Movie";
import "../styles/movies.scss";

const Movies = ({ movies, viewTrailer }) => {
  return (
    <div>
      <div data-testid="movies" className="movies-grid">
        {movies.movies.results?.map((movie) => {
          return (
            <Movie movie={movie} key={movie.name} viewTrailer={viewTrailer} />
          );
        })}
      </div>
      {movies.fetchStatus === "loading" && (
        <div className="loading-container">
          <h2 className="loading">Loading...</h2>
        </div>
      )}
      <div id="observe-end"></div>
    </div>
  );
};

export default Movies;
