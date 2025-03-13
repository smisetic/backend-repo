const request = require('supertest');
const app = require('../server');

describe('Payment API', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should process a payment', async () => {
    const res = await request(app)
      .post('/api/payment/charge')
      .send({ amount: 5000, currency: 'usd', source: 'tok_visa' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', '✅ Mock Payment Successful');
  });
});