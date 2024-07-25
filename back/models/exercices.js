const { Schema, model } = require('mongoose');

const ExerciceSchema = Schema(
    {
        titulo: {
            type: String
        },
        descripcion: {
            type: String,
            required: true
        },
        imagen: {
            type: String
        },
        parteCuerpo: {
            type: String
        },
        musculo: {
            type: String
        },
        consejos: {
            type: Array
        },
        ejercicioAlternativo: {
            type: String
        },
        video: {
            type: String
        }
        
    },
    {
        collection: 'exercices'
    }
);

ExerciceSchema.method('toJSON', function() {
    const { __v, id, password, ...object } = this.toObject(); // SOBREESCRIBIR VARIABLES QUE NO QUEREMOS MOSTRAR EN JSON()
    object.uid = id;
    return object;
}); // Sobreescribimos metodo toJSON para que cada vez que tenga que ser escrito
    // en forma de JSON lo haga sin algunos parametros como version o contrasena

module.exports = model('Exercice', ExerciceSchema);