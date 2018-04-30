import mongoose from 'mongoose';
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
  options: {
    type: [String],
    unique: 'Must have unique options',
  },
  votes: [{ option: String, person: { type: Schema.Types.ObjectId, ref: 'User' } }],
});

Poll.plugin(mongooseBeautifulUniqueValidation);

export function createPoll() {
  return mongoose.model('Poll', Poll);
}
