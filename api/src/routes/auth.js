const server = require("express").Router();
const { Category, Product } = require("../db.js");
const { check } = require("express-validator");

const { validarCampos } = require("./../middlewares/validar-campos");

const { login, googleSignin } = require("./../controllers/auth");

// server.post('/login',[
//     check('correo', 'El correo es obligatorio').isEmail(),
//     check('password', 'La contraseña es obligatoria').not().isEmpty(),
//     validarCampos
// ],login );

server.post(
  "/google",
  [
    check("id_token", "The id_token is required.").not().isEmpty(),
    validarCampos,
  ],
  googleSignin
);

module.exports = server;
