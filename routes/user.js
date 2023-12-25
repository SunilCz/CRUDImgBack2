import express from "express";
import User from "../models/UserSchema.js";

const UserRouter = express.Router();

UserRouter.get("/", async (req, res) => {
  await User.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

export default UserRouter;
