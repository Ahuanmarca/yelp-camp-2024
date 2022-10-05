const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError').default;
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schemas.js');

const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

}   

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    console.log(req.body);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created review!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res) => {
    // We still have a reference to this campground, in the array of object IDs, so we have to find that reference and delete it
    // We are going to use an operator in Mongo called pull
    const { id, reviewId } = req.params;
    const deletedCampground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    // console.log({deletedCampground, deletedReview});
    res.redirect(`/campgrounds/${id}`);

}));

module.exports = router;
