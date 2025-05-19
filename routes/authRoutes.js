import express from "express";
import { z } from "zod";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "mypersonaljsonwebtokensecretpleasedonottellanyone";
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const ReqSchema = z.object({
      email: z.string().email(),
      password: z.string().min(5),
    });

    const reqData = ReqSchema.safeParse(req.body);

    if (!reqData.success) {
      res.json(reqData.error);
    }

    const plainPassword = reqData.data.password;
    const userData = await User.findOne({ email: reqData.data.email });
    if (userData) {
      res.json({
        message: "this email is already register",
      });
      return;
    }

    bcrypt.hash(plainPassword, 9, async (err, hash) => {
      if (err) {
        res.status(404).json({
          message: "internal server eror",
        });
      }

      const hashPassword = hash;
      const email = reqData.data.email;

      await User.insertOne({
        email: email,
        password: hashPassword,
      });

      res.json({
        email: email,
        message: "signup successfully",
      });
    });
  } catch (e) {
    res.status(403).json({
      message: e.message,
    });
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const ReqSchema = z.object({
      email: z.string().email(),
      password: z.string().min(5),
    });

    const reqData = ReqSchema.safeParse(req.body);

    if (!reqData.success) {
      res.json(reqData.error);
      return;
    }

    const email = reqData.data.email;
    const password = reqData.data.password;
    const checkUser = await User.findOne({ email: email });

    if (!checkUser) {
      res.json({
        message: "please signup first, then signin",
      });
      return;
    }
    const hashPassword = checkUser.password;
    const isPasswordValid = await bcrypt.compare(password, hashPassword);

    if (isPasswordValid) {
      let token = jwt.sign({ email: checkUser.email }, SECRET);
      await User.updateOne({ email }, { $set: { token } });

      res.json({
        message: "success",
        token: token,
      });
      return;
    }
    res.status(401).json({
      message: "Invalid password",
    });
    return;
  } catch (e) {
    res.json({
      message: e.message,
    });
    return;
  }
});
export default authRouter;
