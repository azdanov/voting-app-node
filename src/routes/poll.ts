import express from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import mongoose from 'mongoose';

import { assignValidationsToSession, hashids } from '../utilities';

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

export const pollShow = async (req: express.Request, res: express.Response) => {
  const pollHashid = req.params.id;
  const id = hashids.decodeHex(pollHashid);

  const Poll = mongoose.model('Poll');
  const poll = await Poll.findById(id);
  res.render('pollShow', { poll, title: 'Poll' });
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
  const poll = await Poll.findById(id);

  await Poll.findByIdAndUpdate(id, {
    $push: { votes: { option: vote, person: req.user!._id } },
  });

  res.redirect(`/poll/${hashids.encodeHex(id)}`);
};
