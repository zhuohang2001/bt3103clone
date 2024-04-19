const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const cors = require('cors');

// Initialize the Stripe library with your secret key
const stripe = Stripe('sk_test_51P6wEnESKHXx7boldeaqhaZxdn0GAqzlMYKTlDuoVnFA33xTpfZi49w4CH1I0TNTwhLYCLDkheuwdcxB2OwpILA300POteG6pA'); // Use your Stripe secret key

const app = express();
app.use(cors()); // This will enable CORS for all routes and origins
app.use(bodyParser.json());

// Enable CORS for your frontend domain

// Create a new price for a product
app.post('/create-price', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Create a new product for the price
    const product = await stripe.products.create({ name: 'Dynamic Product' });

    // Create a new price with the given amount and currency for the created product
    const price = await stripe.prices.create({
      unit_amount: amount * 100, // Convert amount to cents
      currency: currency,
      product: product.id,
    });

    res.json({ priceId: price.id });
  } catch (error) {
    console.error('Error creating price:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
    try {
      const { priceId, offerId } = req.body;   // Assume a price ID is passed from the client
      console.log('Received priceId:', priceId);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,  // Use the dynamic price ID created previously
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&offerId=${offerId}`,  // Replace with your success URL
        cancel_url: 'https://example.com/cancel',    // Replace with your cancel URL
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/payout-seller', async (req, res) => {
    const { offerPrice, sellerStripeAccountId } = req.body;  // Replace with actual variable names
  
    try {
      const transfer = await stripe.transfers.create({
        amount: offerPrice * 100, // Convert to cents
        currency: 'sgd',
        destination: sellerStripeAccountId,
        // Optionally add: transfer_group, description, and other metadata
      });
  
      res.json({ success: true, transferId: transfer.id });
    } catch (error) {
      console.error('Error creating transfer:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/create-stripe-account', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const account = await stripe.accounts.create({
            type: 'custom',
            country: 'SG',  // Specify the country code
            email: email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            // Additional settings can be added here as needed, such as business type or tos acceptance
        });

        return res.json({ accountId: account.id });
    } catch (error) {
        console.error('Error creating Stripe account:', error);
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
