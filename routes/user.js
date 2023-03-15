const bcrypt = require('bcrypt');
const User = require('../models/user');
const { verifyTokenAndAdmin, verifyToken } = require('./verifyAuth');

const router = require('express').Router();

router.put("/:id", verifyToken, async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put("admin/:id", verifyTokenAndAdmin, async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPasswordAdmin = await bcrypt.hash(password, salt);
        res.body.password = hashedPasswordAdmin;
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router