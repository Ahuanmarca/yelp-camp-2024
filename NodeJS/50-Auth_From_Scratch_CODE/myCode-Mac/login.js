const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', async (req, res) => {
  const pets = await prisma.pets.findMany({});
  res.render('index', {
    pets
  })
});

app.listen(3000, () => {
  console.log("Server on port 3000");
})
