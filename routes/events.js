/*
    /api/events
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validarCampos')
const router = Router();
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
//Validara los tokens para todas las rutas
router.use(validarJWT);


router.get('/', getEventos)

router.post(
    '/new',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoriaaaa').custom(isDate),
        check('end', 'Fecha de fin es obligatoriaaaa').custom(isDate),
        validarCampos
    ],
    crearEvento)

router.put('/update/:id', actualizarEvento)

router.delete('/delete/:id', eliminarEvento)

module.exports = router;