import { Router } from "express";
import Todo from "../models/todo.js";
import User from "../models/users.js";
import { z } from "zod";

const todoRoutes = Router();

todoRoutes.get("/all-todo", async (req, res) => {
  try {
    const email = req.email;
    const userInfo = await User.find({ email });
    console.log("email", email);
    const user_id = userInfo[0]._id;
    console.log("user_id", user_id);

    const todos = await Todo.find({ user_id });
    if (todos) {
      res.json({
        email: email,
        data: todos,
      });
      return;
    }
    res.json({
      email: email,
      data: "no data",
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({
      message: e.message,
    });
  }
});

todoRoutes.post("/add-todo", async (req, res) => {
  try {
    const email = req.email;
    const userInfo = await User.find({ email });

    const user_id = userInfo[0]._id;

    const reqSchema = z.object({
      title: z.string(),
      desc: z.string(),
      isDone: z.boolean(),
    });

    const reqData = reqSchema.safeParse(req.body);
    if (!reqData.success) {
      res.json(reqData.error);
    }

    console.log("user_id :", user_id);
    await Todo.insertMany([{ ...reqData.data, user_id: user_id }]);
    res.json({
      message: "toda created successfully",
    });
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
});

todoRoutes.patch("/:id/update-todo", async (req, res) => {
  try {
    const reqSchema = z.object({
      title: z.string().optional(),
      desc: z.string().optional(),
      isDone: z.boolean().optional(),
    });
    const reqData = reqSchema.safeParse(req.body);

    if (!reqData.success) {
      res.json(reqData.error);
      return;
    }
    const updateId = req.params.id;
    if (!updateId) {
      res.json({
        message: "please provide the id in params",
      });
    }

    const updateDocument = await Todo.findOneAndUpdate(
      { _id: updateId },
      {
        $set: {
          title: reqData.data.title,
          desc: reqData.data.desc,
          isDone: reqData.data.isDone,
        },
      },
      {
        upsert: true,
        returnNewDocument: true,
      }
    );
    res.json({
      message: "update successfully",
      data: updateDocument,
    });
  } catch (e) {
    res.json({ message: e.message });
  }
});

todoRoutes.delete("/:id/delete-todo", async (req, res) => {
  try {
    const deletedId = req.params.id;
    await Todo.deleteOne({ _id: deletedId });
    res.json({
      message: "delete successfully",
    });
  } catch (e) {
    res.json({
      message: e.message,
    });
  }
});
export default todoRoutes;
