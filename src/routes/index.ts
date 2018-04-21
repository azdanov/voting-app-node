import express from 'express';

import { loginForm } from './user';
import { mainPage } from './main';

const router = express.Router();

router.get('/', mainPage);

router.get('/login', loginForm);

export default router;
