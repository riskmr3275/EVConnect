const express = require("express");
const dotenv = require("dotenv");
const prisma = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all origins in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, you can specify allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://evconnect-frontend.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // For now, allow all origins (you can restrict this in production)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-station', (stationId) => {
    socket.join(`station-${stationId}`);
    console.log(`User ${socket.id} joined station ${stationId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// 👋 Health check route
app.get("/", (req, res) => {
  console.log("Welcome to EV Stations API, your server is running successfully!");
  res.json({
    message: "Welcome to EV Stations API, your server is running successfully!",
    version: "2.0.0",
    features: [
      "User Authentication",
      "EV Management",
      "Station Management",
      "Booking System",
      "Payment Gateway",
      "Charging History",
      "Reviews & Ratings",
      "Notifications",
      "Real-time Updates"
    ]
  });
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const stationRoutes = require("./routes/stationRoutes");
const stationMastersRoutes = require("./routes/stationMastersRoutes");
const evRoutes = require("./routes/evRoutes");
const chargingSlotsRoutes = require("./routes/chargingSlotsRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const chargingHistoryRoutes = require("./routes/chargingHistoryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const healthRoutes = require("./routes/healthRoutes");
const geocodingRoutes = require("./routes/geocodingRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/stationmasters", stationMastersRoutes);
app.use("/api/evs", evRoutes);
app.use("/api/chargingSlots", chargingSlotsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/charging-history", chargingHistoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/geocoding", geocodingRoutes);
app.use("/api/qr-codes", qrCodeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// 🚀 Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Socket.io enabled for real-time features`);
  console.log(`💳 Payment gateway integrated`);
  console.log(`🔔 Notification system active`);
});
