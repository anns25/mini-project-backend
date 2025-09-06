import mongoose from "mongoose";
import Cart from "../models/Cart.js";


export const addToCart = async (req, res) => {
    const { bookId, quantity } = req.body;
    const userId = req.user._id;
    console.log("user", req.user);
    console.log("body", req.body);
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ bookId, quantity }] });
        }
        else {
            const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
            if (itemIndex > -1) {
                // Item exists - check if it was deleted
                if (cart.items[itemIndex].is_deleted === false) {
                    cart.items[itemIndex].quantity += quantity;
                } else {
                    // Restore deleted item
                    cart.items[itemIndex].is_deleted = false;
                    cart.items[itemIndex].quantity = quantity;
                }
            }
            else {
                // Item doesn't exist - add new item
                cart.items.push({ bookId, quantity });
            }
        }
        await cart.save();
        console.log("cart", cart);
        return res.status(200).json({ data: cart, message: "Item added to cart" });

    }
    catch (err) {
        return res.status(500).json({ error: err, message: "Failed to add to the cart" });
    }
};

// export const getCart = async ( req, res) =>{
//     const userId = req.user._id;
//     try{
//         const cart = await Cart.findOne({userId}).populate('items.bookId');
//         res.status(200).json({data : cart});
//     }
//     catch(err){
//         res.status(500).json({error : err, message : "Failed to fetch cart"});
//     }
// }

export const getCart = async (req, res) => {
    const userId = req.user._id;
    try {
        let cart = await Cart.findOne({ userId }).populate('items.bookId');
        // Check if cart exists
        if (!cart) {
            // Return empty cart structure if no cart exists
            return res.status(200).json({
                data: {
                    userId,
                    items: []
                }
            });
        }
        cart.items = cart.items.filter(item => item.is_deleted === false);
        res.status(200).json({ data: cart });
    }
    catch (err) {
        res.status(500).json({ error: err.message, message: "Failed to fetch cart" });
    }
}

// Update quantity of a specific item in cart
export const updateCartItem = async (req, res) => {
    const { bookId, quantity } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (itemIndex === -1 || cart.items[itemIndex].is_deleted === true) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({ data: cart, message: "Cart item updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err, message: "Failed to update cart item" });
    }
};

// Soft delete item
export const removeCartItem = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.bookId.toString() === bookId
        );

        if (itemIndex === -1 || cart.items[itemIndex].is_deleted === true) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items[itemIndex].is_deleted = true; // mark as deleted
        await cart.save();

        res.status(200).json({ data: cart, message: "Cart item soft deleted" });
    } catch (err) {
        res.status(500).json({ error: err, message: "Failed to soft delete cart item" });
    }
};

// Clear all items in cart (soft delete)
export const clearCart = async (req, res) => {
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Mark all items as deleted
        cart.items.forEach(item => {
            item.is_deleted = true;
        });

        await cart.save();
        res.status(200).json({ data: cart, message: "Cart cleared (soft delete)" });
    } catch (err) {
        res.status(500).json({ error: err.message, message: "Failed to clear cart" });
    }
};


