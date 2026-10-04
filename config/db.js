const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add your Atlas connection string to backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected Successfully");
};

module.exports = connectDB;
