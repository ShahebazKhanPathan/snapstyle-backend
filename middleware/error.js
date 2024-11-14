// Middleware function to handle errors
const errorHandler = (err, req, res, next) => {
    res.status(500).send(err.message);
}

// Export the error handler
module.exports = errorHandler;