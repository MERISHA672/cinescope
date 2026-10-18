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
import { useWatchlist } from "../WatchlistContext";
import MovieDetailsDialog from "../components/MovieDetailsDialog";
import { fetchMovies, getPoster } from "../api";

export default function TVShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { addToWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    let cancelled = false;

    async function loadShows() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMovies("/tv/popular");

        if (!cancelled) {
          setShows(data.results || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load TV shows.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadShows();

    return () => {
      cancelled = true;
    };
  }, []);

  function openShowDetails(show) {
    setSelectedShow(show);
    setDetailsOpen(true);
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Explore TV Shows 📺
        </Typography>

        <Typography sx={{ color: "#a9b1c1", mt: 1, mb: 4 }}>
          Discover popular series from around the world.
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#ff6b35" }} />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error">{error}</Alert>
        )}

        {!loading && !error && shows.length === 0 && (
          <Typography>No TV shows found.</Typography>
        )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {shows.map((show) => {
              const saved = isInWatchlist(show.id, "tv");

              return (
                <Grid
                  key={show.id}
                  size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }}
                >
                  <Card
                    className="movie-card"
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    {/* Clickable TV show area */}
                    <Box
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${
                        show.name || "TV show"
                      }`}
                      onClick={() => openShowDetails(show)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          openShowDetails(show);
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getPoster(show.poster_path)}
                        alt={show.name || "TV show poster"}
                        className="poster"
                      />

                      <CardContent>
                        <Typography
                          className="movie-title"
                          fontWeight="bold"
                        >
                          {show.name || "Untitled"}
                        </Typography>

                        <Typography className="movie-meta">
                          {show.first_air_date?.slice(0, 4) ||
                            "Year unavailable"}
                          {" · "}⭐{" "}
                          {Number(show.vote_average || 0).toFixed(1)}
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

                    {/* Watchlist button */}
                    <CardContent sx={{ pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          color: "#ff6b35",
                          borderColor: "#ff6b35",
                        }}
                        disabled={saved}
                        onClick={() => addToWatchlist(show, "tv")}
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

        {/* TV Show Details Dialog */}
        <MovieDetailsDialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          movieId={selectedShow?.id}
          mediaType="tv"
        />
      </Box>
    </Container>
  );
}