const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        address: {
            type: {
                street: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                country: { type: String, required: true },
                zipCode: { type: String, required: true }
            },
            required: true
        },
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
        }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
