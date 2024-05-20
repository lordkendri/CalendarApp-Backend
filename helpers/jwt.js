const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise((res, rej) => {

        const payload = { uid, name }

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                rej('No se pudo generar el token');
            };

            res(token);
        });

    });
};

module.exports = {
    generarJWT,
};