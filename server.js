import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import Product from './models/ProductModel.js';
import User from './models/UserModel.js';
import Cart from './models/CartModel.js';
import MetaData from './models/MetaData.js';
import { encryptPassword, comparePassword } from './authHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.listen(PORT, ()=>{
    console.log(`<<< APP LISTENING ON PORT : ${PORT} >>>`);
});

connectDB();

app.get('/', (req,res)=>{
    res.redirect('/home');
});

app.get('/home', (req,res)=>{
    res.status(200).sendFile(__dirname + '/public/HomePage.html');
});

app.get('/addproduct', (req,res)=>{
    res.status(200).sendFile(__dirname + '/public/addProduct.html');
});

app.post('/addproduct', (req,res)=>{
    console.log(req.body);
    const {name,description,imageURL,price,tags} = req.body;
    console.log(name,description,imageURL,price,tags);   

    const newProduct = new Product({name,description,imageURL,price,tags});
    newProduct.save();
    return res.status(200).send({
        success: true,
        message: 'Product Saved'
    })
});

app.get('/products', (req,res)=>{
    async function findProduct() {
        try {
          const products = await Product.find({});
      
          if (!products) {
            console.log('NOT FOUND');
            res.status(404).json("NOT FOUND");
          } else {
            // console.log('Found products:', products);
            res.json(products);
          }
        } catch (err) {
          console.error('An error occurred:', err);
          res.status(500).json({error: err});
        }
    }
    findProduct();
})

app.get('/register', (req,res)=>{
    return res.status(200).sendFile(__dirname+'/public/register.html');
})

app.post('/register', async (req,res)=>{
    console.log(req.body);
    const {name,email,password,phone,address} = req.body;
    console.log(name,email,phone,address,password);
    const hashedPassword = await encryptPassword(password);
    const newCart = new Cart;
    newCart.save();
    const newUser = new User({name,email,password:hashedPassword,phone,address, cartID:newCart._id});
    newUser.save();
    newCart.userID = newUser._id;
    return res.status(200).send({
        success: true,
        message: 'User Saved',
    })
});

app.get('/login', (req,res)=>{
    return res.status(200).sendFile(__dirname+'/public/login.html');
})

app.post('/login', (req,res)=>{
    const {name,password} = req.body;
    console.log({name,password});

    async function findUser() {
        try {
            const user = await User.findOne({ name });
        
            if (!user) {
                console.log('User not found');
                return res.status(404).json({
                    success: false,
                    message: 'User Not Found'
                });
            } else {
                const match =  await comparePassword(password, user.password);
                if(!match){
                    console.log('Invalid Password.')
                    return res.status(200).send({
                        success: false,
                        message: 'Invalid Password'
                    });
                }
                console.log('Found user:', user);

                MetaData.updateOne({}, {isAdmin: false, userID: user._id})
                .then(result => {
                    console.log('UPDATED');
                })
                .catch(error => {
                    console.error('ERROR:', error);
                });


                return res.json({
                    success: true,
                    message: 'Found User',
                    userID: user._id
                });
            }
        } catch (err) {
            console.error('An error occurred:', err);
            res.status(500).json({error: err});
        }
    }
    findUser();
})

app.post('/addtocart', async (req,res)=>{
    try {
        const {userID,productID} = req.body;
        console.log(userID, productID);
        if(!userID || !productID){
            return res.status(500).json({
                success: false,
                message: `Product Not Added` 
            });
        }
        const cart = await Cart.findOne({ userID });
        const product = await Product.findById(productID);
        console.log(cart);
        console.log(product);
        console.log('Length : ', cart.products.length);

        if(cart.products.some(prod => prod['productID'] === productID)){
            const index = cart.products.findIndex(prod => prod['productID'] === productID);
            cart.products[index]['quantity']++;
        }
        else{
            const prod = {
                'productID':productID, 
                'quantity':1
            }
            console.log(prod);
            cart.products.push(prod);
        }
        cart.totalPrice += product.price;
        console.log(cart);
        cart.save();

        return res.status(200).json({
            success: true,
            message: 'post request completed'
        });
    } catch (error) {
        console.log(`ERROR : ${error}`);
        return res.status(500).json({
            success: false,
            message: `ERROR: ${error}` 
        });
    }
})

app.post('/cart-length', async (req,res)=>{
    try {
        const {userID} = req.body;
        console.log(userID);
        if(!userID){
            return res.status(500).json({
                success: false,
                message: `User not found` 
            });
        }
        const cart = await Cart.findOne({ userID });
        console.log(cart);
        console.log('LENGTH : ', cart.products.length);
        
        return res.status(200).json({
            success: true,
            length: cart.products.length
        });

    } catch (error) {
        console.log(`ERROR : ${error}`);
        return res.status(500).json({
            success: false,
            message: `ERROR: ${error}` 
        });
    }
})