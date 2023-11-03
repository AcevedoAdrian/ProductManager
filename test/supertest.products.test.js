import chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

describe('Testing E-Commerce - Rutas de productos', () => {
  let cookie;
  const user = {
    email: config.adminEmail,
    password: config.adminPassword
  };
  
  it('Debe loggear un usuario para ver los productos', async () => {
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

  it('El Endpoint GET /api/products debe devolver todos los productos', async () => {
    const response = await requester
      .get('/api/products')
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.statusCode).to.equal(200);
    expect(response.body.result.payload).to.be.an('array');
    expect(response.body.result.payload).to.have.lengthOf.above(0);
  });

  it('El Endpoint GET /api/products/:id debe devolver un producto por su ID', async () => {
    const pid = '6544ef9cdc49e1adeb4ba509';
    const response = await requester
      .get(`/api/products/${pid}`)
      .set('Cookie', [`${cookie.name}=${cookie.value}`]);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property('_id').equal(pid);
    expect(response.body.payload).to.have.property('title');
  });
});
