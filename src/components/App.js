import { useState, useEffect } from "react";
import NavBar from "./navbar/NavBar";
import Main from "./main/Main";
import NumResult from "./navbar/NumResult";
import FilmsList from "./main/films/FilmsList";
import Logo from "./navbar/Logo";
import Search from "./navbar/Search";
import Box from "./main/Box";
import Summary from "./main/watchedFilms/Summary";
import WatchedFilmsList from "./main/watchedFilms/WatchedFilmsList";
import Loader from "./main/Loader";
import Error from "./main/Error";
import MovieDetail from "./main/watchedFilms/MovieDetail";

const KEY = "de510cc0";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleOpenFilmDetail(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseFilmDetail() {
    setSelectedId(null);
  }

  function handleWatchedMovies(movie) {
    setWatched((wathced) => [...watched, movie]);
  }

  function handleDeleteMovieFromWatchList(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseFilmDetail();
      fetchMovies();

      return () => controller.abort();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <FilmsList
              movies={movies}
              onOpenFilmDetail={handleOpenFilmDetail}
            />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              onCloseFilmDetail={handleCloseFilmDetail}
              onWatchMovie={handleWatchedMovies}
              watched={watched}
            />
          ) : (
            <>
              {watched.length !== 0 && (
                <>
                  <Summary watched={watched} />
                  <WatchedFilmsList
                    watched={watched}
                    onDeleteMovie={handleDeleteMovieFromWatchList}
                  />
                </>
              )}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
