import { render, screen } from '@testing-library/react';
import Watchlist from './Watchlist';

const mockMovies = [
  { id: 1, title: 'Movie 1', genre: 'Action', rating: 8.5, image: 'movie1.jpg' },
  { id: 2, title: 'Movie 2', genre: 'Drama', rating: 7.0, image: 'movie2.jpg' },
  { id: 3, title: 'Movie 3', genre: 'Horror', rating: 4.0, image: 'movie3.jpg' }
];

const mockToggleWatchlist = jest.fn();

describe('Watchlist', () => {
  test('renders watchlist title', () => {
    render(
      <Watchlist
        movies={mockMovies}
        watchlist={[]}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    expect(screen.getByText('Mi watchlist')).toBeInTheDocument();
  });

  test('renders movies in watchlist', () => {
    const watchlistIds = [1, 3];

    render(
      <Watchlist
        movies={mockMovies}
        watchlist={watchlistIds}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 3')).toBeInTheDocument();
    expect(screen.queryByText('Movie 2')).not.toBeInTheDocument();
  });

  test('renders empty watchlist', () => {
    render(
      <Watchlist
        movies={mockMovies}
        watchlist={[]}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    expect(screen.getByText('Mi watchlist')).toBeInTheDocument();
    // No movies should be rendered
    expect(screen.queryByText('Movie 1')).not.toBeInTheDocument();
  });
});