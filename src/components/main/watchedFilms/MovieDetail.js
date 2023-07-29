import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import Loader from "../Loader";
const KEY = "de510cc0";
export default function MovieDetail({
  selectedId,
  onCloseFilmDetail,
  onWatchMovie,
  watched,
}) {
  const [rating, setRating] = useState("");
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleRating(i) {
    setRating(i + 1);
  }

  function handleWatchList() {
    const Runtime = selectedMovie.Runtime.split(" ").at(0);
    const updatedMovie = { ...selectedMovie, Runtime, userRating: rating };

    onWatchMovie(updatedMovie);
    onCloseFilmDetail();
  }

  useEffect(
    function () {
      setIsLoading(true);
      async function fetchSelectedMovie() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();
        setSelectedMovie(data);
        setIsLoading(false);
      }

      if (selectedId === null) {
        setSelectedMovie([]);
        return;
      }

      fetchSelectedMovie();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!selectedMovie.Title) return;
      document.title = `Movie | ${selectedMovie.Title}`;

      return () => (document.title = "Movie's Time");
    },
    [selectedMovie.Title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseFilmDetail();
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [onCloseFilmDetail]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseFilmDetail}>
              &larr;
            </button>
            <img
              src={selectedMovie.Poster}
              alt={`Poster of ${selectedMovie.Title} movie`}
            ></img>
            <div className="details-overview">
              <h2>{selectedMovie.Title}</h2>
              <p>
                {selectedMovie.Released} • {selectedMovie.Runtime}
              </p>
              <p>{selectedMovie.Genre}</p>
              <p>
                <span>⭐️</span>
                {selectedMovie.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              ) : (
                <>
                  <StarRating
                    max={10}
                    rating={rating}
                    onAddRating={handleRating}
                  />
                  {rating && (
                    <button className="btn-add" onClick={handleWatchList}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>

            <p>
              <em>{selectedMovie.Plot}</em>
            </p>
            <p>Starring {selectedMovie.Actors}</p>
            <p>Directed by {selectedMovie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
