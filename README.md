# 🎬 CineScope — Movie Discovery App

**Discover movies. Explore TV shows. Build your watchlist.**

CineScope is a responsive movie discovery web application built with React and Vite. It allows users to explore popular movies and TV shows, search for titles, view detailed information, filter movies by genre, and save favourites to a personal watchlist.

## ✨ Features

- **Home page:** Discover trending or popular movie content.
- **Live search:** Search for movies and TV shows using the TMDB API.
- **Movie discovery:** Browse popular movies and filter them by genre.
- **TV shows:** Explore popular television series.
- **Details dialog:** View information such as title, poster, overview, rating, release date, and genres where available.
- **Personal watchlist:** Save and remove movies and TV shows.
- **Persistent storage:** Watchlist items remain saved after refreshing the browser using localStorage.
- **Responsive design:** Layout adapts to desktop, tablet, and mobile screens.
- **Loading and error states:** Feedback is displayed while content loads or when requests fail.

## 🛠️ Technologies Used

- React
- Vite
- JavaScript (ES6+)
- Material UI (MUI)
- React Router
- TMDB REST API
- CSS
- Browser localStorage

## 📁 Project Structure

```text
cinescope/
├── public/
├── src/
│   ├── components/
│   │   └── MovieDetailsDialog.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── TVShows.jsx
│   │   ├── Watchlist.jsx
│   │   └── SearchResults.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── WatchlistContext.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- Git
- A TMDB API access token

### 1. Clone the repository

Replace `YOUR_USERNAME` with your GitHub username after creating the repository.

```bash
git clone https://github.com/YOUR_USERNAME/cinescope.git
cd cinescope
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the TMDB API

Create a local `.env` file in the project root and add your own TMDB API read access token:

```env
VITE_TMDB_TOKEN=your_tmdb_read_access_token
```

Do not upload your real `.env` file or API token to GitHub. The `.env` file should be excluded through `.gitignore`.

For public deployment, a token exposed through a `VITE_` variable can be viewed in the browser bundle. Use a backend proxy or another appropriate secure arrangement if the token must remain confidential.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

`http://localhost:5173`

### 5. Build for production

```bash
npm run build
```

Vite creates the production build in the `dist` folder.

## 🔑 API Information

CineScope uses The Movie Database (TMDB) API to retrieve movie and television information, including posters, ratings, release dates, genres, and descriptions.

API documentation: https://developer.themoviedb.org/docs

This product uses the TMDB API but is not endorsed or certified by TMDB.

## 📱 Responsive Design

The interface is designed to adapt to different screen sizes, including:

- Desktop and laptop screens
- Tablets
- Mobile phones

The responsive layout adjusts navigation, content spacing, poster grids, and movie details to improve usability on smaller screens.

## 💾 Watchlist Storage

Saved movies and TV shows are stored in the browser's localStorage. This allows the watchlist to persist across page refreshes in the same browser. It is not a cloud-based account system, so saved items are not automatically shared across devices.

## 🚀 Future Improvements

- User accounts and cloud-synchronised watchlists
- More advanced filters and sorting
- Dedicated movie and TV show detail pages
- Additional accessibility improvements
- Secure server-side handling for API requests where required

## 📄 License and Attribution

Movie and television metadata and images are provided through the TMDB API. Their use is subject to TMDB's terms and attribution requirements.

Project author: YOUR NAME

Project: CineScope — Movie Discovery App
## 📸 Screenshots

### Homepage
![CineScope Homepage](screenshots/home page.jpg)

### Search Results
![CineScope Search Results](screenshots/searchresults.jpg)

### Movie Details
![CineScope Movie Details](screenshots/Details.jpg)

### Watchlist
![CineScope Watchlist](screenshots/ my watchlist.jpg)

