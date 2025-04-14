const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    console.log("Hello i m from auth middleware");
    const token = req.cookies.token || req.body.token || req.header("authorization")?.replace("Bearer ", "");
    console.log("Token in auth::", token);
    
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

exports.isUser = (req, res, next) => {
  try{
    if(req.user.accountType !== "USER"){
      return res.status(401).json({ success: false, message: "User is not USER" });
    }
    next();
  }
  catch(error){
    return res.status(401).json({ success: false, message: "User is not USER" });
  }
}

exports.isAdmin = (req, res, next) => {
  try{
    if(req.user.accountType !== "ADMIN"){
      return res.status(401).json({ success: false, message: "User is not ADMIN" });
    }
    next();
  }
  catch(error){
    return res.status(401).json({ success: false, message: "User is not ADMIN" });
  }
}

exports.isStationMaster = (req, res, next) => {
  try{
    if(req.user.accountType !== "STATIONMASTER"){
      return res.status(401).json({ success: false, message: "User is not STATIONMASTER" });
    }
    next();
  }
  catch(error){
    return res.status(401).json({ success: false, message: "User is not STATIONMASTER" });
  }
}

exports.isOwner = (req, res, next) => {
  // console.log("User ID middleeware:", req.user);
  try{
    if(req.user.accountType !== "OWNER"){
      return res.status(401).json({ success: false, message: "User is not owner" });
    }
    next();
  }
  catch(error){
    return res.status(401).json({ success: false, message: "User is not owner" });
  }
}