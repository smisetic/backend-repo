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

    // Ensure correct response
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Claim request submitted successfully.');
  });

  it('should reject invalid vendor claims', async () => {
    const res = await request(app)
      .post('/api/vendor/claim')
      .send({ vendorId: '', userId: 'test-user-id' });

    // Expect 400 for invalid claim
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined(); // Error message should exist
  });

  it('should return 404 for non-existing routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});
