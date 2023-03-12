const Cart = require('../models/Cart');

const router = require('express').Router();


router.post('/cart', async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = new Cart({ user: userId });
        const savedCart = await cart.save();
        res.status(201).send(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creating cart' });
    }
});

module.exports = router