import mongoose from 'mongoose';
import validator from 'validator';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

export function createUser() {
  return mongoose.model('User', userSchema);
}
