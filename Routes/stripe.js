// routes/stripe.js
import express from "express";
import Stripe from "stripe";

const stripeRoutes = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/create-checkout-session
stripeRoutes.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems } = req.body;

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [`http://localhost:3000/uploads/${item.image}`], // optional
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:3001/success", // frontend success page
      cancel_url: "http://localhost:3001/cancel",   // frontend cancel page
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default stripeRoutes;
