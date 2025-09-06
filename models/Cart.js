// models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Each user has only one cart
    },
    items: [cartItemSchema],
},
    { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
