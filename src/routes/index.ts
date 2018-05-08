import express from 'express';
import passport from 'passport';
import { catchAsyncErrors } from '../utilities';
import { isLoggedIn, login, logout } from './auth';
import { homePage, privacyPage, termsPage } from './home';
import {
  isPollOwner,
  pollAdd,
  pollAllPage,
  pollDelete,
  pollEditPage,
  pollNewPage,
  pollOnePage,
  pollUpdate,
  pollUserPage,
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
import { loginFormPage, register, registerFormPage, validateRegister } from './user';

export const router = express.Router();
export const callback = express.Router();

router.get('/', catchAsyncErrors(homePage));

router.get('/terms', termsPage);
router.get('/privacy', privacyPage);

router.get('/login', loginFormPage);
router.post('/login', login);

router.get('/register', registerFormPage);
router.post('/register', validateRegister, register, login);

router.post('/logout', isLoggedIn, logout);

router.get('/profile', isLoggedIn, profilePage);
router.patch('/profile', isLoggedIn, validateUpdate, catchAsyncErrors(profileUpdate));
router.delete('/profile', isLoggedIn, catchAsyncErrors(profileDelete));

router.get('/profile/password', isLoggedIn, profileNewPasswordPage);
router.patch(
  '/profile/password',
  isLoggedIn,
  validateNewPassword,
  catchAsyncErrors(profileNewPasswordUpdate),
);

router.get('/poll', catchAsyncErrors(pollAllPage));
router.post('/poll', isLoggedIn, validatePoll, catchAsyncErrors(pollAdd));

router.get('/poll/new', isLoggedIn, pollNewPage);
router.get('/poll/user/:id', catchAsyncErrors(pollUserPage));
router.get('/poll/edit/:id', isLoggedIn, isPollOwner, catchAsyncErrors(pollEditPage));

router.get('/poll/:id', catchAsyncErrors(pollOnePage));
router.patch('/poll/:id', isLoggedIn, validateVote, catchAsyncErrors(pollVote));
router.put(
  '/poll/:id',
  isLoggedIn,
  validatePoll,
  isPollOwner,
  catchAsyncErrors(pollUpdate),
);
router.delete('/poll/:id', isLoggedIn, isPollOwner, catchAsyncErrors(pollDelete));

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
router.get(
  '*',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err = new Error('Not Found');
    (<any>err).status = 404;
    next(err);
  },
);
