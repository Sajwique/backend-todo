import expres from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import { checkToken } from "./middleware/checkToken.js";

const app = expres();

app.use(expres.json());

app.use("/auth", authRouter);
app.use(checkToken);
app.use("/", todoRoutes);

app.post("/test", (req, res) => {
  res.json({
    message: "this is working fine",
  });
});
app.listen(3001, (req, res) => {
  try {
    mongoose.connect(
      "mongodb+srv://sajwique:pankajsinghsajwan@cluster0.zhownby.mongodb.net/"
    );
    console.log("Db connected");
  } catch (e) {
    res.json({
      message: "err while connecting the db",
    });
  }
});
