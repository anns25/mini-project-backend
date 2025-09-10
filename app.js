import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connect from "./mongodb/connect.js";
import book from "./Routes/Book/book.js";
import user from "./Routes/User/user.js";
import cors from "cors";
import cart from "./Routes/Cart/cart.js";
import { fileURLToPath } from 'url';
import path from 'path'
import monthlyReminderService from "./services/monthlyReminderService.js";
import test from "./Routes/test.js";
import stripeRoutes from "./Routes/stripe.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connect();
const app = express();
const port = process.env.PORT;

monthlyReminderService.start();


app.use(cors({
    origin: [
        "http://localhost:3001",  // local dev
        "https://next-book-frontend.onrender.com" // deployed frontend
    ],
    credentials: true
}));


app.use(express.json());

//Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/book', book);
app.use('/user', user);
app.use('/cart', cart);
app.use('/test', test);
app.use("/api/stripe", stripeRoutes);


app.listen(port, (req, res) => {
    console.log("Server running on port", port);
});

//Graceful shutdown - stop cron service when the app shuts down
process.on('SIGINT', () => {
    console.log("Shutting down gracefully...");
    monthlyReminderService.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Shutting down gracefully....');
    monthlyReminderService.stop();
    process.exit(0);
});