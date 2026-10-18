
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { getPoster } from "../api";
import { useWatchlist } from "../WatchlistContext";

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
        >
          My Watchlist ❤️
        </Typography>

        <Typography
          sx={{ color: "#a9b1c1", mt: 1, mb: { xs: 2, sm: 4 } }}
        >
          Your saved movies and TV shows.
        </Typography>

        {watchlist.length === 0 ? (
          <Alert severity="info">
            Your watchlist is empty. Save a movie or TV show to see it here.
          </Alert>
        ) : (
          <Grid container spacing={{ xs: 1.5, sm: 3 }}>
            {watchlist.map((item) => (
              <Grid
                key={`${item.mediaType}-${item.id}`}
                size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
              >
                <Card
                  className="movie-card"
                  sx={{
                    height: "100%",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getPoster(item.poster_path)}
                    alt={item.title || item.name || "Poster"}
                    className="poster"
                    sx={{
                      width: "100%",
                      aspectRatio: "2 / 3",
                      objectFit: "cover",
                    }}
                  />

                  <CardContent
                    sx={{
                      p: { xs: 1, sm: 2 },
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      minWidth: 0,
                      "&:last-child": {
                        pb: { xs: 1, sm: 2 },
                      },
                    }}
                  >
                    <Typography
                      className="movie-title"
                      fontWeight="bold"
                      sx={{
                        overflowWrap: "anywhere",
                        fontSize: { xs: "0.85rem", sm: "1rem" },
                      }}
                    >
                      {item.title || item.name || "Untitled"}
                    </Typography>

                    <Typography
                      className="movie-meta"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {item.mediaType === "tv" ? "TV Show" : "Movie"}
                      {" · "}⭐{" "}
                      {Number(item.vote_average || 0).toFixed(1)}
                    </Typography>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        removeFromWatchlist(item.id, item.mediaType)
                      }
                      sx={{
                        mt: "auto",
                        pt: 0.5,
                        pb: 0.5,
                        mt: 1.5,
                        minHeight: 40,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
