import { check } from "express-validator";

export const bookValidationRules = [
  // check("book_id")
  //   .notEmpty().withMessage("Book ID is required")
  //   .isString().withMessage("Book ID must be a string"),

  check("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .trim(),

  check("author")
    .notEmpty().withMessage("Author is required")
    .isString().withMessage("Author must be a string")
    .isLength({ min: 3 }).withMessage("Author must have at least 3 characters")
    .trim(),

  check("genre")
    .notEmpty().withMessage("Genre is required")
    .isString().withMessage("Genre must be a string"),

  check("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0"),

  check("rating")
    .notEmpty().withMessage("Rating is required")
    .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),

  check("summary")
    .notEmpty().withMessage("Summary is required")
    .isString().withMessage("Summary must be a string")
    .isLength({ min: 10 }).withMessage("Summary must have at least 10 characters")
    .trim()
];

export const updateBookValidationRules = [
  check("book_id")
    .notEmpty().withMessage("Book ID is required")
    .isString().withMessage("Book ID must be a string")
    .optional(),

  check("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .trim()
    .optional(),

  check("author")
    .notEmpty().withMessage("Author is required")
    .isString().withMessage("Author must be a string")
    .isLength({ min: 3 }).withMessage("Author must have at least 3 characters")
    .trim()
    .optional(),

  check("genre")
    .notEmpty().withMessage("Genre is required")
    .isString().withMessage("Genre must be a string")
    .optional(),

  check("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0")
    .optional(),

  check("rating")
    .notEmpty().withMessage("Rating is required")
    .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5")
    .optional(),

  check("summary")
    .notEmpty().withMessage("Summary is required")
    .isString().withMessage("Summary must be a string")
    .isLength({ min: 10 }).withMessage("Summary must have at least 10 characters")
    .trim()
    .optional(),
];
