import * as express from 'express';
import { Result } from 'express-validator/check';

export const assignValidationsToSession = (
  req: express.Request,
  validations: Result<{}>,
) => {
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
};
