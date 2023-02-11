const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', "name");

    return res.status(200).json({
        ok: true,
        msg: "get eventos",
        eventos
    })
};

const crearEvento = async (req, res = response) => {

    //verificar el evento
    console.log(req.body)

    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save()
        return res.status(200).json({
            ok: true,
            msg: "Evento guardado",
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Hable con el adminsitrador"
        })
    }

};

const actualizarEvento = async (req, res = response) => {
    const eventId = req.params.id;
    // console.log(eventId)
    try {
        const evento = await Evento.findById(eventId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe para ese ID"
            });
        }

        // console.log("Eventoooo", evento)
        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: "no tiene privilegio de edicion"
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        // Retorna siempre el viejo evento
        // const eventoActualizado = await Evento.findByIdAndUpdate(eventId, nuevoEvento);
        //Retornar el evento ya actualiado
        const eventoActualizado = await Evento.findByIdAndUpdate(eventId, nuevoEvento, { new: true });

        return res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log("ERROR", error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
    return res.status(200).json({
        ok: true,
        msg: "actualizar eventosss",
        id: eventId
    })
};

const eliminarEvento = async (req, res = response) => {
    const eventId = req.params.id;
    console.log(eventId)
    try {
        const evento = await Evento.findById(eventId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe para ese ID"
            });
        }

        // console.log("Eventoooo", evento)
        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: "no tiene privilegio para eliminar"
            })
        }

        const eventoEliminado = await Evento.findByIdAndDelete(eventId);

        return res.json({
            ok: true,
            evento: eventoEliminado
        })

    } catch (error) {
        console.log("ERROR", error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }

};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}