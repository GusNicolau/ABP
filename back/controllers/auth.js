const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');
const Usuario = require('../models/usuarios');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');


const token = async(req,res=response) => {

    const token = req.headers['x-token'];
    
    try {
        const { uid, rol, ...object } = jwt.verify( token, process.env.JWTSECRET );

        const usuarioBD = await Usuario.findById(uid);

        console.log(usuarioBD);
        if(!usuarioBD) {
            return res.status(400).json({
                ok: false,
                //code:   Utilizarlo recomendacion de Josevi
                msg: 'Token no valido',
                token: ''
            });
        }
        const nrol = usuarioBD.rol;
        const nuevoToken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            id: uid,
            rol: nrol,
            token: nuevoToken
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Token no valido',
            token: '' 
        })
    }

}

// RUTAS

const login = async(req,res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioBD = await Usuario.findOne({ email }); // email: email   ===   email
        if(!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        // si llegamos aqui es que tenemos un usuario con esos datos

        //Corregir este codigo para que valide bien
        //console.log(password, usuarioBD.password);
        const validPassword = bcrypt.compareSync( password, usuarioBD.password); // descifra para comparar
        //console.log(validPassword);
        // el error es que en la bd esta 1234 en vez de el tok
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT( usuarioBD._id, usuarioBD.rol );

        res.json({
            ok: true,
            msg: 'login',
            token,
            usuarioBD
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }

}

module.exports = { login, token };