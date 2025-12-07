const request = require('supertest');
const app = require('../index');

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
    });

    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.body.status).toBe('healthy');
    });

    it('should include environment', async () => {
      const res = await request(app).get('/health');
      expect(res.body).toHaveProperty('environment');
    });
  });

  describe('GET /ready', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/ready');
      expect(res.statusCode).toBe(200);
    });

    it('should return ready status', async () => {
      const res = await request(app).get('/ready');
      expect(res.body.status).toBe('ready');
    });
  });
});
