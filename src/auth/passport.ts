import mongoose from "mongoose";
import passport from "passport";
import { Strategy as TwitterTokenStrategy } from "passport-twitter";

export function setupPassport() {
  const User = mongoose.model("User");

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  passport.use(User.createStrategy());

  passport.use(
    new TwitterTokenStrategy(
      {
        consumerKey: process.env.TWITTER_KEY || "",
        consumerSecret: process.env.TWITTER_SECRET || "",
        passReqToCallback: true,
        includeEmail: true,
        callbackURL:
          process.env.NODE_ENV === "test"
            ? process.env.TWITTER_CALLBACK_TEST || ""
            : process.env.TWITTER_CALLBACK || ""
      },
      (req, accessToken, refreshToken, profile, done) => {
        // @ts-ignore
        User.authTwitterUser(accessToken, refreshToken, profile, (err, user) =>
          done(err, user)
        );
      }
    )
  );
}
