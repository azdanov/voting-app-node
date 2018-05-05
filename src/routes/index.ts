import express from 'express';
import passport from 'passport';
import { catchErrors } from '../utilities';
import { isLoggedIn, login, logout } from './auth';
import { homePage, privacy, terms } from './home';
import {
  pollAdd,
  pollAll,
  pollNew,
  pollOne,
  pollVote,
  validatePoll,
  validateVote,
} from './poll';
import {
  profileDelete,
  profileNewPasswordPage,
  profileNewPasswordUpdate,
  profilePage,
  profileUpdate,
  validateNewPassword,
  validateUpdate,
} from './profile';
import { loginForm, register, registerForm, validateRegister } from './user';

export const router = express.Router();
export const callback = express.Router();

router.get('/', catchErrors(homePage));

router.get('/terms', terms);
router.get('/privacy', privacy);

router.get('/login', loginForm);
router.post('/login', login);

router.get('/register', registerForm);
router.post('/register', validateRegister, register, login);

router.post('/logout', isLoggedIn, logout);

router.get('/profile', isLoggedIn, profilePage);
router.post('/profile', isLoggedIn, validateUpdate, catchErrors(profileUpdate));
router.delete('/profile', isLoggedIn, catchErrors(profileDelete));

router.get('/profile/password', isLoggedIn, profileNewPasswordPage);
router.post(
  '/profile/password',
  isLoggedIn,
  validateNewPassword,
  catchErrors(profileNewPasswordUpdate),
);

router.get('/poll', catchErrors(pollAll));

router.get('/poll/new', isLoggedIn, pollNew);
router.post('/poll/new', isLoggedIn, validatePoll, catchErrors(pollAdd));

router.get('/poll/:id', catchErrors(pollOne));
router.post('/poll/:id', isLoggedIn, validateVote, catchErrors(pollVote));

router.get('/auth/twitter/', passport.authenticate('twitter'));

callback.get(
  '/auth/twitter/return/',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    req.flash('success', 'You are now logged in via Twitter!');
    res.redirect('/');
  },
);

// sanity check route
router.get('/test', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

// 404 on fallthrough
router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const err = new Error('Not Found');
  (<any>err).status = 404;
  next(err);
});
