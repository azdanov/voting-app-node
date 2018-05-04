import express from 'express';
import mongoose from 'mongoose';

export const homePage = async (req: express.Request, res: express.Response) => {
  const Poll = mongoose.model('Poll');

  const latestPolls = Poll.find({})
    .sort({ created: -1 })
    .limit(5);

  const popularPolls = Poll.find({})
    .sort({ votes: 1 })
    .limit(5);

  res.render('home', {
    popularPolls: await popularPolls,
    latestPolls: await latestPolls,
    title: 'Home',
  });
};
