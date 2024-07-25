const Usuario = require('../models/usuarios');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');


// RUTAS

// Esta funcion puede obtener: listado completo de usuarios/uno en especifico filtrado por id/ usuarios por paginacion
const obtenerUsuario = async(req,res) => {

    // Para paginacion al obtener los usuarios
    const desde = Number(req.query.desde) || 0; // en caso de que no sea numero valido ponemos 0
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id;

    // La funcion espera a recibir un resultado para mostrar la respuesta (no continua ejecucion)
    /*const usuarios = await Usuario.find({}, 'nombre apellidos email rol').skip(desde).limit(registropp);
    const total = await Usuario.countDocuments();*/

    try {

        var usuarios, total;

        if(id) {

            // Hacemos el get /id
            /*if(!validator.isMongoId(id)) {
                return res.json({
                    ok: false,
                    msg: 'Controller: El id de usuario debe ser valido'
                });
            }*/ // Validacion en usuarios.js (ROUTES)

            [ usuarios, total ] = await Promise.all([
                Usuario.findById(id)/*.populate('grupo')*/,
                Usuario.countDocuments()
            ]);

            // Incluiriamos populate para (en este ejemplo) listar todos los elementos del
            // objeto Grupo al que apunta este usuario (nombre, proyecto, descripcion...)
            // -- Ver en nuestro proyecto si interesa listar algo --
            
        } else {

            // Si llega aqui es que no se ha filtrado por id y se listan por registros los usuarios

            [ usuarios, total ] = await Promise.all([
                Usuario.find({}).skip(desde).limit(registropp)/*.populate('grupo')*/,
                Usuario.countDocuments()
            ]);

        }

        res.json({
            ok: true,
            msg: 'obtenerUsuarios',
            usuarios, // usuarios: usuarios
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {

        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo usuario'
        });

    }

}

const buscarUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario.favoritos);
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        res.status(500).json({ mensaje: 'Error al buscar usuario' });
    }
};

const searcher = async (req, res) => {
    try {
        const filtro = req.params.nombre; // Recibe el filtro de búsqueda desde la solicitud GET
        console.log(filtro);
        const regex = new RegExp(filtro, 'i'); // Crear una expresión regular con el filtro y 'i' para que sea insensible a mayúsculas/minúsculas
        const usuarios = await Usuario.find({
            $or: [
                { nombre: { $regex: regex } },
                { email: { $regex: regex } }
            ]
        }); // Utilizar la expresión regular en la consulta y buscar en nombre o email
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error encontrando usuarios' });
    }
}

const crearUsuario = async(req,res) => {

    const { email, password } = req.body; // Rol comprobado a parte

    try {

        const existeEmail = await Usuario.findOne({email: email});

        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una cuenta con este email'
            });
        }

        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync( password, salt);

        // Vamos a tomar todo lo que nosllega por el req.body excepto el alta
        const { alta, ...object } = req.body;
        const usuario = new Usuario(req.body);
        usuario.password = cpassword;

        // Almacenamos en BD
        await usuario.save();

        res.json({
            ok: true,
            msg: 'crearUsuario',
            usuario   //usuario.json()
        });

    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error creando usuario'
        });

    }

}

const actualizarContra = async(req,res) => {

    const { email, password, ... object } = req.body; // Rol comprobado a parte

    const uid = req.params.id;

    try {

        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync( password, salt);

        object.password = cpassword;

        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Contraseña actualizada',
            usuario: usuario
        });
        

    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando contraseña'
        });

    }

}

const actualizarUsuario = async(req,res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificacion del password es otra llamada
    // Comprobar si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, alta, email, ...object } = req.body;
    const uid = req.params.id;

    try {
        // Comprobar si esta intentando cambiar el email, que no coincida con alguno que ya este en BD
        // Obtenemos si hay un usuario en BD con el email que nos llega en post
        const existeEmail = await Usuario.findOne({ email: email });
        if(existeEmail) {
            
            // Si existe un usuario con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email esta en uso
            if(existeEmail.id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El email introducido ya existe'
                });
            }
        }
        // Llegados aqui, el email o es mismo o no esta en BD
        object.email = email;
        // Al haber extraido password del req.body nunca se va a enviar en este put
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario: usuario
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const borrarUsuario = async(req,res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if(!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuario recien eliminado
        const resultado = await Usuario.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error borrando usuario'
        });
    }

}

//Se deben exportar las peticiones para usar desde fuera
module.exports = {
    searcher,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    actualizarContra,
    borrarUsuario,
    buscarUsuarioPorId
}