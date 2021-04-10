const server = require("express").Router();
const nodemailer = require("nodemailer");
const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

const transport = {
  //configuración para enviar email

  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  }
});

let packageSent = (user = {}) => {
  transporter
    .sendMail({
      to: user.email,
      from: EMAIL_ADDRESS,
      subject: "Tus G4 Shirts ya están en camino!",
      html: `<h3>Hola ${user.name}, como estas?</h3>
        <p>Tu pedido llegará pronto a la siguiente dirección: ${user.street} ${user.number} en ${user.city}</p>`,
    })
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  packageSent,
};
