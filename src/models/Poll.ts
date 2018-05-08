import { uniq } from 'lodash';
import mongoose from 'mongoose';
import { hashids } from '../utilities';

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

Poll.virtual('hashid').get(function() {
  return hashids.encodeHex(this._id);
});

Poll.virtual('authorHashid').get(function() {
  return hashids.encodeHex(this.author._id);
});

function deDuplicate(next) {
  this.options = uniq(this.options);
  next();
}

function autoPopulate(next) {
  this.populate('author');
  next();
}

Poll.pre('save', deDuplicate);
Poll.pre('find', autoPopulate);
Poll.pre('findOne', autoPopulate);

Poll.statics.getTopStores = async function(id: string) {
  return (await this.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) },
    },
    {
      $project: { _id: 0, votes: 1 },
    },
    {
      $unwind: '$votes',
    },
    {
      $group: {
        _id: '$votes.option',
        votes: { $sum: 1 },
      },
    },
    {
      $addFields: { option: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { option: 1 },
    },
  ])).reduce((acc, item) => {
    acc[item.option] = item.votes;
    return acc;
  }, {});
};

Poll.plugin(mongooseBeautifulUniqueValidation);

export function createPoll() {
  return mongoose.model('Poll', Poll);
}
