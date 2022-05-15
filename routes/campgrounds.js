const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schemas.js');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// Campgrounds INDEX
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    // console.log("Opening index page");
    res.render('campgrounds/index', { campgrounds });
});


// Campgrounds CREATE NEW - FORM
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// Campgrounds CREATE NEW - POST ROUTE
router.post('/', validateCampground, catchAsync(async (req, res, /*next*/) => {
    // 👀 ¡Esto funciona gracias a catchAsync! 👀
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const newCamp = new Campground(req.body.campground); 
    await newCamp.save();
    // console.log(`Saved new campground: ${ newCamp.title }`);
    res.redirect(`/campgrounds/${newCamp._id}`)
}));

// Campgrounds SHOW DETAILS
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground);
    res.render('campgrounds/show', { campground });
}));

// Campgrounds EDIT DETAILS
//      EDITING FORM
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}));

//      Route to update DB via PUT...
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // Colt desestructura e inmediatamente reestructura req.body.campground en un objeto, no entiendo por qué...
    // const updated = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new:true})
    const updated = await Campground.findByIdAndUpdate(id, req.body.campground, {new:true})
    // console.log(`Updated campground: ${ updated.title }`)
    res.redirect(`/campgrounds/${updated._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;  
    const deleted = await Campground.findByIdAndDelete(id);
    // console.log(`Deleted campground: ${ deleted.title }`)
    res.redirect('/campgrounds');
}));

module.exports = router;
