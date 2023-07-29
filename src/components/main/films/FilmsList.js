import Film from "./Film";

export default function FilmsList({ movies, onOpenFilmDetail }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Film
          movie={movie}
          key={movie.imdbID}
          onOpenFilmDetail={onOpenFilmDetail}
        />
      ))}
    </ul>
  );
}
