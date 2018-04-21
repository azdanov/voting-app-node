import supertest from 'supertest';
import app from '../../src/app';

describe('GET /', () => {
  it('should return 200 OK', () => {
    return supertest(app)
      .get('/test')
      .expect(200);
  });
});
