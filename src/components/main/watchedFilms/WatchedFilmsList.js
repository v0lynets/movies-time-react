import WatchedFilm from "./WatchedFilm.js";

export default function WatchedFilmsList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedFilm
          movie={movie}
          key={movie.imdbID}
          onDeleteMovie={onDeleteMovie}
        />
      ))}
    </ul>
  );
}
