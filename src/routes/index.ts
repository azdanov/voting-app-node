import express from 'express';

import { login, logout, isLoggedIn } from './auth';
import { homePage } from './home';
import { loginForm, register, registerForm, validateRegister } from './user';
import { catchErrors } from '../utilities/catchErrors';
import { pollNew, validatePoll, pollAdd } from './poll';
import {
  profilePage,
  profileUpdate,
  validateUpdate,
  profileNewPasswordPage,
  validateNewPassword,
  profileNewPasswordUpdate,
  profileDelete,
} from './profile';

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

router.get('/poll/new', isLoggedIn, pollNew);
router.post('/poll/new', isLoggedIn, validatePoll, catchErrors(pollAdd));

// sanity check route
router.get('/test', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

export default router;
