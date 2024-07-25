const { Console } = require('console');
const { response } = require('express');
const { google } = require('google-auth-library');


// RUTAS

// Esta funcion puede obtener: listado completo de ejercicios/uno en especifico filtrado por id/ ejercicio por paginacion
const obtenerQuery = async(req,res) => {
    // meter parte que conecte con dialogFlow
        res.json({
            ok: true,
            msg: 'obtenerQuery'
        });

}


//Se deben exportar las peticiones para usar desde fuera
module.exports = {
    obtenerQuery
}