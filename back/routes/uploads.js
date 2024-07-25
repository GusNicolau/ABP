//Ruta base: /api/upload

const { Router }= require('express');
const { subirArchivo, enviarArchivo, eliminarArchivo } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// Declaracion de rutas (sentencias crud)

router.get('/:tipo/:id', validarJWT, enviarArchivo);

router.post('/:tipo/:id', validarJWT, subirArchivo);

router.delete('/:tipo/:nombreImagen', validarJWT, eliminarArchivo);

module.exports = router;