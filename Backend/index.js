const express = require("express");
const dotenv = require("dotenv");
const prisma = require("./config/database");
const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// 👋 Health check route
app.get("/", (req, res) => {
  console.log("Welcome to EV Stations API, your server is running successfully!");
  res.json({ message: "Welcome to EV Stations API, your server is running successfully!" });
});


//Routes
const authRoutes = require("./routes/authRoutes");
const stationRoutes=require("./routes/stationRoutes");
const stationMastersRoutes=require("./routes/stationMastersRoutes");
const evRoutes=require("./routes/evRoutes");

// ✅ Mount user routes
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/stationmasters", stationMastersRoutes);
app.use("/api/evs", evRoutes);



// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
