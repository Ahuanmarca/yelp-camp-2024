const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')


const Receta = require('./models/receta');

mongoose.connect('mongodb://localhost:27017/mercadoApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('CONNECTED TO: mongodb://localhost:27017/mercadoApp')
    })
    .catch((err) => {
        console.log(`ERROR: ${err}`)
    })


// Configurar path de views y ejs como view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Configurar parser de URL y method override
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.send('')
})

app.listen(3000, () => {
    console.log('hello, world - Listening on PORT 3000')
})