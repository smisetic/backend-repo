const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

describe('Authentication API', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret'; // Fix JWT error
    await sequelize.sync({ force: true }); // Sync DB
    await User.create({
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'customer',
    });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200); // Matches your controller
    expect(res.body).toHaveProperty('id'); // Adjust based on response
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  }, 10000); // Timeout 10s to avoid hang
});