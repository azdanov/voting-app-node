import express from 'express';

import { login, logout } from './auth';
import { homePage } from './home';
import { loginForm, register, registerForm, validateRegister } from './user';

const router = express.Router();

router.get('/', homePage);

router.get('/login', loginForm);
router.post('/login', login);

router.get('/register', registerForm);
router.post('/register', validateRegister, register, login);

router.get('/logout', logout);

export default router;
