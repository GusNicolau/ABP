// raiz de peticiones que llegan aqui: api/ejercicios (Ruta base)
// Aqui se realizan validaciones / controles seguridad

const { Router }= require('express');
const { obtenerEjercicio, crearEjercicio, actualizarEjercicio, eliminarEjercicio, buscarEjercicio, buscador } = require('../controllers/exercice');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// Declaracion de rutas (sentencias crud)

router.get('/',//validarJWT, 
obtenerEjercicio);

router.get('/filtrado', buscador);

router.get('/:titulo', buscarEjercicio);

router.post('/',validarJWT, crearEjercicio);

router.put('/:id',validarJWT, actualizarEjercicio)

router.delete('/:id',validarJWT, eliminarEjercicio);

module.exports = router;