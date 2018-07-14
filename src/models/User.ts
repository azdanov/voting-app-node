import md5 from "md5";
import mongoose, { Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import validator from "validator";
import crypto from "crypto";
import { hashids, logger } from "../utilities";

const mongooseBeautifulUniqueValidation = require("mongoose-beautiful-unique-validation");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: "Two users cannot share the same email ({VALUE})",
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    required: "Please provide your email address"
  },
  name: {
    type: String,
    required: "Please provide your name",
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpiration: Date,
  twitterProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
});

userSchema.virtual("avatar").get(function() {
  const hash = md5(this.email);
  return `https://robohash.org/${hash}?set=set4&size=144x144&gravatar=hashed&bgset=bg1`;
});

userSchema.virtual("hashid").get(function() {
  return hashids.encodeHex(this._id);
});

userSchema.statics.authTwitterUser = function(
  accessToken,
  refreshToken,
  profile,
  done
) {
  return this.findOne(
    {
      "twitterProvider.id": profile.id
    },
    (err, user) => {
      if (user) {
        return done(err, user);
      }

      const newUser = new this({
        email: profile.emails[0].value,
        name: profile.displayName,
        twitterProvider: {
          accessToken,
          refreshToken,
          id: profile.id
        }
      });

      this.register(
        newUser,
        crypto.randomBytes(16).toString("hex"),
        (error, savedUser) => {
          if (error) {
            logger.error(error);
          }

          return done(error, savedUser);
        }
      );
    }
  );
};

userSchema.plugin(mongooseBeautifulUniqueValidation);
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export function createUser() {
  return mongoose.model("User", userSchema);
}
