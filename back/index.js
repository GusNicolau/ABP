//Este es el archivo base

//Importación de módulos
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

require('dotenv').config();
const { dbConnection } = require('./database/configdb');

//Crea una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(express.json()); // middleware para accedeer a las req (req.body.nombre)
app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true
}));

// Controlando rutas base

//cualquier peticion que tenga /usuarios en la ruta se atiende desde aqui
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/items', require('./routes/exercice'));
app.use('/api/chatbot', require('./routes/chatbot'));
// meter mas endpoints aqui...

//Abrir la app en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});

// import de datos o endpoint oculto