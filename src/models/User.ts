import md5 from 'md5';
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import validator from 'validator';
import crypto from 'crypto';
import { logger } from '../utilities';

const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: 'Two users cannot share the same email ({VALUE})',
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please provide your email address',
  },
  name: {
    type: String,
    required: 'Please provide your name',
    trim: true,
  },
  twitterProvider: {
    type: {
      id: String,
      token: String,
    },
    select: false,
  },
});

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=144`;
});

userSchema.statics.authTwitterUser = function(accessToken, refreshToken, profile, done) {
  return this.findOne(
    {
      'twitterProvider.id': profile.id,
    },
    (err, user) => {
      if (user) {
        return done(err, user);
      }

      const newUser = new this({
        email: profile.emails[0].value,
        name: profile.displayName,
        twitterProvider: {
          accessToken,
          refreshToken,
          id: profile.id,
        },
      });

      this.register(
        newUser,
        crypto.randomBytes(16).toString('hex'),
        (error, savedUser) => {
          if (error) {
            logger.error(error);
          }

          return done(error, savedUser);
        },
      );
    },
  );
};

userSchema.plugin(mongooseBeautifulUniqueValidation);
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export function createUser() {
  return mongoose.model('User', userSchema);
}
