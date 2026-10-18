
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
  Typography,
} from "@mui/material";
import {
  LocalFireDepartment,
  PlayArrow,
  Star,
} from "@mui/icons-material";
import { fetchMovies, getPoster } from "../api";

const getBackdrop = (path) =>
  path
    ? `https://image.tmdb.org/t/p/original${path}`
    : "";

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
        } else {
          results = results.filter(
            (item) => item.media_type === "movie" || !item.media_type
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

  const featured = movies.find(
    (movie) => movie.backdrop_path || movie.poster_path
  );

  const title = featured?.title || featured?.name || "Discover Your Next Favorite";

  return (
    <Container maxWidth="xl" className="home-container">
      {!search.trim() && featured && !loading && (
        <Box
          className="cinema-hero"
          sx={{
            backgroundImage: `linear-gradient(90deg, rgba(8,10,18,.97) 0%, rgba(8,10,18,.82) 48%, rgba(8,10,18,.12) 100%), linear-gradient(0deg, rgba(8,10,18,.55), transparent 45%), url("${getBackdrop(featured.backdrop_path || featured.poster_path)}")`,
          }}
        >
          <Box className="cinema-hero-content">
            <Typography className="hero-kicker">
              <LocalFireDepartment sx={{ fontSize: 18 }} />
              TRENDING THIS WEEK
            </Typography>

            <Typography className="cinema-hero-title">
              {title}
            </Typography>

            <Box className="hero-rating">
              <Star sx={{ color: "#ffc857", fontSize: 21 }} />
              <Typography component="span">
                {Number(featured.vote_average || 0).toFixed(1)} / 10
              </Typography>
              <Typography component="span" className="hero-year">
                {(featured.release_date || "").slice(0, 4)}
              </Typography>
            </Box>

            <Typography className="cinema-hero-description">
              {featured.overview ||
                "Explore this trending title and discover your next movie night favorite."}
            </Typography>

            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              className="hero-button"
              onClick={() =>
                document.getElementById("trending-movies")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Movies
            </Button>
          </Box>

          <Typography className="hero-index">
            C I N E S C O P E
          </Typography>
        </Box>
      )}

      {search.trim() && (
        <Box className="search-heading">
          <Typography variant="h4" fontWeight={800}>
            Search Results
          </Typography>
          <Typography className="muted">
            Discovering titles for "{search.trim()}"
          </Typography>
        </Box>
      )}

      <Box className="section-heading" id="trending-movies">
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {!search.trim() && (
              <LocalFireDepartment
                sx={{
                  color: "#ff6b35",
                  verticalAlign: "middle",
                  mr: 1,
                }}
              />
            )}
            {search.trim() ? "Matching Titles" : "Trending Movies"}
          </Typography>

          <Typography className="muted">
            {search.trim()
              ? `Results for "${search.trim()}"`
              : "The stories everyone is watching this week."}
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
