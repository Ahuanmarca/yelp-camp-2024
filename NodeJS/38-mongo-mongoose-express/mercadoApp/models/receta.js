const mongoose = require('mongoose');

// const Ingrediente = require('./ingrediente')

const recetaSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    ingredients: {
        type: [Object]
    }
})

const Receta = mongoose.model('Receta', recetaSchema);

module.exports = Receta;