import express from "express";
import passport from "passport";
import { catchAsyncErrors } from "../utilities";
import { isLoggedIn, login, logout, twitter } from "./auth";
import { homePage, privacyPage, termsPage } from "./home";
import {
  isPollOwner,
  pollAdd,
  pollAllPage,
  pollDelete,
  pollEditPage,
  pollNewPage,
  pollOnePage,
  pollUpdate,
  pollUserPage,
  pollVote,
  validatePoll,
  validateVote
} from "./poll";
import {
  profileDelete,
  profileNewPasswordPage,
  profileNewPasswordUpdate,
  profilePage,
  profileUpdate,
  validateNewPassword,
  validateUpdate
} from "./profile";
import {
  loginFormPage,
  passwordRequest,
  passwordRequestPage,
  passwordReset,
  passwordResetPage,
  register,
  registerFormPage,
  validateRegister,
  validateRequest,
  validateReset
} from "./user";

export const router = express.Router();
export const callback = express.Router();

router.get("/", catchAsyncErrors(homePage));

router.get("/terms", termsPage);
router.get("/privacy", privacyPage);

router.get("/login", loginFormPage);
router.post("/login", login);

router.get("/register", registerFormPage);
router.post("/register", validateRegister, register, login);

router.post("/logout", isLoggedIn, logout);

router.get("/profile", isLoggedIn, profilePage);
router.patch(
  "/profile",
  isLoggedIn,
  validateUpdate,
  catchAsyncErrors(profileUpdate)
);
router.delete("/profile", isLoggedIn, catchAsyncErrors(profileDelete));

router.get("/profile/password", isLoggedIn, profileNewPasswordPage);
router.patch(
  "/profile/password",
  isLoggedIn,
  validateNewPassword,
  catchAsyncErrors(profileNewPasswordUpdate)
);

router.get("/password/request", passwordRequestPage);
router.post(
  "/password/request",
  validateRequest,
  catchAsyncErrors(passwordRequest)
);

router.get("/password/reset/:token", passwordResetPage);
router.post("/password/reset", validateReset, catchAsyncErrors(passwordReset));

router.get("/poll", catchAsyncErrors(pollAllPage));
router.post("/poll", isLoggedIn, validatePoll, catchAsyncErrors(pollAdd));

router.get("/poll/new", isLoggedIn, pollNewPage);
router.get("/poll/user/:id", catchAsyncErrors(pollUserPage));
router.get(
  "/poll/edit/:id",
  isLoggedIn,
  isPollOwner,
  catchAsyncErrors(pollEditPage)
);

router.get("/poll/:id", catchAsyncErrors(pollOnePage));
router.patch("/poll/:id", isLoggedIn, validateVote, catchAsyncErrors(pollVote));
router.put(
  "/poll/:id",
  isLoggedIn,
  validatePoll,
  isPollOwner,
  catchAsyncErrors(pollUpdate)
);
router.delete(
  "/poll/:id",
  isLoggedIn,
  isPollOwner,
  catchAsyncErrors(pollDelete)
);

router.get("/auth/twitter/", passport.authenticate("twitter"));

callback.get("/auth/twitter/return/", twitter);

// sanity check route
router.get("/test", (req, res) => {
  res.json({
    message: "Hello World!"
  });
});

// 404 on fallthrough
router.get(
  "*",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err = new Error(req.headers.host + req.url + " Not Found");
    (<any>err).status = 404;
    next(err);
  }
);
