import { Router } from "express";
import { authCheck } from "../../middlewares/auth.js";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../../controller/cart.js";

const cart = Router();

cart.post('/add', authCheck, addToCart);
cart.get('/all', authCheck, getCart);
cart.patch('/update', authCheck, updateCartItem);
cart.delete('/delete', authCheck, removeCartItem);
cart.delete('/clear', authCheck, clearCart);

export default cart;
