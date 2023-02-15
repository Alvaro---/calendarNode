//Para tener el tipado
const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
    console.log("se solicita el /")
    // console.log(req)
    const { name, email, password } = req.body

    try {

        // let usuario = Usuario.findOne({email: email})
        let usuario = await Usuario.findOne({ email })
        // console.log(usuario)

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Ese correo ya esta registrado"
            })
        }
        usuario = new Usuario(req.body);

        //encriptar contraseña //10 por defecto
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        //generar token
        const token = await generarJWT(usuario.id, usuario. name);

        //VALIDACION MANUAL. MEJOR USR EXPERSS VALIDATOR
        // if(name.length<5){
        //     return res.status(400).json({
        //         ok:false,
        //         msg:"el nombre dele tener al menos 5 letras"
        //     })
        // }

        //MANEJO DE ERRORRES EXPRESS VALIDATOR
        // const errors = validationResult(req)
        // console.log(errors)
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({
        //         ok: false,
        //         errors: errors.mapped()
        //     })
        // }


        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        })
    }
}


const loginUsuario = async (req, res = response) => {
    console.log("se solicita el /")
    const { email, password } = req.body
    //PASA AL CUSTOM MIDDLEWARE
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     })
    // }

    try {
        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario no existe"
            })
        }
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "constraseña incorrecta"
            })
        }

        //generar token
        const token = await generarJWT(usuario.id, usuario. name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log("error");
        res.json({
            ok: false,
            msg: "hable con el adminsitrador"
        })
    }
}

const revalidarToken = async(req, res) => {

    const uid=req.uid;
    const name=req.name;

    //generar nuevo jwt
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid, name,
        token,
        msg: 'renew'
    })
}

module.exports = {
    crearUsuario: crearUsuario,
    loginUsuario,
    revalidarToken
}