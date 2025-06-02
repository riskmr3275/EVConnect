const express = require("express");
const dotenv = require("dotenv");
const prisma = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true,
}))
// 👋 Health check rou  te
app.get("/", (req, res) => {
  console.log("Welcome to EV Stations API, your server is running successfully!");
  res.json({ message: "Welcome to EV Stations API, your server is running successfully!" });
});


//Routes
const authRoutes = require("./routes/authRoutes");
const stationRoutes=require("./routes/stationRoutes");
const stationMastersRoutes=require("./routes/stationMastersRoutes");
const evRoutes=require("./routes/evRoutes");
const chargingSlotsRoutes=require("./routes/chargingSlotsRoutes");  
const bookingRoutes=require("./routes/bookingRoutes");
// const transactionRoutes=require("./routes/transactionRoutes");
// const chargingHistoryRoutes=require("./routes/chargingHistoryRoutes");


// ✅ Mount user routes
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/stationmasters", stationMastersRoutes);
app.use("/api/evs", evRoutes);
app.use("/api/chargingSlots",chargingSlotsRoutes);
app.use("/api/booking",bookingRoutes);
// app.use("/api/transactions",transactionRoutes);
// app.use("/api/chargingHistory",chargingHistoryRoutes);

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
