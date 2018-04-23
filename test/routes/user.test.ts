import { promisify } from 'bluebird';
import crypto from 'crypto';
import mongoose, { PassportLocalModel } from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app';

require('dotenv').config();

const db = process.env.DATABASE;

if (!db) {
  process.exit(1);
}

describe('User', () => {
  let User: PassportLocalModel<mongoose.Document>;

  beforeAll(async () => {
    await mongoose.connect(db || '');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /login', () => {
    it('should return 200 OK', () => {
      return supertest(app)
        .get('/login')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect(response => {
          expect(response.ok).toBeTruthy();
        });
    });
  });

  describe('POST /login', () => {
    let trueUserId: string;
    const trueEmail = `${crypto.randomBytes(10).toString('hex')}@true.com`;
    const trueName = crypto.randomBytes(10).toString('hex');
    const truePassword = crypto.randomBytes(10).toString('hex');
    const falseEmail = `${crypto.randomBytes(10).toString('hex')}@false.com`;
    const falsePassword = crypto.randomBytes(10).toString('hex');

    beforeAll(async () => {
      User = mongoose.model('User');

      const user = new User({ email: trueEmail, name: trueName });
      const register = promisify(User.register, { context: User });
      const result = await register(user, truePassword);

      trueUserId = result.id;
    });

    afterAll(async done => {
      await User.findByIdAndRemove(trueUserId);
    });

    it('should return "302 Found" with proper user', () => {
      return supertest(app)
        .post('/login')
        .send({ email: trueEmail, password: truePassword })
        .expect(302)
        .expect('Content-Type', /text\/plain/)
        .expect('Content-Length', '23')
        .expect('set-cookie', /connect.sid/)
        .expect(response => {
          expect(response.text).toBe('Found. Redirecting to /');
          expect(response.redirect).toBeTruthy();
        });
    });

    it('should return "302 Found" without username', () => {
      return supertest(app)
        .post('/login')
        .send({ password: truePassword })
        .expect(302)
        .expect('Content-Type', /text\/plain/)
        .expect('Content-Length', '28')
        .expect(response => {
          expect(response.text).toBe('Found. Redirecting to /login');
          expect(response.redirect).toBeTruthy();
        });
    });

    it('should return "302 Found" without password', () => {
      return supertest(app)
        .post('/login')
        .send({ email: trueEmail })
        .expect(302)
        .expect('Content-Type', /text\/plain/)
        .expect('Content-Length', '28')
        .expect(response => {
          expect(response.text).toBe('Found. Redirecting to /login');
          expect(response.redirect).toBeTruthy();
        });
    });

    it('should return "302 Found" without proper user', () => {
      return supertest(app)
        .post('/login')
        .send({ email: falseEmail, password: falsePassword })
        .expect(302)
        .expect('Content-Type', /text\/plain/)
        .expect('Content-Length', '28')
        .expect(response => {
          expect(response.text).toBe('Found. Redirecting to /login');
          expect(response.redirect).toBeTruthy();
        });
    });
  });

  describe('POST /logout', () => {
    let trueUserId: string;
    const trueEmail = `${crypto.randomBytes(11).toString('hex')}@true.com`;
    const trueName = crypto.randomBytes(11).toString('hex');
    const truePassword = crypto.randomBytes(11).toString('hex');

    beforeAll(async () => {
      User = mongoose.model('User');

      const user = new User({ email: trueEmail, name: trueName });
      const register = promisify(User.register, { context: User });
      const result = await register(user, truePassword);

      trueUserId = result.id;
    });

    afterAll(async () => {
      await User.findByIdAndRemove(trueUserId);
    });

    it('should return "302 Found" after logout', () => {
      return supertest(app)
        .post('/login')
        .send({ email: trueEmail, password: truePassword })
        .then(loginResponse => {
          supertest(app)
            .get('/logout')
            .set('cookie', loginResponse.header['set-cookie'])
            .expect(302)
            .then(logoutResponse => {
              expect(logoutResponse.text).toBe('Found. Redirecting to /');
              expect(logoutResponse.header['set-cookie']).toBeFalsy();
            });
        });
    });
  });

  describe('GET /register', () => {
    it('should return 200 OK', () => {
      return supertest(app)
        .get('/register')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect(response => {
          expect(response.ok).toBeTruthy();
        });
    });
  });

  describe('POST /register', () => {
    const trueEmail = `${crypto.randomBytes(11).toString('hex')}@true.com`;
    const trueName = crypto.randomBytes(11).toString('hex');
    const truePassword = crypto.randomBytes(11).toString('hex');

    beforeAll(async () => {
      User = mongoose.model('User');
    });

    afterAll(async () => {
      await User.findOneAndRemove({ email: trueEmail });
    });

    it('should return "302 Found" with proper user', () => {
      return supertest(app)
        .post('/register')
        .send({
          email: trueEmail,
          name: trueName,
          password: truePassword,
          passwordRepeat: truePassword,
        })
        .expect(302)
        .expect('set-cookie', /connect.sid/)
        .expect(response => {
          expect(response.text).toBe('Found. Redirecting to /');
          expect(response.redirect).toBeTruthy();
        });
    });

    it('should return "422 Unprocessable Entity" without an email', () => {
      return supertest(app)
        .post('/register')
        .send({
          name: trueName,
          password: truePassword,
          passwordRepeat: truePassword,
        })
        .expect(422)
        .expect(response => {
          expect(response.text).toMatch(/must be an email/);
        });
    });

    it('should return "422 Unprocessable Entity" without a name', () => {
      return supertest(app)
        .post('/register')
        .send({
          email: trueEmail,
          password: truePassword,
          passwordRepeat: truePassword,
        })
        .expect(422)
        .expect(response => {
          expect(response.text).toMatch(/must have a name/);
        });
    });

    it('should return "422 Unprocessable Entity" without a password', () => {
      return supertest(app)
        .post('/register')
        .send({
          email: trueEmail,
          name: trueName,
          passwordRepeat: truePassword,
        })
        .expect(422)
        .expect(response => {
          expect(response.text).toMatch(
            /passwords must be at least 5 chars long and contain one number/,
          );
          expect(response.text).toMatch(/passwords do not match/);
        });
    });
  });
});
