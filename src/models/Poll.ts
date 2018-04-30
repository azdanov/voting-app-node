import mongoose from 'mongoose';
import { uniq } from 'lodash';
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation');
const { Schema } = mongoose;

const Poll = new Schema({
  name: {
    type: String,
    unique: 'Must have a unique name',
    required: 'Must have a name',
  },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  created: { type: Date, default: Date.now },
  options: [String],
  votes: [{ option: String, person: { type: Schema.Types.ObjectId, ref: 'User' } }],
});

Poll.pre('save', function(this: any, next) {
  this.options = uniq(this.options);
  next();
});

Poll.plugin(mongooseBeautifulUniqueValidation);

export function createPoll() {
  return mongoose.model('Poll', Poll);
}
