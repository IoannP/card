import request from 'supertest';
import { describe, before, test } from 'node:test';
import assert from 'node:assert';

import setupApp from '../src/index.js';
import cardData from '../assets/cardData.js';

let app;

before(() => {
  app = setupApp();
});

describe('Test server', () => {
  test('Get card data', async () => {
    const response = await request(app)
      .get('/data')
      .send(cardData);
    assert.deepEqual(response.body, cardData);
    assert.equal(response.status, 200);
  })
});