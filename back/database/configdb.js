const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.DBCONNECTION, {
            // Valores predeterminados (deben eliminarse)
            /*useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false*/
        });
        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al inicial la DB');
    }

}

module.exports = { dbConnection };
