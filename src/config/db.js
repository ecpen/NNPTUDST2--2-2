const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Nếu không kết nối được MongoDB local, dùng memory server
    if (!uri || uri.includes("localhost") || uri.includes("127.0.0.1")) {
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        console.log("Using MongoDB Memory Server");
      } catch {
        // Nếu không có memory server, dùng URI gốc
      }
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected:", uri);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
