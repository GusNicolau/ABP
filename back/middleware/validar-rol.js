const { response } = require('express');
const rolesPermitidos = ['ROL_BASICO', 'ROL_PREMIUM', 'ROL_ADMIN'];

const validarRol = (req, res = response, next) => {
    
    const rol = req.body.rol;
    
    if(rol && !rolesPermitidos.includes(rol)) { // con esta condicion facilitamos el cambio de roles 
        return res.status(400).json({
            ok: false,
            msg: 'Rol no permitido. Permitidos: ROL_ADMIN, ROL_PREMIUM, ROL_BASICO'
        });
    }

    next();

}

module.exports = { validarRol };