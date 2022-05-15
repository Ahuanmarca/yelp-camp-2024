const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// INDEX
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    // console.log("Opening index page");
    res.render('campgrounds/index', { campgrounds });
});

// CREATE NEW (FORM)
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// CREATE NEW (POST ROUTE)
router.post('/', validateCampground, catchAsync(async (req, res, /*next*/) => {
    // 👀 ¡Esto funciona gracias a catchAsync! 👀
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const newCamp = new Campground(req.body.campground); 
    await newCamp.save();

    req.flash('success', 'Successfully made a new campground!')

    // console.log(`Saved new campground: ${ newCamp.title }`);
    res.redirect(`/campgrounds/${newCamp._id}`)
}));

// SHOW DETAILS
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground);

    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/');
    }

    res.render('campgrounds/show', { 
        campground,
        // msg: req.flash("success")
    });
}));    

// EDIT DETAILS (FORM)
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}));

// EDIT DETAILS (PUT ROUTE)
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // Colt desestructura e inmediatamente reestructura req.body.campground en un objeto, no entiendo por qué...
    // const updated = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new:true})
    const updated = await Campground.findByIdAndUpdate(id, req.body.campground, {new:true})
    req.flash('success', 'Successfully updated campground!')
    // console.log(`Updated campground: ${ updated.title }`)
    res.redirect(`/campgrounds/${updated._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;  
    const deleted = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    // console.log(`Deleted campground: ${ deleted.title }`)
    res.redirect('/campgrounds');
}));

module.exports = router;
