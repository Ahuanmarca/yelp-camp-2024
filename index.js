const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');  
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { join } = require('path');
const { campgroundSchema } = require('./schemas.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true, 
    // useCreateIndex: true, 
    useUnifiedTopology: true 
})

// ALTERNATIVA A .THEN() Y .CATCH()
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connceted")
})

const app = express();

// TEMPLATE ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// MIDDLEWARE
//      Son funciones que se corren cada vez que ocurre un request, siempre !!
//      ...y luego se continúa corriendo el resto del códico que corresponda
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// app.use(morgan('tiny'))
app.use((req, res, next) => {
    console.log(req.method.toUpperCase(), req.path);
    next();
})

app.use('/dogs', (req, res, next) => {
    console.log('I love dogs');
    next();
})

// ROUTES !!!

// hello, world
app.get('/', (req, res) => {
    // res.redirect('/campgrounds')
    res.render('home')
});

/*
▄█    ▄   ██▄   ▄███▄      ▄  
██     █  █  █  █▀   ▀ ▀▄   █ 
██ ██   █ █   █ ██▄▄     █ ▀  
▐█ █ █  █ █  █  █▄   ▄▀ ▄ █   
 ▐ █  █ █ ███▀  ▀███▀  █   ▀▄ 
   █   ██               ▀     
*/

// Campgrounds INDEX
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log("Opening index page");
    res.render('campgrounds/index', { campgrounds });
});

/*
   ▄   ▄███▄     ▄ ▄   
    █  █▀   ▀   █   █  
██   █ ██▄▄    █ ▄   █ 
█ █  █ █▄   ▄▀ █  █  █ 
█  █ █ ▀███▀    █ █ █  
█   ██           ▀ ▀   
*/

// Campgrounds CREATE NEW - FORM
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Campgrounds CREATE NEW - POST ROUTE
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, /*next*/) => {
    // 👀 ¡Esto funciona gracias a catchAsync! 👀
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)



    const newCamp = new Campground(req.body.campground); 
    await newCamp.save();
    // console.log(`Saved new campground: ${ newCamp.title }`);
    res.redirect(`/campgrounds/${newCamp._id}`)
}));

/*
   ▄▄▄▄▄    ▄  █ ████▄   ▄ ▄   
  █     ▀▄ █   █ █   █  █   █  
▄  ▀▀▀▀▄   ██▀▀█ █   █ █ ▄   █ 
 ▀▄▄▄▄▀    █   █ ▀████ █  █  █ 
              █         █ █ █  
             ▀           ▀ ▀   
*/

// Campgrounds SHOW DETAILS
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(`Show details: ${ campground.title }`);
    res.render('campgrounds/show', { campground });
}));

/*
▄███▄       ██▄       ▄█        ▄▄▄▄▀ 
█▀   ▀      █  █      ██     ▀▀▀ █    
██▄▄        █   █     ██         █    
█▄   ▄▀     █  █      ▐█        █     
▀███▀       ███▀       ▐       ▀      
*/

// Campgrounds EDIT DETAILS
//      EDITING FORM
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    // console.log('Opening "Edit" form')
    res.render('campgrounds/edit', { campground })
}));

//      Route to update DB via PUT...
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // Colt desestructura e inmediatamente reestructura req.body.campground en un objeto, no entiendo por qué...
    // const updated = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new:true})
    const updated = await Campground.findByIdAndUpdate(id, req.body.campground, {new:true})
    console.log(`Updated campground: ${ updated.title }`)
    res.redirect(`/campgrounds/${updated._id}`)
}));

/*
██▄   ▄███▄   █     ▄███▄     ▄▄▄▄▀ ▄███▄   
█  █  █▀   ▀  █     █▀   ▀ ▀▀▀ █    █▀   ▀  
█   █ ██▄▄    █     ██▄▄       █    ██▄▄    
█  █  █▄   ▄▀ ███▄  █▄   ▄▀   █     █▄   ▄▀ 
███▀  ▀███▀       ▀ ▀███▀    ▀      ▀███▀                                                   
*/

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;  
    const deleted = await Campground.findByIdAndDelete(id);
    console.log(`Deleted campground: ${ deleted.title }`)
    res.redirect('/campgrounds');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh No! Something Went Wrong!'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('hello, world - Serving on port 3000');
});