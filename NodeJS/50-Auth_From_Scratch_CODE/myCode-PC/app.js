const express = require('express');
const { default: mongoose } = require('mongoose'); // Se requirió automáticamente
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/loginDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));


// CREAR SESIÓN
//      Al crear sesión, automáticamente se enviará COOKIE al browser
//      Se pueden guardar variables en la sesión
app.use(session({
    secret: '4kit4rig4to',
    resave: false,
    saveUninitialized: false
}))

app.get('/', (req, res) => res.redirect('/index'));
app.get('/index', (req, res) => {
    
    res.render('index', {
        user: req.session.user_id,
        username: req.session.username,
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password, confirmation } = req.body;

    const hash = await bcrypt.hash(password, 12);

    // ! Crea 'user' con model 'User' importado de 'user.js'
    const user = new User({
        username,
        hash
    });
    await user.save();

    res.redirect('/');
})


app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user with this username
    const user = await User.findOne({
        username
    });

    if(!user) {
        res.send("Invalid username or password!");
        return;
    }

    const validPassword = await bcrypt.compare(password, user.hash);

    if (validPassword) {
        req.session.user_id = user._id;
        req.session.username = user.username;
        res.redirect('/index');
    } else {
        res.send("Nope!");
    }



})


app.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        res.render('secret');
        // res.send("You can't enter the secret page.")
    }
});


app.post('/logout', (req, res) => {
    req.session.user_id = null;

    res.redirect('/index');
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
});