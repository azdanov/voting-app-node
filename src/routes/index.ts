import express from 'express';

import { loginForm, registerForm, validateRegister, register } from './user';
import { homePage } from './home';
import { login, logout } from './auth';
import { catchErrors } from '../utilities';

const router = express.Router();

router.get('/', homePage);

router.get('/login', loginForm);
router.post('/login', login);

router.get('/register', registerForm);
router.post('/register', validateRegister, register, login);

router.get('/logout', logout);

export default router;
