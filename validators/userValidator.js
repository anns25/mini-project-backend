// validators/userValidator.js
import { check } from "express-validator";

// Signup validation rules
export const validateSignup = [
  check("username")
    .notEmpty().withMessage("Username is required")
    .isString().withMessage("Username must be a string")
    .trim(),

  check("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),

  check("role")
    .optional()
    .isIn(['seller', 'buyer']).withMessage("Role must be either 'seller' or 'buyer'"),

  check("email")
    .notEmpty().withMessage("Email is required")
    .trim(),
];

// Login validation rules
export const validateLogin = [
  check("username")
    .notEmpty().withMessage("Username is required")
    .isString().withMessage("Username must be a string")
    .trim(),

  check("password")
    .notEmpty().withMessage("Password is required")
];
