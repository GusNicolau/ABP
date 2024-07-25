const { response } = require('express');
require('dotenv').config();
const{ v4:uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


// RUTAS

const subirArchivo = async(req,res=response) => {

    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo'
        });
    }

    /*if(req.files.archivo.truncate) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`
        });
    }*/

    const tipo = req.params.tipo;
    const id = req.params.id;

    const archivosValidos = {
        foto: ['jpeg','jpg','png'],
        evidencia: ['doc','docx','xls','pdf','zip']
    }

    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length-1];

    switch (tipo) {
        case 'foto':
            if(!archivosValidos.foto.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no esta permitido(${archivosValidos.foto})`,
                });
            }
            break;
        case 'evidencia':
            if(!archivosValidos.evidencia.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no esta permitido(${archivosValidos.evidencia})`,
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de operacion no esta permitida',
                tipoOperacion: tipo
            });
    }

    const patharchivo = `${process.env.PATHUPLOADOVH}/${tipo}/${uuidv4()}.${extension}`;
    console.log(patharchivo); // PARA COMPROBAR ERROR SUBIR FOTO DE EJERCICIO

    const nombreArchivo = patharchivo.split('/');

    const nombre = nombreArchivo[7];


    archivo.mv(patharchivo, (err) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo cargar el archivo',
                tipoOperacion: tipo
            });
        }

        res.json({
            ok: true,
            msg: 'subirArchivo',
            nombre: nombre,
            ruta: patharchivo
        });

    });

}

const enviarArchivo = async(req,res=response) => {

    res.json({
        ok: true,
        msg: 'enviarArchivo'
    });

}

const eliminarArchivo = async (req, res = response) => {
    const tipo = req.params.tipo;
    const nombreImagen = req.params.nombreImagen;

     // Ruta donde se encuentra la imagen
     const rutaImagen = path.join(process.env.PATHUPLOADOVH, tipo, nombreImagen);
    
     try {
         // Verificar si el archivo existe
         if (fs.existsSync(rutaImagen)) {
             // Eliminar la imagen
             fs.unlinkSync(rutaImagen);
             res.json({
                 ok: true,
                 msg: 'Imagen eliminada exitosamente.'
             });
         } else {
             res.status(404).json({
                 ok: false,
                 msg: 'La imagen no existe.'
             });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({
             ok: false,
             msg: 'Error al intentar eliminar la imagen.'
         });
     }

    // Tu lógica para eliminar el archivo...
}
//Se deben exportar las peticiones para usar desde fuera
module.exports = {
    subirArchivo,
    enviarArchivo,
    eliminarArchivo
}