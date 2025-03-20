// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const transactionSchema = new mongoose.Schema({
    type: String, // 'deposit' or 'withdraw'
    amount: Number,
    cardNumber: String,
    expiringDate: String,
    cvv: String,
    cardholdername: String,
    billingAddress: String,
    state: String,
    city: String,
    zipCode: String,
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.post('/api/deposit', async (req, res) => {
    try {
        const transactionData = {
            type: 'deposit',
            amount: req.body.amount,
            cardNumber: req.body.cardNumber,
            expiringDate: req.body.expiringDate,
            cvv: req.body.cvv,
            cardholdername: req.body.cardholdername,
            billingAddress: req.body.billingAddress,
            state: req.body.state,
            city: req.body.city,
            zipCode: req.body.zipCode
        };

        const transaction = new Transaction(transactionData);
        await transaction.save();
        res.status(201).json({ message: 'Deposit recorded successfully' });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ error: 'Failed to process deposit' });
    }
});

app.post('/api/withdraw', async (req, res) => {
    try {
        const transactionData = {
            type: 'withdraw',
            amount: req.body.amount,
            cardNumber: req.body.cardNumber,
            expiringDate: req.body.expiringDate,
            cvv: req.body.cvv,
            cardholdername: req.body.cardholdername,
            billingAddress: req.body.billingAddress,
            state: req.body.state,
            city: req.body.city,
            zipCode: req.body.zipCode
        };

        const transaction = new Transaction(transactionData);
        await transaction.save();
        res.status(201).json({ message: 'Withdrawal recorded successfully' });
    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ error: 'Failed to process withdrawal' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
