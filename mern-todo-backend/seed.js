require('dotenv').config();
const connectDB = require('./config/db');
const Todo = require('./models/Todo');

const seed = async () => {
  await connectDB();
  await Todo.deleteMany({});
  const items = [
    { title: 'Buy groceries', description: 'Milk, eggs, rice' },
    { title: 'Finish portfolio', description: 'Deploy site to GitHub Pages' },
    { title: 'Study MERN Stack', description: 'Learn Express & Mongoose' }
  ];
  await Todo.insertMany(items);
  console.log('Seeded todos');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });