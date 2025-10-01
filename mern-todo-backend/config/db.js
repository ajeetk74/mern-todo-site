// db.js
require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI="mongodb+srv://ajeetk_db_user:%40%23Ajeet7488@cluster0.yivkajn.mongodb.net/mern-todo?retryWrites=true&w=majority");
    
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
