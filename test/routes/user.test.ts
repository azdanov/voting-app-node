import mongoose from 'mongoose';
import supertest from 'supertest';
import crypto from 'crypto';

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
  let User: mongoose.Model<mongoose.Document>;
  let trueUserId: string;
  const trueUser = crypto.randomBytes(64).toString('hex');
  const truePassword = crypto.randomBytes(64).toString('hex');
  const falseUser = 'false';
  const falsePassword = 'false';

  beforeAll(async () => {
    mongoose.connect(process.env.DATABASE);
    User = mongoose.model('User');
    const user = new User({ username: trueUser, password: truePassword });
    const result = await user.save();
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
      .send({ username: trueUser })
      .expect(400);
  });

  it('should return 401 Unauthorized without proper user', () => {
    return supertest(app)
      .post('/login')
      .send({ username: falseUser, password: falsePassword })
      .expect(401);
  });

  it('should return 200 OK with proper user', () => {
    return supertest(app)
      .post('/login')
      .send({ username: trueUser, password: truePassword })
      .expect(401);
  });
});
