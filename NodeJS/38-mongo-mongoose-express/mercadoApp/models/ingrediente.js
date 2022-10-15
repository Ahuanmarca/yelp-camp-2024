const mongoose = require('mongoose');

const ingredienteSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    qty: {
        type: Number
    },
    unit: {
        type: String,
        enum: ['unidades', 'tazas', 'cucharadas', 'cucharaditas', 'pizcas', 'al gusto']
    }
})

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);

module.exports = Ingrediente;