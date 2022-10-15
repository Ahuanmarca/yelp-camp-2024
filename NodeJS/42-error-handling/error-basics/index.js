const express = require('express');
const path = require('path');
const app = express();

const AppError = require('./AppError');

app.set('views')
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

function verifyPassword(req, res, next) {
    const { password } = req.query;
    if (password === 'chickennugget') {
        next();
    }
    throw new AppError(401, 'password required');
}

app.get('/secret', verifyPassword, (req, res) => {
    res.send("Secret route found!");
})

// Default error handling by Express
app.get('/error', (req, res) => {
    throw new Error('This is a manually thrown error.')
    foo.bar();
})

app.get('/admin', (req, res) => {
    throw new AppError(403, 'You are not an admin');
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something broke!" } = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})



