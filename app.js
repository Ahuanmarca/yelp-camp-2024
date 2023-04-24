const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => { console.log("Database connected") });

const app = express();

// CONFIGURATION AND MIDDLEWARE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// ROUTES

// HOME
app.get('/', (req, res) => {
    res.render('home');
});

// ALL CAMPGROUNDS
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/', { campgrounds });
});

// SHOW DETAILS
app.get('/campgrounds/:id/show', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

// EDIT DETAILS
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});
app.put('/campgrounds/:id/edit', async (req, res) => {
    const id = req.params.id;
    const { title, location } = req.body;
    const editedCampground = await Campground.findByIdAndUpdate(id, { title, location });
    res.redirect(`/campgrounds/${editedCampground._id}/show`);
});

// DELETE ONE CAMPGROUND
app.delete('/campgrounds/:id/delete', async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log(`Deleted: ${deletedCampground}`);
    res.redirect('/campgrounds');
})

// CREATE NEW CAMPGROUND
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds/new', async (req, res) => {
    const { title, location } = req.body;
    const newCampground = new Campground({ title, location });
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}/show`);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
});