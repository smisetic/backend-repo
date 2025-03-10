const request = require('supertest');
const app = require('../server');

describe('API Integration Tests', () => {
  it('should return a 200 response for API health check', async () => {
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
});
