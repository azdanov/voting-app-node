import supertest from 'supertest';
import app from '../../src/app';

describe('GET /login', () => {
  it('should return 200 OK', () => {
    return supertest(app)
      .get('/login')
      .expect(200);
  });
});

describe('GET /register', () => {
  it('should return 200 OK', () => {
    return supertest(app)
      .get('/register')
      .expect(200);
  });
});
