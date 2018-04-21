import mongoose from 'mongoose';

export const loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};
