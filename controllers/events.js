const { response } = require('express');
const Eventos = require('../models/Eventos');

const getEventos = async (req, res = response) => {

    const eventos = await Eventos.find()
        //* Si se quiere agregar campos es del a sig manera: "name password email etc.."
        .populate('user', "name"); //? Filtra de Eventos.user todo lo que no sea -id(este siempre viene ) y el name

    return res.status(201).json({
        ok: true,
        eventos,
    })
};

const crearEventos = async (req, res = response) => {

    const evento = new Eventos(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        return res.status(201).json({
            ok: true,
            evento: eventoGuardado,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarEventos = async (req, res = response) => {
    //? Extrae el id de la ruta
    const eventoId = req.params.id;

    const uid = req.uid;

    try {

        const evento = await Eventos.findById(eventoId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe por ese ID"
            })
        };


        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "Permisos insuficientes"

            });
        };

        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Eventos.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        return res.status(201).json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    };

};

const eliminarEventos = async (req, res = response) => {
    //? Extrae el id de la ruta
    const eventoId = req.params.id;

    const uid = req.uid;

    try {

        const evento = await Eventos.findById(eventoId)
    
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe por ese ID"
            })
        };


        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "Permisos insuficientes"

            });
        };

        await Eventos.findByIdAndDelete(eventoId);

        return res.status(201).json({
            ok: true,
            msg: "Evento eliminado"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    };

};

module.exports = {
    getEventos,
    crearEventos,
    actualizarEventos,
    eliminarEventos,
}