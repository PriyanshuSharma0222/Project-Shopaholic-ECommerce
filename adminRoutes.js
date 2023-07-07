import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/ProductModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminRouter = express.Router();
adminRouter.use(express.static('public'));

adminRouter.get('/add-product', (req,res)=>{
    res.status(200).sendFile(__dirname + '/public/AddProduct.html');
});

adminRouter.post('/add-product', async (req,res)=>{
    try {
        const {name,description,imageURL,price,tags} = req.body;
        const newProduct = new Product({name,description,imageURL,price,tags});
        await newProduct.save();
        return res.status(200).send({
            success: true,
            message: 'New Product Added'
        });

    } catch (error) {
        console.error(`<<< (/admin/POST/add-product) >>> ${error} >>>`);
        return res.status(500).json({
            success: false,
            message: 'ERROR',
            error
        });
    }
});

export default adminRouter;