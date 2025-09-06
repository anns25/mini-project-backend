import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../services/emailService.js";

export const registerUser = async (req, res) => {
    try {
        const SECRET_KEY = process.env.SECRET_KEY;
        const { username, password, role, email } = req.body;

        // Check if file was uploaded
        if(!req.file){
            return res.status(400).json({message : "User image is required."});
        }

        // Get the file path from multer
        const user_img = req.file.filename;  // this will be the filename stored in the uploads folder
        
        const user = await User.findOne({ username : username});
        if (!user) {
            const newUser = new User({ username, password, user_img, role, email});
            await newUser.save();

            //sendWelcome email (don't wait for it to complete)
            sendWelcomeEmail(email, username)
            .then(result =>{
                if(result.success){
                    console.log("Welcome email sent to: ", email);
                }else {
                    console.log("Failed to send welcome email to: ", email, result.error);
                }
            })
            .catch(err=> {
                console.error("Error in welcome email process : ", err);
            });
            
            const token = jwt.sign({ _id: newUser._id, username: newUser.username, role: newUser.role, user_img: newUser.user_img, email : newUser.email }, SECRET_KEY, { expiresIn: '1d' });
            res.status(201).json({
                data : token,
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    role: newUser.role,
                    user_img: newUser.user_img,
                    email: newUser.email
                }, message: "New User created"
            });
        }
        else {
            res.status(409).json({ message: "User already exists" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

}

export const loginUser = async (req, res) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: "Invalid Credentials" });
        }
        else {
            // generate token for this user
            const token = jwt.sign({ _id: user._id, username: user.username, role: user.role, user_img: user.user_img, email: user.email }, SECRET_KEY, { expiresIn: '1d' });
            res.status(200).json({
                data: token, user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    user_img: user.user_img,
                    email: user.email
                }, message: "Login Successful"
            });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}