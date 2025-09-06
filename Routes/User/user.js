import { Router } from "express";
import { loginUser, registerUser } from "../../controller/user.js";
import { validateLogin, validateSignup } from "../../validators/userValidator.js";
import { validate } from "../../middlewares/validate.js";
import upload from "../../middlewares/upload.js";



const user = Router();

user.post("/register", upload.single('user_img'), validateSignup, validate, registerUser);
user.post("/login", validateLogin, validate, loginUser);

export default user