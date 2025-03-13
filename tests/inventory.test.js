const request = require('supertest');
const app = require('../server');

describe('Inventory API', () => {
    it('should retrieve inventory items', async () => {
      // Assuming an item exists; create one first if needed
      const res = await request(app).get('/api/inventory/some-item-id');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
    });
});
