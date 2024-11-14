// Load required modules
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Load product model
const Product = require("../models/product");

// Controller function to fetch all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product
            .find()
            .select("title category price _id photo.name");
        res.send(products);
    }
    catch (err) {
        next(err);
    }
}

// Controller function to fetch product details by product ID
const getProductByID = async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await Product.findOne({ _id: id });
        res.send(product);
    }
    catch (err) {
        next(err);
    }
}

// Controller function to fetch products by category
const getProductByCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await Product.find({ category: id });
        res.send(product);
    }
    catch (err) {
        next(err);
    }
}

// Controller function to fetch products by search query
const getProductBySearch = async (req, res, next) => {
    const query = req.params.query;
    try {
        const result = await Product.find({ title: { $regex: query, $options: 'i' } });
        res.send(result);
    }
    catch (err) {
        next(err);
    }
}

// Controller function to add new product
const createNewProduct = async (req, res, next) => {

    const { title, category, description, price, photo } = req.body;

    const product = new Product({
        title: title,
        category: category,
        price: price,
        description: description,
        photo: {
            name: photo[0].name,
            size: photo[0].size,
            type: photo[0].type
        }
    });

    const s3Client = new S3Client({
        region: "us-west-1",
        credentials: {
            accessKeyId: process.env.S3_ACCESS_ID,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    });

    async function putObjectURL(filename, contentType) {
        const command = new PutObjectCommand({
            Bucket: "snapstyle",
            Key: filename,
            ContentType: contentType
        });

        const url = await getSignedUrl(s3Client, command);
        return url;
    }

    try {
        const result = await product.save();
        const objectURL = await putObjectURL(photo[0].name, photo[0].type);
        res.send(objectURL);
    }
    catch (err) {
        next(err);
    }
}

// Controller function to fetch products by search query
const deleteProduct = async (req, res, next) => {
    try {
        const result = await Product.findOneAndDelete({ _id: req.params.id });
        res.send(result);
    }
    catch (err) {
        next(err);
    }
}

// Export controller functions
module.exports = { getAllProducts, getProductByID, createNewProduct, getProductByCategory, getProductBySearch, deleteProduct };