const express = require("express");
const dotenv = require("dotenv");
const prisma = require("./config/database");

//Routes
const userRoutes = require("./routes/User");

dotenv.config();

const app = express();
app.use(express.json());

// 👋 Health check route
app.get("/", (req, res) => {
  console.log("Welcome to EV Stations API, your server is running successfully!");
  res.json({ message: "Welcome to EV Stations API, your server is running successfully!" });
});


// ✅ Mount user routes
app.use("/api/users", userRoutes);




// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
