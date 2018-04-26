import express from 'express';

export const profilePage = (req: express.Request, res: express.Response) => {
  req.session!.form = { warnings: {}, values: {} };
  req.session!.form.values = { email: req.user!.email, name: req.user!.name };

  res.render('profile', { title: 'Profile' });
};

export const profileUpdate = (req: express.Request, res: express.Response) => {
  console.log(req.body);

  res.redirect('/profile');
};
