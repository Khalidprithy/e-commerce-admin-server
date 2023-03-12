const Order = require('../models/Order');

const router = require('express').Router();

// POST /orders - create a new order
router.post('/orders', async (req, res) => {
    try {
        const { userId, products, amount, address } = req.body;
        const order = new Order({ userId, products, amount, address });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating order' });
    }
});

module.exports = router