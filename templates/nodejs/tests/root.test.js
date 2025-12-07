const request = require('supertest');
const app = require('../index');

describe('Root Endpoint', () => {
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
    });

    it('should return project info', async () => {
      const res = await request(app).get('/');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('org');
      expect(res.body).toHaveProperty('env');
      expect(res.body).toHaveProperty('project');
    });
  });

  describe('GET /unknown', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.statusCode).toBe(404);
    });
  });
});
