import express from 'express';
import { check, validationResult } from 'express-validator/check';
import mongoose from 'mongoose';

export const loginForm = (req: express.Request, res: express.Response) => {
  res.locals.csrfToken = req.csrfToken();
  res.render('login', { title: 'Login' });
};

export const registerForm = (req: express.Request, res: express.Response) => {
  res.locals.csrfToken = req.csrfToken();
  res.render('register', { title: 'Register' });
};

let passwordLength = 5;
if (process.env.PASSWORD_LENGTH) {
  passwordLength = +process.env.PASSWORD_LENGTH;
}

export const validateRegister = [
  check('email', 'Email is incorrect')
    .isEmail()
    .withMessage('Must be a correct email')
    .trim()
    .normalizeEmail()
    .custom((email, { req }) => {
      const User = mongoose.model('User');
      return User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          throw new Error('This email is already in use');
        }
      });
    }),
  check('name', 'Name is incorrect')
    .exists()
    .trim()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage('A name must consist of alphabetical characters')
    .isString(),
  check(
    'password',
    `Password must be at least ${passwordLength} characters long and contain one number`,
  )
    .exists()
    .isLength({ min: passwordLength })
    .matches(new RegExp(`^(?=.*?[A-Za-z])(?=.*?[^a-zA-Z\s]).{${passwordLength},}$`))
    .trim(),
  check('passwordRepeat', 'Passwords do not match')
    .exists()
    .custom((passwordRepeat, { req }) => passwordRepeat === req.body.password),
];

export const register = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    const errors: any = validations.mapped();

    req.session!.form = { warnings: {}, values: {} };
    for (const error in errors) {
      if (errors.hasOwnProperty(error)) {
        req.flash('error', errors[error].msg);
        req.session!.form.warnings[errors[error].param] = errors[error].msg;
      }
    }

    req.session!.form.values['name'] = req.body.name;
    req.session!.form.values['email'] = req.body.email;

    return res.status(422).redirect('/register');
  }

  const User = mongoose.model('User');
  const user = new User({ email: req.body.email, name: req.body.name });

  User.register(user, req.body.password, () => {
    next();
  });
};
