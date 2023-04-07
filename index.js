const express = require('express')
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

mongoose
    .connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ntdksjz.mongodb.net/e-commerce-admin?retryWrites=true&w=majority`)
    .then(() => console.log('Kindo Database connected'))
    .catch((err) => {
        console.log(err, 'Failed to connect database')
    });

app.use(express.json());

app.use(cors());
app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.get('/', (req, res) => {
    res.send('Backend server Kinbo')
})

app.listen(port, () => {
    console.log(`Kinbo app listening on port ${port}`)
})
