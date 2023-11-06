import chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';
import { faker } from '@faker-js/faker';
const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

describe('Testing rutas de sessions', () => {
  const mockUser = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 99 }),
    password: '1234'
  };
  it('Debe registrar un usuario', async () => {
    try {
      const response = await requester.post('/api/sessions/register').send(mockUser);
      expect(response.status).to.equal(302);
    } catch (error) {
      throw error;
    }
  });
});
