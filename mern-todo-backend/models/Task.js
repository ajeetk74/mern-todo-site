import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
<<<<<<< HEAD
export default mongoose.model('Task', taskSchema);
=======
export default mongoose.model('Task', taskSchema);
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
