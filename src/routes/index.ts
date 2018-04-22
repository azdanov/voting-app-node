import express from 'express';

import { loginForm, onLogin } from './user';
import { mainPage } from './main';
import { login } from './auth';

const router = express.Router();

router.get('/', mainPage);

router.get('/login', loginForm);
router.post('/login', login, onLogin);

export default router;
