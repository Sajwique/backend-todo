import { z } from "zod";
import jwt from "jsonwebtoken";

const SECRET = "mypersonaljsonwebtokensecretpleasedonottellanyone";

export const checkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.json({
        message: "please provide token",
      });
      return;
    }

    let decoded = jwt.verify(token, SECRET);
    req.email = decoded.email;
    next();
  } catch (e) {
    res.status(403).json({ error: e.message });
  }
};
