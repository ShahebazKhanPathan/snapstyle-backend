// Load required modules
const express = require('express');
const cors = require('cors');

// Load configurations
require("dotenv");
require('./config/db')();

// Load route handler functions
const userRouter = require('./routes/user');
const authRouter  = require('./routes/auth');
const blacklistRouter  = require('./routes/blacklist');
const adminRouter  = require('./routes/admin');
const productRouter  = require('./routes/product');
const orderRouter  = require('./routes/order');
const cartRouter  = require('./routes/cart');

// Create an express application
const app = express();

// Enable necessary middleware functions
app.use(cors());
app.use(express.json());

// Enable routers
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/blacklist', blacklistRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);

// Create a server
app.listen(process.env.PORT, () => {
    console.log(`Node server listening on port: ${process.env.PORT}`);
});