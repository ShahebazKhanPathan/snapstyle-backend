// Load required modules
const jwt = require('jsonwebtoken');

// Load cart model
const Cart = require('../models/cart');
const mongoose = require('mongoose');

// Controller function to add new item into cart
const addToCart = async (req, res, next) => {
    const token = req.header("auth-token");
    const { pId, name, price, photo } = req.body;

    try {
        const decodedToken = jwt.verify(token, process.env.SNAPSTYLE_PRIVATE_KEY);
        
        var user = await Cart.findOne({ uId: decodedToken.id });
        if (user) {
            const update = await Cart.findOneAndUpdate({ uId: decodedToken.id }, { $push: { items: { pId, name, price, photo }}});
            return res.send(update);
        }
            
        const cart = new Cart({
            uId: decodedToken.id,
            items: [{ pId, name, price, photo }]
        });

        const result = await cart.save();
        res.send(result);
    }
    catch (err) {
        next(err);
    }
};

// Controller function to fetch cart items by user id
const getCartItems = async (req, res, next) => {
    const token = req.header("auth-token");
    try {
        const decodedToken = jwt.verify(token, process.env.SNAPSTYLE_PRIVATE_KEY);
        const result = await Cart.aggregate(
            [
                {
                    $match: {
                        uId: new mongoose.Types.ObjectId(decodedToken.id)
                    }
                },
                {
                    $addFields: {
                        totalPrice: {
                            $sum: { $sum: "$items.price"}
                        }
                    }
                },
                {
                    $addFields: {
                        taxes: {
                            $multiply: [{ $divide: [ "$totalPrice", 100 ]}, 5]
                        }
                    }
                },
                {
                    $addFields: {
                        totalAmount: {
                            $sum: [ "$totalPrice", "$taxes" ]
                        }
                    }
                }
            ]
        );
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

// Controller function to delete a cart item
const removeCartItem = async (req, res, next) => {
    const id = req.params.id;
    const token = req.header("auth-token");

    const decodedToken = jwt.verify(token, process.env.SNAPSTYLE_PRIVATE_KEY);
    
    try {
        const user = await Cart.findOne({ uId: decodedToken.id });

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "Requested user not found."
            });
        }

        const updateItems = await Cart.updateOne({ uId: decodedToken.id }, { $pull: { items: { _id: id } } });

        if (!updateItems) {
            return res.status(404).send({
                statusCode: 404,
                message: "Requested item not found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            message: "Item removed successfully",
        });
    }
    catch (err) {
        next(err);
    }
}

module.exports = { addToCart, getCartItems, removeCartItem };