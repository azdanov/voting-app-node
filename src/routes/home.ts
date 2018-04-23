import express from 'express';

export const homePage = (req: express.Request, res: express.Response) => {
  res.render('home', { title: 'Home' });
};
