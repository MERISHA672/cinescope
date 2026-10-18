
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
} from "@mui/icons-material";
import { BrowserRouter, NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Watchlist from "./pages/Watchlist";
import SearchResults from "./pages/SearchResults";
import { WatchlistProvider } from "./WatchlistContext";
import "./App.css";

function CineScopeLayout() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const navigation = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Movies", path: "/movies", icon: <Movie /> },
    { label: "TV Shows", path: "/tv-shows", icon: <LiveTv /> },
    { label: "My Watchlist", path: "/watchlist", icon: <Bookmark /> },
  ];

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearch(value);

    if (value.trim()) {
      navigate("/search");
    } else {
      navigate("/");
    }
  }

  return (
    <Box className="app-shell">
      <CssBaseline />

      <AppBar position="sticky" className="topbar">
        <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
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
            fullWidth={false}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flex: 1, minWidth: 200, maxWidth: 520 }}
          />
        </Toolbar>
      </AppBar>

      <Box className="layout">
        <Box component="aside" className="sidebar">
          <Typography className="menu-label">MENU</Typography>

          {navigation.map((item) => (
            <Button
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={() => {
                if (item.path === "/") setSearch("");
              }}
              startIcon={item.icon}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box component="main" className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Home search={search} />}
            />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route
              path="/search"
              element={<SearchResults search={search} />}
            />
            <Route
              path="*"
              element={<Home search={search} />}
            />
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
