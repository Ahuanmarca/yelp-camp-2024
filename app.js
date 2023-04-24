const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// SETTINGS & MIDDLEWARE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// ROUTES

// HOME
app.get('/', (req, res) => {res.render('home')});

// SHOW LIST OF ALL CAMPGROUNDS
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/', { campgrounds });
});

// SHOW DETAILS OF ONE CAMPGROUND
app.get('/campgrounds/:id/show', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

// EDIT DETAILS OF ONE CAMPGROUND
// FORM
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})
// ENDPOINT
app.put('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const { title, location } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, { title, location });
    res.redirect(`/campgrounds/${id}/show`);
});

// DELETE CAMPGROUND
app.delete('/campgrounds/:id/delete', async (req, res) => {
    const deleted = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
});

// CREATE NEW CAMPGROUND
// FORM
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
// ENDPOINT
app.post('/campgrounds/new', async (req, res) => {
    const { title, location } = req.body;
    const newCampground = await Campground.create({ title, location });
    res.redirect(`/campgrounds/${newCampground._id}/show`);
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});
