import mongoose from 'mongoose';
import validator from 'validator';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
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

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export function createUser() {
  return mongoose.model('User', userSchema);
}
