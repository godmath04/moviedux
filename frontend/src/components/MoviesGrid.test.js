import { render, screen, fireEvent } from '@testing-library/react';
import MoviesGrid from './MoviesGrid';

const mockMovies = [
  { id: 1, title: 'Action Movie', genre: 'Action', rating: 8.5, image: 'action.jpg' },
  { id: 2, title: 'Drama Movie', genre: 'Drama', rating: 7.0, image: 'drama.jpg' },
  { id: 3, title: 'Horror Movie', genre: 'Horror', rating: 4.0, image: 'horror.jpg' }
];

const mockWatchlist = [1];
const mockToggleWatchlist = jest.fn();

describe('MoviesGrid', () => {
  test('renders all movies initially', () => {
    render(
      <MoviesGrid
        movies={mockMovies}
        watchlist={mockWatchlist}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    expect(screen.getByText('Action Movie')).toBeInTheDocument();
    expect(screen.getByText('Drama Movie')).toBeInTheDocument();
    expect(screen.getByText('Horror Movie')).toBeInTheDocument();
  });

  test('filters movies by search term', () => {
    render(
      <MoviesGrid
        movies={mockMovies}
        watchlist={mockWatchlist}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const searchInput = screen.getByPlaceholderText('Buscar película...');
    fireEvent.change(searchInput, { target: { value: 'Action' } });

    expect(screen.getByText('Action Movie')).toBeInTheDocument();
    expect(screen.queryByText('Drama Movie')).not.toBeInTheDocument();
    expect(screen.queryByText('Horror Movie')).not.toBeInTheDocument();
  });

  test('filters movies by genre', () => {
    render(
      <MoviesGrid
        movies={mockMovies}
        watchlist={mockWatchlist}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const genreSelect = screen.getByDisplayValue('All Genres');
    fireEvent.change(genreSelect, { target: { value: 'Drama' } });

    expect(screen.queryByText('Action Movie')).not.toBeInTheDocument();
    expect(screen.getByText('Drama Movie')).toBeInTheDocument();
    expect(screen.queryByText('Horror Movie')).not.toBeInTheDocument();
  });

  test('filters movies by rating - Good', () => {
    render(
      <MoviesGrid
        movies={mockMovies}
        watchlist={mockWatchlist}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const ratingSelect = screen.getByDisplayValue('All');
    fireEvent.change(ratingSelect, { target: { value: 'Good' } });

    expect(screen.getByText('Action Movie')).toBeInTheDocument();
    expect(screen.queryByText('Drama Movie')).not.toBeInTheDocument();
    expect(screen.queryByText('Horror Movie')).not.toBeInTheDocument();
  });

  test('filters movies by rating - Bad', () => {
    render(
      <MoviesGrid
        movies={mockMovies}
        watchlist={mockWatchlist}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const ratingSelect = screen.getByDisplayValue('All');
    fireEvent.change(ratingSelect, { target: { value: 'Bad' } });

    expect(screen.queryByText('Action Movie')).not.toBeInTheDocument();
    expect(screen.queryByText('Drama Movie')).not.toBeInTheDocument();
    expect(screen.getByText('Horror Movie')).toBeInTheDocument();
  });

  test('combines filters correctly', () => {
    const moreMovies = [
      ...mockMovies,
      { id: 4, title: 'Another Action', genre: 'Action', rating: 9.0, image: 'another.jpg' }
    ];

    render(
      <MoviesGrid
        movies={moreMovies}
        watchlist={mockWatchlist}
        toggleWatchlist={mockToggleWatchlist}
      />
    );

    const searchInput = screen.getByPlaceholderText('Buscar película...');
    fireEvent.change(searchInput, { target: { value: 'Action' } });

    const genreSelect = screen.getByDisplayValue('All Genres');
    fireEvent.change(genreSelect, { target: { value: 'Action' } });

    expect(screen.getByText('Action Movie')).toBeInTheDocument();
    expect(screen.getByText('Another Action')).toBeInTheDocument();
    expect(screen.queryByText('Drama Movie')).not.toBeInTheDocument();
  });
});