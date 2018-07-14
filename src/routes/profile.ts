import { promisify } from "bluebird";
import express from "express";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
import mongoose from "mongoose";

import { assignValidationsToSession, logger } from "../utilities";

export const profilePage = (req: express.Request, res: express.Response) => {
  req.session!.form = { warnings: {}, values: {} };
  req.session!.form.values = { email: req.user!.email, name: req.user!.name };
  res.render("profile", { title: "Profile" });
};

let passwordLength = 5;
if (process.env.PASSWORD_LENGTH) {
  passwordLength = +process.env.PASSWORD_LENGTH;
}

export const validateUpdate = [
  check("name", "Name is incorrect")
    .exists()
    .trim()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage(
      "Please enter only unaccented alphabetical letters, A–Z or a–z"
    )
    .isString()
];

export const profileUpdate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const validations = validationResult(req);
  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);

    return res.redirect("/profile");
  }

  const User = mongoose.model("User");
  const { name } = matchedData(req, { locations: ["body"] });
  const user = await User.findByIdAndUpdate(req.user!.id, { name });

  req.flash("success", "Name successfully changed");

  res.redirect("/profile");
};

export const profileDelete = async (
  req: express.Request,
  res: express.Response
) => {
  const User = mongoose.model("User");
  await User.findByIdAndRemove(req.user!.id);
  const Poll = mongoose.model("Poll");
  await Poll.remove({ author: req.user!.id });

  req.flash("success", "Your account has been deleted!");

  res.redirect("/");
};

export const profileNewPasswordPage = (
  req: express.Request,
  res: express.Response
) => {
  res.render("passwordNew", { title: "New Password" });
};

export const validateNewPassword = [
  check("passwordOld", "Please enter your old password")
    .exists()
    .isLength({ min: passwordLength })
    .matches(
      new RegExp(`^(?=.*?[A-Za-z])(?=.*?[^a-zA-Z\s]).{${passwordLength},}$`)
    ),
  check(
    "passwordNew",
    `Password must be at least ${passwordLength} characters long and contain one number`
  )
    .exists()
    .isLength({ min: passwordLength })
    .matches(
      new RegExp(`^(?=.*?[A-Za-z])(?=.*?[^a-zA-Z\s]).{${passwordLength},}$`)
    ),
  check("passwordRepeat", "Please enter the password twice")
    .exists()
    .custom(
      (passwordRepeat, { req }) => passwordRepeat === req.body.passwordNew
    )
    .withMessage("Passwords do not match")
];

export const profileNewPasswordUpdate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);

    res.redirect("/profile/password");
    return;
  }

  const User = mongoose.model("User");
  const { name } = matchedData(req, { locations: ["body"] });
  const findByUsername = promisify(User.findByUsername, { context: User });
  const user = await findByUsername(req.user!.email, false);

  const { passwordOld, passwordNew } = matchedData(req);

  try {
    await user.changePassword(passwordOld, passwordNew);
    req.flash("success", "Password successfully changed!");
  } catch (error) {
    logger.error(error);
    req.flash("error", "Password change was invalid!");
    res.redirect("/profile/password");
    return;
  }

  res.redirect("/profile");
};
