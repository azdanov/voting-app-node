import passport from 'passport';
import express from 'express';

export const login = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/',
});

export const logout = (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect('/');
};
