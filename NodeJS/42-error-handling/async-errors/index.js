const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connection Open")
    })
    .catch(err => {
        console.log("MongoDB Connection Error!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy', 'fungi'];

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}


// MAIN PAGE
app.get('/products', wrapAsync(async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({category: category});
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }
}))


// CREATE NEW PRODUCT (GET)
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})


// CREATE NEW PRODUCT (POST)
app.post('/products', wrapAsync(async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
}))


// PRODUCT DETAILS
app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError(404, 'Product Not Found');
    } else {
        res.render('products/show', { product });
    }
}))


// EDIT PRODUCT (GET)
app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError(404, 'Product Not Found');
    } else {
        res.render('products/edit', { product, categories });
    }
}))


// EDIT PRODUCT (PUT)
app.put('/products/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true, 
        new: true
    });
    res.redirect(`/products/${product._id}`);
}))


// DELETE PRODUCT (DELETE)
app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}))


function handleValidationErr(err) {
    console.dir(err);
    return new AppError(400, `Validation Failed...${err.message}`)
}

app.use((err, req, res, next) => {
    console.log(err.name);
    // We can single out particular types of Mongoose Errors:
    if (err.name === 'ValidationError') err = handleValidationErr(err)
    next(err);
})


app.use((err, req, res, next) => {
    const { status = 500, message = "Something broke!" } = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
