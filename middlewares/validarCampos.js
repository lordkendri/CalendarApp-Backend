//* Customs MiddleWares

const { response } = require('express');
const { validationResult } = require('express-validator')

const validarCampos = (req, res = response, next) => {

    //? Manejo de errores con express-validetor
    const errors = validationResult(req);
    // console.log(errors);

    //? Devuelve el error y evita que se ejecute la siguiente parte de la funcion
    if (!errors.isEmpty()) {
        return res.status(400).json({ //! Se requiere SIEMPRE usar return en los errores e incluso en las funciones normales by the case
            ok: false,
            errors: errors.mapped()
        });
    };

    //? Para activar la siguiente funcion
    next();
};

module.exports = {
    validarCampos,
}