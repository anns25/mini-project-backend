import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    user_img: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['seller', 'buyer'],
        default: 'default'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    }
},
    {
        timestamps: true
    });

// Hash password before saving

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);
export default User;