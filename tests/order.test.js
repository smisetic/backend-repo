const request = require('supertest');
const app = require('../server');

describe('Order API', () => {
  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ userId: 'some-user-id', vendorId: 'some-vendor-id', totalAmount: 50.0 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should update an order status', async () => {
    const res = await request(app)
      .put('/api/orders/some-order-id/status')
      .send({ status: 'shipped' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('shipped');
  });
});
