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

// export const twitterReverse = (req: express.Request, res: express.Response) => {
//   request.post(
//     {
//       url: 'https://api.twitter.com/oauth/request_token',
//       oauth: {
//         oauth_callback: encodeURIComponent('http://localhost:3000/twitter-callback'),
//         consumer_key: 'KEY',
//         consumer_secret: 'SECRET',
//       },
//     },
//     (err, r, body) => {
//       if (err) {
//         return res.status(500).send({ message: err.message });
//       }
//
//       const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
//       res.send(JSON.parse(jsonStr));
//     },
//   );
// };
//
// export const callback = (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction,
// ) => {
//   request.post(
//     {
//       url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
//       oauth: {
//         consumer_key: process.env.TWITTER_KEY,
//         consumer_secret: process.env.TWITTER_SECRET,
//         token: req.query.oauth_token,
//       },
//       form: { oauth_verifier: req.query.oauth_verifier },
//     },
//     (err, r, body) => {
//       if (err) {
//         return res.status(500).send({ message: err.message });
//       }
//
//       const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
//       const parsedBody = JSON.parse(bodyString);
//
//       req.body['oauth_token'] = parsedBody.oauth_token;
//       req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
//       req.body['user_id'] = parsedBody.user_id;
//
//       next();
//     },
//   );
// };
