import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock fetch
global.fetch = jest.fn();

const mockMovies = [
  { id: 1, title: 'Movie 1', genre: 'Action', rating: 8.5, image: 'movie1.jpg' },
  { id: 2, title: 'Movie 2', genre: 'Drama', rating: 7.0, image: 'movie2.jpg' }
];

beforeEach(() => {
  fetch.mockClear();
  fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockMovies)
  });
});

test('renders app and loads movies', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Check if header is rendered
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Watchlist')).toBeInTheDocument();

  // Wait for movies to load
  await waitFor(() => {
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
  });

  expect(screen.getByText('Movie 2')).toBeInTheDocument();
});
