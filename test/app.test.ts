import supertest from 'supertest';
import app from '../src/app';

describe('GET /', () => {
  it('should return 200 OK', () => {
    return supertest(app)
      .get('/')
      .expect(200);
  });

  it('should respond with json', done => {
    return supertest(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '26')
      .expect(200, done);
  });

  it('should have a message', () => {
    return supertest(app)
      .get('/')
      .expect(200)
      .then(response => {
        expect(response.body.message).toBe('Hello World!');
      });
  });
});
