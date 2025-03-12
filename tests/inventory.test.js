const request = require('supertest');
const app = require('../server');

describe('Inventory API', () => {
  it('should retrieve inventory items', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
