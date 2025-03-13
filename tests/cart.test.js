const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/db');
const db = require('../models');

describe('Cart API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await db.Inventory.create({
      id: 'some-item-id',
      vendorId: 'some-vendor-id',
      name: 'Test Item',
      price: 10.99,
      latitude: 40.7128,
      longitude: -74.0060,
      stockCount: 10,
    });
  });

  it('should add an item to the cart', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .send({ userId: 'some-user-id', inventoryId: 'some-item-id', quantity: 1 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.totalAmount).toBe(10.99);
  });
});