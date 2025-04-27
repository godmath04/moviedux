import React from "react";
import "../styles.css";

export default function MovieCard({ movie, isWatchlisted, toggleWatchlist }) {
  const handleError = (e) => {
    e.target.src = "images/default.jpg"; // Fallback image
  };

  const getRatingClass = (rating) => {
    if (rating >= 8) return "rating-good";
    if (rating >= 5 && rating <= 8) return "rating-ok";
    return "rating-bad";
  };

  return (
    <div className="movie-card" key={movie.id}>
      <img
        className="movie-poster"
        src={`images/${movie.image}`}
        alt={movie.title}
        onError={handleError} // Handle image loading error
      ></img>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div>
          <span className="movie-card-genre">{movie.genre}</span>
          <span className={`movie-card-rating ${getRatingClass(movie.rating)}`}>
            {movie.rating}
          </span>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            checked={isWatchlisted}
            onChange={() => toggleWatchlist(movie.id)}
          ></input>

          <span className="slider">
            <span className="slider-label">
              {isWatchlisted ? "En lista" : "Add a la watchlist"}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
