import express from 'express';

import { loginForm } from './user';

const router = express.Router();

router.get('/login', loginForm);

export default router;
