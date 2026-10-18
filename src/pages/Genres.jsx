
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Movie, Star } from "@mui/icons-material";
import { fetchMovies, getPoster } from "../api";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies("/genre/movie/list")
      .then((data) => setGenres(data.genres || []))
      .catch((err) => setError(err.message || "Unable to load genres."));
  }, []);

  async function chooseGenre(genre) {
    setSelected(genre);
    setLoading(true);
    setError("");

    try {
      const data = await fetchMovies(
        `/discover/movie?with_genres=${genre.id}&sort_by=popularity.desc`
      );
      setMovies(data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load movies for this genre.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="genres-page">
      <Typography variant="h4" fontWeight={900} gutterBottom>
        Explore Genres
      </Typography>

      <Typography className="muted" sx={{ mb: 3 }}>
        Find your next favorite movie by choosing a category.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box className="genre-list">
        {genres.map((genre) => (
          <Button
            key={genre.id}
            onClick={() => chooseGenre(genre)}
            className={`genre-chip ${selected?.id === genre.id ? "selected" : ""}`}
          >
            {genre.name}
          </Button>
        ))}
      </Box>

      {selected && (
        <Typography variant="h5" fontWeight={800} sx={{ mt: 4, mb: 2 }}>
          <Movie sx={{ mr: 1, verticalAlign: "middle", color: "#ff6b35" }} />
          {selected.name} Movies
        </Typography>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#ff6b35" }} />
        </Box>
      )}

      {!loading && selected && movies.length === 0 && !error && (
        <Typography className="muted">
          No movies found for this genre.
        </Typography>
      )}

      {!loading && movies.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {movies.map((movie) => (
            <Grid
              key={movie.id}
              size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
            >
              <Card className="movie-card">
                <CardMedia
                  component="img"
                  image={getPoster(movie.poster_path)}
                  alt={movie.title || "Movie poster"}
                  className="poster"
                />
                <CardContent>
                  <Typography className="movie-title">
                    {movie.title}
                  </Typography>
                  <Typography className="movie-meta">
                    <Star sx={{ fontSize: 15, verticalAlign: "middle", color: "#ffc857" }} />
                    {" "}{Number(movie.vote_average || 0).toFixed(1)}
                    {" · "}{(movie.release_date || "").slice(0, 4)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!selected && genres.length > 0 && (
        <Typography className="muted" sx={{ mt: 3 }}>
          Select a genre above to explore its movies.
        </Typography>
      )}
    </Box>
  );
}
