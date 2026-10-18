
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Search,
  Home as HomeIcon,
  Movie,
  LiveTv,
  Bookmark,
  Category,
} from "@mui/icons-material";

import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Watchlist from "./pages/Watchlist";
import SearchResults from "./pages/SearchResults";
import Genres from "./pages/Genres";

import { WatchlistProvider } from "./WatchlistContext";
import "./App.css";

function CineScopeLayout() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const navigation = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Movies", path: "/movies", icon: <Movie /> },
    { label: "TV Shows", path: "/tv-shows", icon: <LiveTv /> },
    { label: "My Favorites", path: "/watchlist", icon: <Bookmark /> },
    { label: "Genres", path: "/genres", icon: <Category /> },
  ];

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearch(value);

    navigate(value.trim() ? "/search" : "/");
  }

  return (
    <Box className="app-shell">
      <CssBaseline />

      <AppBar position="sticky" className="topbar">
        <Toolbar className="cinema-toolbar">
          <Typography
            variant="h5"
            className="brand"
            onClick={() => {
              setSearch("");
              navigate("/");
            }}
            sx={{ cursor: "pointer" }}
          >
            CineScope<span>.</span>
          </Typography>

          <TextField
            size="small"
            placeholder="Search movies and TV shows..."
            value={search}
            onChange={handleSearchChange}
            className="search-field"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flex: 1, minWidth: 180, maxWidth: 520 }}
          />
        </Toolbar>
      </AppBar>

      <Box className="layout">
        <Box component="aside" className="sidebar">
          <Typography className="menu-label">
            YOUR CINEMA
          </Typography>

          <Box className="navigation-list">
            {navigation.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                startIcon={item.icon}
                className="nav-item"
                onClick={() => {
                  if (item.path === "/") setSearch("");
                }}
                fullWidth
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box className="sidebar-footer">
            <span className="sidebar-footer-dot" />
            YOUR CINEMA UNIVERSE
          </Box>
        </Box>

        <Box component="main" className="main-content">
          <Routes>
            <Route path="/" element={<Home search={search} />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/genres" element={<Genres />} />
            <Route
              path="/search"
              element={<SearchResults search={search} />}
            />
            <Route path="*" element={<Home search={search} />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <WatchlistProvider>
      <BrowserRouter>
        <CineScopeLayout />
      </BrowserRouter>
    </WatchlistProvider>
  );
}
