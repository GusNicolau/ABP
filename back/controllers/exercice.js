const { Console } = require('console');
const Ejercicio = require('../models/exercices');
const { response } = require('express');
//const validator = require('validator');



// RUTAS

// Esta funcion puede obtener: listado completo de ejercicios/uno en especifico filtrado por id/ ejercicio por paginacion
const obtenerEjercicio = async(req,res) => {

    // Para paginacion al obtener los ejercicios
    const desde = Number(req.query.desde) || 0; // en caso de que no sea numero valido ponemos 0
    const registropp = Number(process.env.DOCSPERPAGE);

    // Obtenemos el ID de ejercicio por si quiere buscar solo un ejercicio
    const id = req.query.id;

    // La funcion espera a recibir un resultado para mostrar la respuesta (no continua ejecucion)
    /*const ejercicios = await Ejercicio.find({}, 'nombre apellidos email rol').skip(desde).limit(registropp);
    const total = await Ejercicio.countDocuments();*/

    try {

        var ejercicios, total;

        if(id) {

            // Hacemos el get /id
            /*if(!validator.isMongoId(id)) {
                return res.json({
                    ok: false,
                    msg: 'Controller: El id de ejercicio debe ser valido'
                });
            }*/ // Validacion en ejercicios.js (ROUTES)

            [ ejercicios, total ] = await Promise.all([
                Ejercicio.findById(id)/*.populate('grupo')*/,
                Ejercicio.countDocuments()
            ]);

            // Incluiriamos populate para (en este ejemplo) listar todos los elementos del
            // objeto Grupo al que apunta este ejercicio (nombre, proyecto, descripcion...)
            // -- Ver en nuestro proyecto si interesa listar algo --
            
        } else {

            // Si llega aqui es que no se ha filtrado por id y se listan por registros los ejercicios

            [ ejercicios, total ] = await Promise.all([
                Ejercicio.find({}).skip(desde).limit(registropp)/*.populate('grupo')*/,
                Ejercicio.countDocuments()
            ]);

        }

        res.json({
            ok: true,
            msg: 'obtenerEjercicios',
            ejercicios, // ejercicios: ejercicios
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
            msg: 'Error obteniendo ejercicios'
        });

    }

}

const buscador = async (req, res) => {
    try {
        //filtros es basicamente el texto que introducimos en el buscador de la interfaz
        const filtro = req.query.titulo; // Recibe el filtro de búsqueda desde la solicitud GET
        const regex = new RegExp(filtro, 'i'); // Crear una expresión regular con el filtro y 'i' para que sea insensible a mayúsculas/minúsculas
        const ejercicios = await Ejercicio.find({
            $or: [
                { titulo: { $regex: regex } },
                { descripcion: { $regex: regex } },
                { parteCuerpo: { $regex: regex } },
                { consejo: { $regex: regex } },
                { musculo: { $regex: regex } }
            ]
        }); // Utilizar la expresión regular en la consulta y buscar en nombre o email


        res.json(ejercicios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error encontrando ejercicios' });
    }
}


const buscarEjercicio = async (req, res) => {
    try {
      const ejercicio = await Ejercicio.findOne({ titulo: req.params.titulo });
      if (ejercicio) {
        // Si se encuentra el ejercicio, devolver verdadero
        return res.json({ existe: true });
      } else {
        // Si no se encuentra el ejercicio, devolver falso
        return res.json({ existe: false });
      }
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error encontrando ejercicios' });
    }
  }

const crearEjercicio = async(req,res) => {
    
    try {

        const ejercicio = new Ejercicio(req.body);

        const existeEjercicio = await Ejercicio.findOne({ titulo : ejercicio.titulo });
         if(existeEjercicio) {
             
             // Comprobamos que el titulo no exista ya
                 return res.status(400).json({
                     ok: false,
                     msg: 'El titulo de ejercicio ya existe'
                 });
         }

        // Almacenamos en BD
        await ejercicio.save();

        res.json({
            ok: true,
            msg: 'crearEjercicio',
            ejercicio   //ejercicio.json()
        });

    } catch (error) {
        
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error creando ejercicio'
        });
    }

}

const actualizarEjercicio = async(req,res = response) => {

     // Comprobar si cambia el titulo no existe ya en BD, si no existe puede cambiarlo
     const { titulo, descripcion, ...object } = req.body;
     const uid = req.params.id;
 
     try {
         // Comprobar si esta intentando cambiar el titulo, que no coincida con alguno que ya este en BD
         
         const existeEjercicio = await Ejercicio.findOne({ titulo: titulo });
         if(existeEjercicio) {
             
             // Comprobamos que sea el suyo, el UID ha de ser igual, si no el ejercicio existe
             if(existeEjercicio.id != uid) {
                 return res.status(400).json({
                     ok: false,
                     msg: 'El titulo de ejercicio ya existe'
                 });
             }
         }
         object.titulo= titulo;
         object.descripcion=descripcion;
         
         const ejercicio = await Ejercicio.findByIdAndUpdate(uid, object, { new: true });
         
         res.json({
             ok: true,
             msg: 'Ejercicio actualizado',
             ejercicio: ejercicio
         });
     } catch (error) {
         console.log(error);
 
         return res.status(400).json({
             ok: false,
             msg: 'Error actualizando ejercicio'
         });
     }

}

const eliminarEjercicio = async(req,res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el ejercicio que queremos borrar
        const existeEjercicio = await Ejercicio.findById(uid);
        if(!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }
        // Lo eliminamos y devolvemos el ejercicio recien eliminado
        const resultado = await Ejercicio.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Ejercicio eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error borrando ejercicio'
        });
    }

}

//Se deben exportar las peticiones para usar desde fuera
module.exports = {
    buscador,
    obtenerEjercicio,
    crearEjercicio,
    actualizarEjercicio,
    eliminarEjercicio,
    buscarEjercicio
}