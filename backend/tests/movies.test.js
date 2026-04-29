const request = require('supertest');
const express = require('express');
const moviesRoutes = require('../routes/movies');

// Mock the db module
jest.mock('../db', () => ({
  poolPromise: Promise.resolve({
    request: jest.fn().mockReturnThis(),
    input: jest.fn().mockReturnThis(),
    query: jest.fn()
  }),
  sql: {
    NVarChar: 'NVarChar'
  }
}));

const app = express();
app.use(express.json());
app.use('/api/movies', moviesRoutes);

describe('Movies API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/movies', () => {
    it('should return all movies', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', description: 'Desc 1' },
        { id: 2, title: 'Movie 2', description: 'Desc 2' }
      ];

      const { poolPromise } = require('../db');
      const mockPool = await poolPromise;
      mockPool.request().query.mockResolvedValue({ recordset: mockMovies });

      const response = await request(app).get('/api/movies');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMovies);
    });

    it('should handle database errors', async () => {
      const { poolPromise } = require('../db');
      const mockPool = await poolPromise;
      mockPool.request().query.mockRejectedValue(new Error('DB Error'));

      const response = await request(app).get('/api/movies');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/movies', () => {
    it('should create a new movie', async () => {
      const newMovie = { title: 'New Movie', description: 'New Desc' };

      const { poolPromise } = require('../db');
      const mockPool = await poolPromise;
      mockPool.request().input().input().query.mockResolvedValue({});

      const response = await request(app)
        .post('/api/movies')
        .send(newMovie);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Película insertada correctamente');
    });

    it('should handle database errors on create', async () => {
      const newMovie = { title: 'New Movie', description: 'New Desc' };

      const { poolPromise } = require('../db');
      const mockPool = await poolPromise;
      mockPool.request().input().input().query.mockRejectedValue(new Error('DB Error'));

      const response = await request(app)
        .post('/api/movies')
        .send(newMovie);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});