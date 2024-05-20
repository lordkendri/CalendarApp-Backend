//* Controladores de las Rutas /routes/auth

// const express = require('express'); 
const { response } = require('express'); //* Para evitar usar express.response y mejorar la legibilidad

//? Libreria para encriptar contraseña
const bcrypt = require('bcryptjs');

const Usuario = require('../models//Usuario');
const { generarJWT } = require('../helpers/jwt');


//? Controladores
const crearUsuario = async (req, res = response) => {

    // console.log(req.body);
    const { email, password } = (req.body);

    try {
        //! Retorna un usuario con un email existente del a base de datos
        let usuario = await Usuario.findOne({ email });
        // console.log(usuario);

        //? Validacion de usuario por email
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo',
            })
        };

        //? Vuelve a instanciar el usuario anterior;
        usuario = new Usuario(req.body);

        //? Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //? promesa
        await usuario.save()

        //? Generar nuestro Json Web Token JWT
        const token = await generarJWT(usuario.id, usuario.name);

        return res.status(201).json({ //! Es conveniente tmb poner un return aqui
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        })//Respuesta

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        });
    }
};

const loginUsuario = async (req, res = response) => {

    const { email, password } = (req.body);

    try {

        const usuario = await Usuario.findOne({ email });

        //? Si el usuario no existe
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email',
            });
        };

        //? Confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password); //Regresa true, false

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        };

        //? Generar nuestro Json Web Token JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    };

};

const revalidarUsuario = async (req, res = response) => {

    const { uid, name } = req;

    //*Generar un nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token,
    })//Respuesta
};


//!Exportaciones en Node
module.exports = {
    crearUsuario, //crearUsuario:crearUsuario
    loginUsuario,
    revalidarUsuario,
};