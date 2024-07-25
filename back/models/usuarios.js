const { Schema, model } = require('mongoose');
const ExerciceSchema = require('./exercices').schema;

const UsuarioSchema = Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        apellidos: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        imagen: {
            type: String
        },
        rol: {
            type: String,
            required: true,
            default: 'ROL_BASICO'
        },
        alta: {
            type: Date,
            default: Date.now
        },
        favoritos: {
            type: [ExerciceSchema], // Definimos el array de objetos usando el esquema de ejercicio
            default: []
        },

        activo: {
            type: Boolean,
            default: true
        }
       
    },
    {
        collection: 'usuarios'
    }
);

UsuarioSchema.method('toJSON', function() {
    const { __v, id, password, ...object } = this.toObject();
    object.uid = id;
    return object;
}); // Sobreescribimos metodo toJSON para que cada vez que tenga que ser escrito
    // en forma de JSON lo haga sin algunos parametros como version o contrasena

module.exports = model('Usuario', UsuarioSchema);