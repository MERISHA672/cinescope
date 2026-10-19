
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  PlayArrow,
  YouTube,
} from "@mui/icons-material";
import { fetchMovies, getPoster } from "../api";

export default function MovieDetailsDialog({
  open,
  onClose,
  movieId,
  mediaType = "movie",
}) {
  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !movieId) return;

    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError("");
      setDetails(null);
      setTrailer(null);
      setShowTrailer(false);

      try {
        const data = await fetchMovies(`/${mediaType}/${movieId}`);

        if (!cancelled) {
          setDetails(data);
        }

        // Load available trailers separately so a video error
        // does not prevent the movie details from appearing.
        try {
          const videoData = await fetchMovies(
            `/${mediaType}/${movieId}/videos`
          );

          const videos = videoData.results || [];

          const selectedTrailer =
            videos.find(
              (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.official &&
                video.key
            ) ||
            videos.find(
              (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.key
            ) ||
            videos.find(
              (video) =>
                video.site === "YouTube" &&
                video.type === "Teaser" &&
                video.key
            );

          if (!cancelled) {
            setTrailer(selectedTrailer || null);
          }
        } catch {
          if (!cancelled) {
            setTrailer(null);
          }
        }
      } catch {
        if (!cancelled) {
          setError("Could not load details. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [open, movieId, mediaType]);

  const title = details?.title || details?.name || "Untitled";
  const releaseDate =
    details?.release_date || details?.first_air_date;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={
        typeof window !== "undefined" &&
        window.innerWidth < 600
      }
      PaperProps={{
        sx: {
          backgroundColor: "#151923",
          color: "#ffffff",
          borderRadius: { xs: 0, sm: 3 },
          margin: { xs: 0, sm: 2 },
          width: { xs: "100%", sm: "calc(100% - 32px)" },
          maxHeight: { xs: "100%", sm: "calc(100% - 64px)" },
          overflowY: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ flexGrow: 1, minWidth: 0 }}
        >
          {details ? title : "Title Details"}
        </Typography>

        <IconButton
          aria-label="Close movie details"
          onClick={onClose}
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#ff6b35" }} />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {details && !loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              py: 1,
            }}
          >
            <Box
              component="img"
              src={getPoster(details.poster_path)}
              alt={title}
              sx={{
                width: { xs: "100%", sm: 230 },
                maxWidth: { xs: 300, sm: 230 },
                alignSelf: { xs: "center", sm: "flex-start" },
                borderRadius: 2,
                objectFit: "cover",
              }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {title}
              </Typography>

              <Typography sx={{ color: "#a9b1c1", mb: 1 }}>
                {mediaType === "tv" ? "TV Show" : "Movie"}
                {releaseDate ? ` • ${releaseDate.slice(0, 4)}` : ""}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <Rating
                  value={Math.min(
                    5,
                    Math.max(0, Number(details.vote_average || 0) / 2)
                  )}
                  precision={0.5}
                  readOnly
                />
                <Typography>
                  {Number(details.vote_average || 0).toFixed(1)}/10
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Overview
              </Typography>

              <Typography
                sx={{ color: "#d1d5df", lineHeight: 1.8, mb: 2 }}
              >
                {details.overview ||
                  "No overview is available for this title."}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Release date:</strong>{" "}
                {releaseDate || "Not available"}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Genres:</strong>{" "}
                {details.genres?.length
                  ? details.genres.map((genre) => genre.name).join(", ")
                  : "Not available"}
              </Typography>

              {details.runtime > 0 && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Runtime:</strong> {details.runtime} minutes
                </Typography>
              )}

              {details.number_of_seasons && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Seasons:</strong> {details.number_of_seasons}
                </Typography>
              )}

              <Box sx={{ mt: 3 }}>
                {trailer ? (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => setShowTrailer((current) => !current)}
                    sx={{
                      backgroundColor: "#ff6b35",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      "&:hover": { backgroundColor: "#e95525" },
                    }}
                  >
                    {showTrailer ? "Hide Trailer" : "Watch Trailer"}
                  </Button>
                ) : (
                  <Typography sx={{ color: "#a9b1c1", fontSize: 14 }}>
                    No YouTube trailer is available for this title.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {details && showTrailer && trailer && (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
              <YouTube
                sx={{
                  color: "#ff4545",
                  verticalAlign: "middle",
                  mr: 1,
                }}
              />
              {title} — Trailer
            </Typography>

            <Box
              sx={{
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                borderRadius: 2,
                backgroundColor: "#000",
              }}
            >
              <Box
                component="iframe"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                  trailer.key
                )}`}
                title={`${title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                sx={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </Box>

            <Typography
              component="a"
              href={`https://www.youtube.com/watch?v=${encodeURIComponent(
                trailer.key
              )}`}
              target="_blank"
              rel="noreferrer"
              sx={{
                display: "inline-block",
                mt: 1.5,
                color: "#ff8a65",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Open trailer on YouTube
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
