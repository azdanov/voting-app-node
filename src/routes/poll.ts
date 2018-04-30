import express from 'express';
import { validationResult, check } from 'express-validator/check';
import { sanitize, matchedData } from 'express-validator/filter';
import mongoose from 'mongoose';
import Hashids from 'hashids';

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

export const pollAdd = async (req: express.Request, res: express.Response) => {
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
