const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const { compareHash } = require("../helpers/password.helper");
//Model
const User = require("../models/User");

//TODO - REFACTOR & CHECK USER MODEL SETTINGS

const isPasswordUserMatch = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const match = await compareHash(req.body.password, user.password);
    if (match) {
      req.body = {
        userId: user.id,
        // email: user.email,
        // username: user.username,
        // name: user.name,
        // lastname: user.lastname,
      };
      return next();
    }
    throw new AppError("Incorrect Password", 400);
  } catch (error) {
    next(error);
  }
};

const authGuard = (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      jwt.verify(bearerToken, process.env.JWT_SECRET, (error, data) => {
        if (!error) {
          req.userId = data.userId;
          return next();
        }
        next(error);
      });
    } else {
      throw new AppError("Unauthenticated | No token provided", 401);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isPasswordUserMatch,
  authGuard,
};
