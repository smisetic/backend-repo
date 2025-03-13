const request = require('supertest');
const app = require('../server');

describe('Payment API', () => {
   it('should process a payment', async () => {
     const res = await request(app)
       .post('/api/payment/process')
       .send({ amount: 5000, currency: 'usd', source: 'tok_visa' });
     expect(res.statusCode).toEqual(200);
     expect(res.body).toHaveProperty('charge');
     });
});
