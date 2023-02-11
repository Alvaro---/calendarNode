const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    //x-token
    const token = req.header('x-token')
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "no hay token en la validacion"
        })
    }

    try {
        const payload = jwt.verify(
            token, 
            process.env.SECRET_JWT_SEED
        );

        // console.log(payload)

        req.uid=payload.id;
        req.name=payload.name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no valido"
        })
    }
    console.log(token)
    next()
}

module.exports = {
    validarJWT
}