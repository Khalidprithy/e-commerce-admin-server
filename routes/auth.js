const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


// Sign Up

router.post('/signup', async (req, res) => {
    try {
        const { phone, password, isAdmin } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).send({ message: 'Phone already in use' });
        }

        // Generate random salt value
        const salt = await bcrypt.genSalt(10);

        // Hash password before storing in database
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user document
        const newUser = new User({

            phone,
            isAdmin,
            password: hashedPassword
        });

        // Save new user to database
        await newUser.save();

        // Create JWT token with phone and admin status
        const token = jwt.sign(
            { phone: newUser.phone, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return token in response
        return res.status(201).send({ message: 'Registration successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Registration failed, Try again' });
    }
});


// Login

router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).send({ message: 'Invalid phone or password' });
        }

        // Check if password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: 'Invalid phone or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, phone: user.phone, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back user info without password
        const userInfo = { ...user.toObject() };
        delete userInfo.password;

        return res.status(200).send({ token, ...userInfo });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error logging in' });
    }
});

module.exports = router;


