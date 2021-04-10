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

let succesfulCheckoutEmail = (userEmail = "") => {
  transporter
    .sendMail({
      to: userEmail,
      from: EMAIL_ADDRESS,
      subject: "G4 Shirts - Compra realizada exitosa!",
      html: `<!DOCTYPE html>
        <html>
        
        <head>
          <meta charset='utf-8'>
          <meta name='viewport' content='width=device-width, initial-scale=1'>
        </head>
        
        <body style=" font-family: 'Open Sans', 'Arial Narrow', Arial, sans-serif; ">
          <div
            <h1>Felicitaciones tus G4 Shirts llegarán pronto</h1>
          </div>
        </body>
        
        </html>`,
    })
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  succesfulCheckoutEmail,
};
