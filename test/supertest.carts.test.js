import chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

describe('Testing E-Commerce - Rutas de Carrito', () => {
  let cookie;
  const user = {
    email: 'adrian@gmail.com',
    password: '123456'
  };
  const userCart = '6548f9b4c0f51c33e931b173';

  it('Debe loggear un usuario para ver su carrito', async () => {
    const result = await requester.post('/api/sessions/login').send(user);
    const cookieResult = result.headers['set-cookie'][0];
    expect(cookieResult).to.be.ok;
    cookie = {
      name: cookieResult.split('=')[0],
      value: cookieResult.split('=')[1]
    };
    expect(cookie.name).to.be.ok.and.eql(config.jwtNameCookie);
    expect(cookie.value).to.be.ok;
  });

  it('El Endpoint GET /api/carts/:id debe devolver un carrito por su ID', async () => {
    const response = await requester
      .get(`/api/carts/${userCart}`)
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property('_id').equal(userCart);
  });
});
