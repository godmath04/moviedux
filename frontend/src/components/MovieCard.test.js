import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from './MovieCard';

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  genre: 'Action',
  rating: 8.5,
  image: 'test.jpg'
};

const mockToggleWatchlist = jest.fn();

describe('MovieCard', () => {
  test('renders movie information correctly', () => {
    render(
      <MovieCard
        movie={mockMovie}
        isWatchlisted={false}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  test('displays correct rating class for good rating', () => {
    render(
      <MovieCard
        movie={mockMovie}
        isWatchlisted={false}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const ratingElement = screen.getByText('8.5');
    expect(ratingElement).toHaveClass('rating-good');
  });

  test('displays correct rating class for ok rating', () => {
    const okMovie = { ...mockMovie, rating: 6.0 };
    render(
      <MovieCard
        movie={okMovie}
        isWatchlisted={false}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const ratingElement = screen.getByText('6.0');
    expect(ratingElement).toHaveClass('rating-ok');
  });

  test('displays correct rating class for bad rating', () => {
    const badMovie = { ...mockMovie, rating: 3.0 };
    render(
      <MovieCard
        movie={badMovie}
        isWatchlisted={false}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const ratingElement = screen.getByText('3.0');
    expect(ratingElement).toHaveClass('rating-bad');
  });

  test('calls toggleWatchlist when checkbox is clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        isWatchlisted={false}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggleWatchlist).toHaveBeenCalledWith(1);
  });

  test('shows correct label when watchlisted', () => {
    render(
      <MovieCard
        movie={mockMovie}
        isWatchlisted={true}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    expect(screen.getByText('En lista')).toBeInTheDocument();
  });

  test('shows correct label when not watchlisted', () => {
    render(
      <MovieCard
        movie={mockMovie}
        isWatchlisted={false}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    expect(screen.getByText('Add a la watchlist')).toBeInTheDocument();
  });
});