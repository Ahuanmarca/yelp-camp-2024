const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');  
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews')

// const { campgroundSchema, reviewSchema } = require('./schemas.js');
// const { join } = require('path');
// const Campground = require('./models/campground');
// const catchAsync = require('./utils/catchAsync');
// const Joi = require('joi');
// const Review = require('./models/review');

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true, 
    // useCreateIndex: true, 
    useUnifiedTopology: true,
    // useFindAndModify: false
})

// ALTERNATIVA A .THEN() Y .CATCH()
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connceted")
})

const app = express();

// SETTINGS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// Deprecated error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    console.error("what am i doing here?");
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh No! Something Went Wrong!'
    res.status(statusCode).render('error', { err });
});


app.listen(3000, () => {
    console.log('hello, world - Serving on port 3000');
});
