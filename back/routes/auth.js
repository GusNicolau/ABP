// raiz de peticiones que llegan aqui: api/login (Ruta base)

const { Router }= require('express');
const { login, token } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

// aqui no necesitamos validar jwt porque el usuario 
// aun no tiene token para validarse frente a la ruta

router.get('/token', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos
], token);

router.post('/', [
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos
], login);

module.exports = router;