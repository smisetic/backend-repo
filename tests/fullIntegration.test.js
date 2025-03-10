const request = require('supertest');
const app = require('../server');

// Mock Stripe API to prevent real API calls during testing
jest.mock('stripe', () => {
  return jest.fn(() => ({
    charges: {
      create: jest.fn().mockResolvedValue({
        id: 'test-charge-id',
        status: 'succeeded'
      })
    }
  }));
});

describe('Full API Integration Tests', () => {
  it('should return 200 for API health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('API is running');
  });

  it('should allow a vendor to submit a claim', async () => {
    const res = await request(app)
      .post('/api/vendor/claim')
      .send({ vendorId: 'test-vendor-id', userId: 'test-user-id' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Claim request submitted successfully.');
  });

  it('should handle vendor claim approval', async () => {
    const res = await request(app)
      .post('/api/vendor/approve-claim')
      .send({ claimId: 'test-claim-id' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Claim approved successfully.');
  });

  it('should reject invalid vendor claims', async () => {
    const res = await request(app)
      .post('/api/vendor/claim')
      .send({ vendorId: '', userId: 'test-user-id' });
    expect(res.status).toBe(400);
  });

  it('should process payment through Stripe Mock', async () => {
    const res = await request(app)
      .post('/api/payment/charge')
      .send({ amount: 100, currency: 'usd', source: 'tok_visa' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Payment successful');
  });
});
