const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract Token
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find User
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User Not Found",
        });
      }

      next();
    } else {
      return res.status(401).json({
        message: "Not Authorized, No Token",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = protect;
