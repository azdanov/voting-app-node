import express from 'express';
import passport from 'passport';

export const login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!',
});

export const logout = (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect('/');
};
