import express from 'express';

import { loginForm } from './user';
import { mainPage } from './main';
import { login } from './auth';

const router = express.Router();

router.get('/', mainPage);

router.get('/login', loginForm);
router.post('/login', login);

export default router;
