const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("authorization")?.replace("Bearer ", "");

    // const token= req.user.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("Decoded Token:", decoded);
        // Attach the decoded user information to the request object
        req.user = decoded;
      } catch (error) {
        
        console.error("Token verification error:", error);
        
        return res.status(401).json({ success: false, message: "Token is invalid" });
      }
      
      // If token is valid, proceed to the next middleware or route handler
      next();


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.isUser = (req, res, next) => {}

exports.isAdmin = (req, res, next) => {}

exports.isStationMaster = (req, res, next) => {}

exports.isOwner = (req, res, next) => {}