const bcrypt = require('bcrypt');
const User = require('../models/User');
const { verifyTokenAndAdmin, verifyToken } = require('./verifyAuth');

const router = require('express').Router();


// Update user profile
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

// Update Admin profile
router.put("/admin/:id", verifyTokenAndAdmin, async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPasswordAdmin = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPasswordAdmin;
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete User
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});


// Get user

router.get("/find/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, ...userInfo } = user._doc;
        res.status(200).json(userInfo);
    } catch (error) {
        res.status(500).json(error);
    }
});


// Find all users

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    const query = req.query.new;

    try {
        const users = query ? await User.find().limit(3).sort({ _id: -1 }) : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});


// Get user stats

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.getFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router