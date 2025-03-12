const request = require('supertest');
const app = require('../server');

describe('Payment API', () => {
  it('should process a payment', async () => {
    const res = await request(app)
      .post('/api/payments')
      .send({ orderId: 'some-order-id', amount: 50.0, paymentMethod: 'credit_card' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('paymentId');
  });
});
