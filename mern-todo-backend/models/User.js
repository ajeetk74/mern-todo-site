import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

<<<<<<< HEAD
export default mongoose.model("User", UserSchema);
=======
export default mongoose.model("User", UserSchema);
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
