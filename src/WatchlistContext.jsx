
import { createContext, useContext, useEffect, useState } from "react";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem("cinescope_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "cinescope_watchlist",
      JSON.stringify(watchlist)
    );
  }, [watchlist]);

  function addToWatchlist(item, mediaType = "movie") {
    setWatchlist((current) => {
      const exists = current.some(
        (saved) =>
          saved.id === item.id && saved.mediaType === mediaType
      );

      if (exists) return current;

      return [...current, { ...item, mediaType }];
    });
  }

  function removeFromWatchlist(id, mediaType) {
    setWatchlist((current) =>
      current.filter(
        (item) =>
          !(item.id === id && item.mediaType === mediaType)
      )
    );
  }

  function isInWatchlist(id, mediaType) {
    return watchlist.some(
      (item) => item.id === id && item.mediaType === mediaType
    );
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error(
      "useWatchlist must be used inside WatchlistProvider"
    );
  }

  return context;
}
