
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { LocalFireDepartment } from "@mui/icons-material";
import { fetchMovies, getPoster } from "../api";

export default function Home({ search = "" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const query = search.trim();

        const endpoint = query
          ? `/search/multi?query=${encodeURIComponent(query)}`
          : "/trending/movie/week";

        const data = await fetchMovies(endpoint);

        let results = data.results || [];

        if (query) {
          results = results.filter(
            (item) =>
              item.media_type === "movie" ||
              item.media_type === "tv"
          );
        }

        if (!cancelled) {
          setMovies(results);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load movies.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <Container maxWidth="xl">
      <Box className="hero">
        <Typography className="eyebrow">
          YOUR NEXT FAVORITE FILM
        </Typography>

        <Typography variant="h2" className="hero-title">
          Stories worth
          <br />
          staying up for.
        </Typography>

        <Typography className="hero-description">
          Discover movies and TV shows from around the world.
        </Typography>
      </Box>

      <Box className="section-heading">
        <Box>
          <Typography variant="h5" fontWeight="bold">
            <LocalFireDepartment
              sx={{
                color: "#ff6b35",
                verticalAlign: "middle",
                mr: 1,
              }}
            />
            {search.trim() ? "Search Results" : "Trending Movies"}
          </Typography>

          <Typography className="muted">
            {search.trim()
              ? `Results for "${search.trim()}"`
              : "Discover what's popular this week."}
          </Typography>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#ff6b35" }} />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && movies.length === 0 && (
        <Typography sx={{ mt: 4 }}>
          No results found. Try another title.
        </Typography>
      )}

      {!loading && !error && (
        <Grid container spacing={3}>
          {movies.map((item) => (
            <Grid
              key={`${item.media_type || "movie"}-${item.id}`}
              size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
            >
              <Card className="movie-card">
                <CardMedia
                  component="img"
                  image={getPoster(item.poster_path)}
                  alt={item.title || item.name || "Movie poster"}
                  className="poster"
                />

                <CardContent>
                  <Typography className="movie-title">
                    {item.title || item.name || "Untitled"}
                  </Typography>

                  <Typography className="movie-meta">
                    {(item.release_date || item.first_air_date || "")
                      .slice(0, 4) || "Year unavailable"}
                    {" · "}⭐{" "}
                    {Number(item.vote_average || 0).toFixed(1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography className="footer-note">
        Movie data and images provided by TMDB.
      </Typography>
    </Container>
  );
}
