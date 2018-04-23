import mongoose from 'mongoose';
import passport from 'passport';

export function setupPassport() {
  const user = mongoose.model('User');
  passport.use(user.createStrategy());

  passport.serializeUser(user.serializeUser());
  passport.deserializeUser(user.deserializeUser());
}
