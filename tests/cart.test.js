const request = require('supertest');
const app = require('../server');

describe('Cart API', () => {
  it('should add an item to the cart', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .send({ userId: 'some-user-id', inventoryId: 'some-item-id', quantity: 1 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });
});
