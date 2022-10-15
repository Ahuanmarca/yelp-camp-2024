const express = require('express');
const app = express();
const path = require('path'); // manipular path strings
const methodOverride = require('method-override') // poder usar PATCH y otros methods
const { v4: uuid4 } = require('uuid'); // id's únicas - destructuring while giving a new name


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// Array con comentarios (mock de base de datos)
let comments = [
    {
        id: uuid4(),
        username: 'Todd',
        comment: 'lol that is so funny!'
    },
    {
        id: uuid4(),
        username: 'Skyler',
        comment: 'I like to go birdwatching with my dog'
    },
    {
        id: uuid4(),
        username: 'Sk8erBoi',
        comment: 'Plz delete your account, Todd'
    },
    {
        id: uuid4(),
        username: 'onlysayswoof',
        comment: 'woof woof woof'
    }
]


app.get('/', (req, res) => {
    res.redirect('/comments')
})

app.get('/comments', (req, res) => {
    res.render('comments/index', { comments })
})

// CREATE COMMENT
//      Ruta a formulario para crear nuevo comentario
app.get('/comments/new', (req, res) => {
    res.render('comments/new')
})

//      Ruta que recibe data desde el formulario vía POST request
app.post('/comments', (req, res) => {
    // console.log(req.body)
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuid4() })
    console.log(comments)
    res.redirect('/comments')
})


// SHOW COMMENT DETAILS
//      Ruta que muestra detalles de un comentario
app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id)
    res.render('comments/show', { ...comment })
})


// EDIT COMMENT
//      Ruta para ir a formulario de edición de comentario
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params; // obtenemos id de params
    const comment = comments.find(c => c.id === id); // buscamos comment con id
    res.render('comments/edit', { comment }) // pasamos comment a formulario para editarlo
})

//      Ruta para editar comentario con PATCH
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params; // obtiene id de url
    const newCommentText = req.body.comment; // obtiene nuevo texto de BODY del req
    const foundComment = comments.find(c => c.id === id); // obtiene comment del array con el id
    foundComment.comment = newCommentText; // reemplaza comment attribute en array
    res.redirect('/comments') // redirige a index
})


// DELETE COMMENT
//      Ruta para borrar comentario con DELETE
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params; // obtiene id de url
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
})


app.listen(3000, () => {
    console.log('hello, world - listening on port 3000')
})