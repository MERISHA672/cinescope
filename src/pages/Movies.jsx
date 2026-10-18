
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { fetchMovies, getPoster } from "../api";
import { useWatchlist } from "../WatchlistContext";
import MovieDetailsDialog from "../components/MovieDetailsDialog";

const genres = [
  { id: "", name: "All Genres" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science Fiction" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
];

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { addToWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const endpoint = genre
          ? `/discover/movie?with_genres=${genre}&sort_by=popularity.desc`
          : "/movie/popular";

        const data = await fetchMovies(endpoint);

        if (!cancelled) {
          setMovies(data.results || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "We couldn't load movies. Please check your connection and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [genre]);

  function openMovieDetails(movie) {
    setSelectedMovie(movie);
    setDetailsOpen(true);
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Discover Movies 🎬
        </Typography>

        <Typography sx={{ color: "#a9b1c1", mb: 3 }}>
          Explore popular movies and find your next favourite.
        </Typography>

        <TextField
          select
          label="Filter by genre"
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
          sx={{
            width: { xs: "100%", sm: 280 },
            mb: 4,
            "& .MuiInputLabel-root": { color: "#a9b1c1" },
            "& .MuiOutlinedInput-root": { color: "#ffffff" },
          }}
        >
          {genres.map((item) => (
            <MenuItem key={item.id || "all"} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#ff6b35" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button onClick={() => setGenre((current) => current)}>
              Retry
            </Button>
          </Alert>
        )}

        {!loading && !error && movies.length === 0 && (
          <Alert severity="info">No movies found for this genre.</Alert>
        )}

        {!loading && !error && movies.length > 0 && (
          <Grid container spacing={3}>
            {movies.map((movie) => {
              const saved = isInWatchlist(movie.id, "movie");

              return (
                <Grid
  key={movie.id}
  size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }}
>
                
                
                
                  <Card
                    className="movie-card"
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                  >
                    <Box
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${movie.title}`}
                      onClick={() => openMovieDetails(movie)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openMovieDetails(movie);
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getPoster(movie.poster_path)}
                        alt={movie.title || "Movie poster"}
                        className="poster"
                      />

                      <CardContent>
                        <Typography
                          className="movie-title"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          {movie.title}
                        </Typography>

                        <Typography className="movie-meta">
                          {movie.release_date
                            ? movie.release_date.slice(0, 4)
                            : "Release date unknown"}
                          {" · "}⭐{" "}
                          {Number(movie.vote_average || 0).toFixed(1)}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#ff6b35",
                            fontSize: "0.85rem",
                            mt: 1,
                          }}
                        >
                          View details →
                        </Typography>
                      </CardContent>
                    </Box>

                    <CardContent sx={{ pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          color: "#ff6b35",
                          borderColor: "#ff6b35",
                        }}
                        disabled={saved}
                        onClick={() => addToWatchlist(movie, "movie")}
                      >
                        {saved ? "Saved ✓" : "♡ Save"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <MovieDetailsDialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          movieId={selectedMovie?.id}
          mediaType="movie"
        />
      </Box>
    </Container>
  );
}
