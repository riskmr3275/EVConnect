const express = require("express");
const prisma = require("./config/database");
require("dotenv").config();
const app = express();
app.use(express.json());

// ✅ Get All EV Stations
app.get("/", async (req, res) => {
    console.log("Welcome to EV Stations API, your server is running successfully!");
   res.json({ message: "Welcome to EV Stations API, your server is running successfully!" ,
    
   });
});
 
app.listen(process.env.PORT || 4000, () => console.log("🚀 Server running on port 4000"));
