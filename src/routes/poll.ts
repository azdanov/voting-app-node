import express from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import mongoose from 'mongoose';

import { assignValidationsToSession, hashids } from '../utilities';

export const pollAll = async (req: express.Request, res: express.Response) => {
  const Poll = mongoose.model('Poll');
  const polls = await Poll.find().sort('-created');

  res.render('pollAll', { polls, title: 'All Polls' });
};

export const pollNew = (req: express.Request, res: express.Response) => {
  res.render('pollNew', { title: 'New Poll' });
};

export const validatePoll = [
  check('pollName', 'Must have a poll name')
    .exists()
    .isString(),
  check('pollOptions', 'Must have options')
    .exists()
    .isString(),
  sanitize('pollName')
    .escape()
    .trim(),
  sanitize('pollOptions')
    .escape()
    .trim(),
];

export const pollAdd = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);
    return res.status(422).redirect('/poll/new');
  }

  const { pollName, pollOptions } = matchedData(req, { locations: ['body'] });

  const regexp = new RegExp(/[^\r\n]+/g);
  const options: string[] = pollOptions.match(regexp);

  const Poll = mongoose.model('Poll');

  try {
    const poll = await new Poll({
      options,
      name: pollName,
      author: req.user!._id,
    }).save();

    req.flash(
      'success',
      `Poll submitted | <a href="/poll/${hashids.encodeHex(poll.id)}">View poll</a>`,
    );
  } catch (error) {
    req.flash('error', `${error.errors.name.message || 'Poll submission failed'}`);
  }

  res.redirect('/poll/new');
};

export const pollOne = async (req: express.Request, res: express.Response) => {
  const pollHashid = req.params.id;
  const id = hashids.decodeHex(pollHashid);

  const Poll = mongoose.model('Poll');

  let userVote;
  if (req.user) {
    userVote = await Poll.findOne(
      {
        _id: id,
        'votes.person': { $in: [req.user!._id] },
      },
      ['votes'],
    );
  }

  if (userVote) {
    // @ts-ignore Extract current user vote
    userVote = userVote.votes.filter(vote => vote.person.equals(req.user!._id))[0];
  }

  // @ts-ignore
  const votes = await Poll.getTopStores(id);
  const poll = await Poll.findById(id);

  res.render('pollOne', { userVote, votes, poll, title: 'Poll' });
};

export const validateVote = [
  check('vote', 'Must have a vote')
    .exists()
    .isString(),
];

export const pollVote = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { vote } = req.body;

  const Poll = mongoose.model('Poll');

  const userVote = await Poll.findOne({
    'votes.person': { $in: [req.user!._id] },
  });

  if (userVote) {
    req.flash('warning', 'You have already voted');
    res.redirect('back');
    return;
  }

  await Poll.findByIdAndUpdate(id, {
    $push: { votes: { option: vote, person: req.user!._id } },
  });

  res.redirect(`/poll/${hashids.encodeHex(id)}`);
};
