import express from 'express';

import { login, logout, isLoggedIn } from './auth';
import { homePage } from './home';
import { profilePage, profileUpdate } from './profile';
import { loginForm, register, registerForm, validateRegister } from './user';

const router = express.Router();

router.get('/', homePage);

router.get('/login', loginForm);
router.post('/login', login);

router.get('/register', registerForm);
router.post('/register', validateRegister, register, login);

router.get('/logout', logout);

router.get('/profile', isLoggedIn, profilePage);
router.post('/profile', isLoggedIn, profileUpdate);

// sanity check route
router.get('/test', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

export default router;
