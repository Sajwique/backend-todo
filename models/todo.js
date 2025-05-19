import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: String,
  desc: String,
  isDone: Boolean,
});

const Todo = mongoose.model("todo", todoSchema);
export default Todo;
