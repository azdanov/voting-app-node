import mongoose from 'mongoose';

export const loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

export const onLogin = (req, res) => {
  res.redirect('/');
};
