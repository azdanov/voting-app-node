import passport from 'passport';
import mongoose from 'mongoose';

export function setupPassport() {
  const user = mongoose.model('User');
  passport.use(user.createStrategy());

  passport.serializeUser(user.serializeUser());
  passport.deserializeUser(user.deserializeUser());
}
