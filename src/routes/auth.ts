import express from 'express';
import passport from 'passport';

export const login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!',
});

export const twitter = passport.authenticate('twitter', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in via Twitter!',
});

export const logout = (req: express.Request, res: express.Response) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
};

export const isLoggedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in to do that!');
  res.redirect('/login');
};
