import { Router } from "express";
import { addBook, deleteBook, getAllBooks, getBookById, updateBook } from "../../controller/book.js";
import { authCheck } from "../../middlewares/auth.js";
import { bookValidationRules, updateBookValidationRules } from "../../validators/bookValidator.js";
import { validate } from "../../middlewares/validate.js";
import { check } from "express-validator";
import upload from "../../middlewares/upload.js";

const book = Router();

book.post('/add', authCheck,upload.single('image'), bookValidationRules, validate, addBook);
book.get('/all', getAllBooks);
book.get('/view/:id', getBookById);
book.patch('/update', authCheck, upload.single('image'), updateBookValidationRules, validate, updateBook);
book.delete('/delete', authCheck, [
    check('id').notEmpty().
    withMessage("Object id is required"),
], deleteBook);


export default book;