import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import validator from 'validator';
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
});

userSchema.plugin(mongooseBeautifulUniqueValidation);
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export function createUser() {
  return mongoose.model('User', userSchema);
}
