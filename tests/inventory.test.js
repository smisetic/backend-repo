const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/db');

describe('Inventory API', () => {
  let itemId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const Inventory = require('../models/Inventory');
    const item = await Inventory.create({
      vendorId: 'some-vendor-id',
      name: 'Test Item',
      price: 10.99,
      latitude: 40.7128,
      longitude: -74.0060,
      stockCount: 10,
    });
    itemId = item.id;
  });

  it('should retrieve inventory items', async () => {
    const res = await request(app).get(`/api/inventory/${itemId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });
});