const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/productRoutes");

const app = express();

// Middleware parse JSON body
app.use(express.json());

// Đảm bảo response trả về UTF-8
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Routes
app.use("/api/products", productRoutes);

// Kết nối DB và khởi động server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
