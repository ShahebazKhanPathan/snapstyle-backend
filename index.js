// Load required modules
const express = require('express');
const cors = require('cors');

// Load configurations
require("dotenv");
require('./config/db')();

// Create an express application
const app = express();

// Enable necessary middleware functions
app.use(cors());
app.use(express.json());

// Create a server
app.listen(process.env.PORT, () => {
    console.log(`Node server listening on port: ${process.env.PORT}`);
});