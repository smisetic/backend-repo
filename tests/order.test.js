const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/db');
const db = require('../models');

describe('Order API', () => {
  let orderId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await db.User.create({ id: 'some-user-id', email: 'test@example.com', password: 'hash', role: 'customer' });
    await db.Vendor.create({ id: 'some-vendor-id', name: 'Test Vendor', county: 'NY' });
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ userId: 'some-user-id', vendorId: 'some-vendor-id', totalAmount: 50.0 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    orderId = res.body.id;
  });

  it('should update an order status', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .send({ status: 'shipped' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('shipped');
  });
});