import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; 
    if (!userRole) {
      return res.status(403).json({ error: "User role not found" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }

    next(); 
  };
};
