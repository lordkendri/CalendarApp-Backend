//Todos tienen que pasar la validacion del token
const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

const { getEventos, crearEventos, actualizarEventos, eliminarEventos } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validarCampos');
const { isDate } = require('../helpers/isDate');

//?Para usar validarJWT en cada uno de los routers sin tener que poner el middleware en cada uno abajo de router.use()
router.use(validarJWT);

//?EndPoints \

router.get('/', getEventos);
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha final es obligatoria').custom(isDate),
    validarCampos
], crearEventos);
router.put('/:id', actualizarEventos);
router.delete('/:id', eliminarEventos);

module.exports = router;