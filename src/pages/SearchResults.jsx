
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchMovies, getPoster } from "../api";

export default function SearchResults({ search }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const query = search.trim();

    if (!query) {
      setResults([]);
      setLoading(false);
      setError("");
      return;
    }

    async function searchTitles() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMovies(
          `/search/multi?query=${encodeURIComponent(query)}&include_adult=false`
        );

        if (!cancelled) {
          setResults(
            (data.results || []).filter(
              (item) => item.media_type === "movie" || item.media_type === "tv"
            )
          );
        }
      } catch {
        if (!cancelled) {
          setError("Search failed. Please check your connection and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(searchTitles, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Search Results 🔍
      </Typography>

      <Typography sx={{ color: "#a9b1c1", mb: 3 }}>
        {search.trim()
          ? `Results for "${search.trim()}"`
          : "Type a movie or TV show in the search bar above."}
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#ff6b35" }} />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && search.trim() && results.length === 0 && (
        <Alert severity="info">
          No matching movies or TV shows found.
        </Alert>
      )}

      {!loading && results.length > 0 && (
        <Grid container spacing={3}>
          {results.map((item) => {
            const isTV = item.media_type === "tv";
            const title = item.title || item.name || "Untitled";

            return (
              <Grid
                key={`${item.media_type}-${item.id}`}
                size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
              >
                <Card
                  className="movie-card"
                  onClick={() =>
                    navigate(isTV ? "/tv-shows" : "/movies")
                  }
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getPoster(item.poster_path)}
                    alt={`${title} poster`}
                    className="poster"
                  />

                  <CardContent>
                    <Typography className="movie-title" fontWeight="bold">
                      {title}
                    </Typography>

                    <Typography className="movie-meta">
                      {isTV ? "TV Show" : "Movie"}
                      {" · "}
                      {(
                        item.release_date || item.first_air_date || ""
                      ).slice(0, 4) || "Year unavailable"}
                    </Typography>

                    <Typography sx={{ mt: 1, color: "#ff6b35" }}>
                      ⭐ {Number(item.vote_average || 0).toFixed(1)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
