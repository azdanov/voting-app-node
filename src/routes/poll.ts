import express from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import mongoose from 'mongoose';

import { assignValidationsToSession, hashids } from '../utilities';

export const isPollOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const id = hashids.decodeHex(req.params.id);
  const Poll = mongoose.model('Poll');
  const poll = await Poll.findById(id).select('author');

  if ((<any>poll)!.author._id.equals(req.user!._id)) {
    (<any>req).pollId = id;
    next();
    return;
  }

  req.flash('error', 'Must be an owner to edit this poll!');
  res.redirect('back');
};

export const pollAllPage = async (req: express.Request, res: express.Response) => {
  const Poll = mongoose.model('Poll');
  const polls = await Poll.find().sort('-created');
  const count = await Poll.count({});

  res.render('pollAll', { count, polls, title: 'All Polls' });
};

export const pollUserPage = async (req: express.Request, res: express.Response) => {
  const userId = hashids.decodeHex(req.params.id);
  const Poll = mongoose.model('Poll');
  const polls = await Poll.find({ author: userId }).sort('-created');
  const count = await Poll.count({ author: userId });

  res.render('pollUser', { count, polls, title: 'User Polls' });
};

export const pollNewPage = (req: express.Request, res: express.Response) => {
  res.render('pollNew', { title: 'New Poll' });
};

export const pollEditPage = async (req: express.Request, res: express.Response) => {
  const id = (<any>req).pollId;
  const Poll = mongoose.model('Poll');
  const poll = await Poll.findById(id).select('_id name options');

  res.render('pollEdit', { poll, title: 'Editing Poll' });
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
    return res.redirect('back');
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

export const pollUpdate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);
    return res.redirect('back');
  }

  const { pollName, pollOptions } = matchedData(req, { locations: ['body'] });

  const id = (<any>req).pollId;
  const regexp = new RegExp(/[^\r\n]+/g);
  const options: string[] = pollOptions.match(regexp);

  const Poll = mongoose.model('Poll');

  try {
    const poll = await Poll.findByIdAndUpdate(id, {
      options,
      name: pollName,
      author: req.user!._id,
      votes: [],
    });

    req.flash(
      'success',
      `Poll updated | <a href="/poll/${req.params.id}">View poll</a>`,
    );
  } catch (error) {
    req.flash('error', `${error.errors.name.message || 'Poll update failed'}`);
  }

  res.redirect('back');
};

export const pollDelete = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);
    return res.redirect('back');
  }

  const { pollName, pollOptions } = matchedData(req, { locations: ['body'] });

  const id = (<any>req).pollId;

  const Poll = mongoose.model('Poll');

  try {
    const poll = await Poll.findByIdAndRemove(id);

    req.flash('success', 'Poll deleted successfully');
  } catch (error) {
    req.flash('error', `${error.errors.name.message || 'Poll deletion failed'}`);
    res.redirect('back');
  }

  res.redirect('/');
};

export const pollOnePage = async (req: express.Request, res: express.Response) => {
  const pollHashid = req.params.id;
  const id = hashids.decodeHex(pollHashid);

  const Poll = mongoose.model('Poll');

  let userVote;

  if (req.user) {
    userVote = await Poll.findOne(
      {
        _id: id,
        'votes.person': req.user!._id,
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

  console.log(poll);

  res.locals.owner =
    poll && req.user ? (<any>poll)!.author._id.equals(req.user!._id) : false;

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

  const userVote = await Poll.findOne(
    {
      _id: id,
      'votes.person': req.user!._id,
    },
    ['votes'],
  );

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
