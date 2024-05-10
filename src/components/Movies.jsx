import Movie from "./Movie";
import "../styles/movies.scss";

const Movies = ({
  movies,
  viewTrailer,
}) => {

  return (
    <div data-testid="movies" className="movies-grid">
      {movies.movies.results?.map((movie) => {
        return (
          <Movie
            movie={movie}
            key={movie.name}
            viewTrailer={viewTrailer}
          />
        );
      })}
      <div id="observe-end"></div>
    </div>
  );
};

export default Movies;


