// raiz de peticiones que llegan aqui: api/usuarios (Ruta base)
// Aqui se realizan validaciones / controles seguridad

const { Router }= require('express');
const { obtenerUsuario, crearUsuario, actualizarUsuario, borrarUsuario, searcher, actualizarContra, buscarUsuarioPorId } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// Declaracion de rutas (sentencias crud)

router.get('/', [
    validarJWT,
    // Campos opcionales, en caso de que vengan los validamos
    check('id', 'El id de usuario debe ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un numero').optional().isNumeric(),
    validarCampos
], obtenerUsuario);

router.get('/:id', [
    validarJWT,
    // Campos opcionales, en caso de que vengan los validamos
    check('id', 'El id de usuario debe ser valido').optional().isMongoId(),
], buscarUsuarioPorId);

router.get('/filtrado/:nombre', searcher);

router.post('/', [
    //validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(), // trim() para limpieza de espacios vacios
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    // Campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
    validarRol
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('email', 'El argumento email es obligatorio').isEmail(),
    /*check('password', 'El argumento password es obligatorio').not().isEmpty(),*/ // Para esto hacer procedimiento especifico y seguro
    check('id', 'El identificador no es valido').isMongoId(),
    // Campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
    validarRol
], actualizarUsuario);

router.put('/psw/:id', [
    validarJWT,
    //check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    //check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),// Para esto hacer procedimiento especifico y seguro
    check('id', 'El identificador no es valido').isMongoId(),
    // Campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
    validarRol
], actualizarContra);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es valido').isMongoId(),
    validarCampos
], borrarUsuario);

module.exports = router;