import express from 'express';
import { catchErrors } from '../utilities';
import { isLoggedIn, login, logout } from './auth';
import { homePage } from './home';
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

const router = express.Router();

router.get('/', homePage);

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

router.get('/poll/all', isLoggedIn, catchErrors(pollAll));

router.get('/poll/new', isLoggedIn, pollNew);
router.post('/poll/new', isLoggedIn, validatePoll, catchErrors(pollAdd));

router.get('/poll/:id', catchErrors(pollOne));
router.post('/poll/:id', isLoggedIn, validateVote, catchErrors(pollVote));

// sanity check route
router.get('/test', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

export default router;
