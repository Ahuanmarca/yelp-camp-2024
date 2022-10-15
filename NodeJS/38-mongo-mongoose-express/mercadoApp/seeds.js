const mongoose = require('mongoose');
const Receta = require('./models/receta')
// const Ingrediente = require('./models/ingrediente')

mongoose.connect('mongodb://localhost:27017/mercadoApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('CONNECTED TO: mongodb://localhost:27017/mercadoApp')
    })
    .catch((err) => {
        console.error(`ERROR: ${err}`)
    })

const ing1 = {
    name: 'pollo',
    qty: 2,
    unit: 'unidades'
}

const ing2 = {
    name: 'cebolla',
    qty: 0.5,
    unit: 'tazas'
}

const p = new Receta({
    name: 'Arroz con pollo',
    ingredients: [ing1, ing2]
})

p.save()
    .then(m => console.log(m))
    .catch(err => console.log(err))

// const recetaSchema = new mongoose.Schema({
//     name: {
//         type: String,
//     },
//     ingredients: {
//         type: [Ingrediente]
//     }
// })