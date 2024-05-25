//! Forma de Importacion normal en node
const express = require('express');

//!Importacion para usar la la variable de entorno
require('dotenv').config();
// console.log(process.env);
const cors = require('cors');
const { dbConnection } = require('./database/config')

//? crear el SV de express
const app = express();

//? Base de datos
dbConnection();

//? CORS
app.use(cors());

//? Directorio publico
app.use(express.static('public'));//Middleware

//? Lectura y Parseo del body
app.use(express.json());

//? Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

//? Escuchar peticiones
app.listen(process.env.PORT, () => { //? Primer argumento el puerto, segundo argumento el callback
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
})