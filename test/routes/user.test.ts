import mongoose, { PassportLocalModel } from 'mongoose';
import supertest from 'supertest';
import crypto from 'crypto';
import { promisify } from 'bluebird';
import app from '../../src/app';
import { connect } from '../../src/db';

require('dotenv').config();

describe('GET /login', () => {
  it('should return 200 OK', () => {
    return supertest(app)
      .get('/login')
      .expect(200);
  });
});

describe('POST /login', () => {
  let trueUserId: string;
  let User: PassportLocalModel<mongoose.Document>;
  const trueEmail = `${crypto.randomBytes(10).toString('hex')}@true.com`;
  const trueName = crypto.randomBytes(10).toString('hex');
  const truePassword = crypto.randomBytes(10).toString('hex');
  const falseEmail = `${crypto.randomBytes(10).toString('hex')}@false.com`;
  const falsePassword = crypto.randomBytes(10).toString('hex');

  beforeAll(async () => {
    mongoose.connect(process.env.DATABASE);
    User = mongoose.model('User');

    const user = new User({ email: trueEmail, name: trueName });
    const register = promisify(User.register, { context: User });
    const result = await register(user, truePassword);

    trueUserId = result.id;
  });

  afterAll(async done => {
    await User.findByIdAndRemove(trueUserId);
    mongoose.disconnect(done);
  });

  it('should return 400 Bad Request without username', () => {
    return supertest(app)
      .post('/login')
      .send({ password: truePassword })
      .expect(400);
  });

  it('should return 400 Bad Request without password', () => {
    return supertest(app)
      .post('/login')
      .send({ email: trueEmail })
      .expect(400);
  });

  it('should return 401 Unauthorized without proper user', () => {
    return supertest(app)
      .post('/login')
      .send({ email: falseEmail, password: falsePassword })
      .expect(401);
  });

  it('should return 200 OK with proper user', () => {
    return supertest(app)
      .post('/login')
      .send({ email: trueEmail, password: truePassword })
      .expect(200);
  });
});
