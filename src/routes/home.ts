import express from "express";
import mongoose from "mongoose";

export const homePage = async (req: express.Request, res: express.Response) => {
  const Poll = mongoose.model("Poll");

  const latestPolls = Poll.find()
    .sort("-created")
    .limit(5);

  const popularPolls = Poll.find()
    .sort("votes")
    .limit(5);

  res.render("home", {
    popularPolls: await popularPolls,
    latestPolls: await latestPolls,
    title: "Home"
  });
};

export const termsPage = (req: express.Request, res: express.Response) => {
  res.render("terms", {
    title: "Terms of Service"
  });
};

export const privacyPage = (req: express.Request, res: express.Response) => {
  res.render("privacy", {
    title: "Privacy Policy"
  });
};
