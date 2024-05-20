// Ruta del Auth
// host + api/auth

//! Importaciones en Node
const { Router } = require('express');
const { check } = require('express-validator')

const { crearUsuario, loginUsuario, revalidarUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

//? Endpoints
router.post(
    '/new',
    [//? middlewares de express-validators
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario
);

router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ]
    , loginUsuario
);

router.get('/renew', validarJWT, revalidarUsuario);

//! Exportacion Node
module.exports = router;