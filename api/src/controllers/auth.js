const { response } = require("express");
const bcryptjs = require("bcryptjs");

//const { User } = require('./../db');

const { User, Order, OrderDetails } = require("./../db");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("./../helpers/google-verify");

// const login = async(req, res = response) => {

//     const { email, password } = req.body;

//     try {

//         // Verificar si el email existe
//         let user = await User.findOne({ where: { email } });

//         if ( !user ) {
//             return res.status(400).json({
//                 message: 'Usuario / Password no son correctos - correo'
//             });
//         }

//         // Si el usuario está activo
//         if ( !user.active ) {
//             return res.status(400).json({
//                 message: 'Usuario / Password no son correctos - estado: false'
//             });
//         }

//         // Verificar la contraseña
//         const validPassword = bcryptjs.compareSync( password, user.password );
//         if ( !validPassword ) {
//             return res.status(400).json({
//                 message: 'Usuario / Password no son correctos - password'
//             });
//         }

//         // Generar el JWT
//         const token = await generarJWT(user.id);

//         res.json({
//             user,
//             token
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Hable con el administrador'
//         });
//     }

// }

const googleSignin = async (req, res = response) => {
  const { id_token, cart } = req.body;

  try {
    const { name, givenName, familyName, email, imageUrl } = await googleVerify(
      id_token
    );

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const data = {
        name: givenName
          ? givenName
          : name.split(" ")[0]
          ? name.split(" ")[0]
          : name,
        surname: familyName
          ? familyName
          : name.split(" ")[1]
          ? name.split(" ")[1]
          : null,
        email,
        imageUrl: imageUrl ? imageUrl : null,
        roleId: 2,
        google: true,
      };

      user = await User.create(data);

      const newOrder = await Order.create({
        userId: user.id,
        state: "Active",
      });
    }

    if (!user.active) {
      return res.status.json({
        message: "Hable con el administrador, usuario bloqueado",
      });
    }

    //----------------------------------------------------------------
    if (user.roleId === 2) {
      const newOrder = await Order.findOne({
        where: {
          userId: user.id,
          state: "Active",
        },
      });
      if (cart && cart.length >= 0) {
        for (let i = 0; i < cart.length; i++) {
          await OrderDetails.create({
            name: cart[i].name,
            url: cart[i].url,
            price: cart[i].price,
            amount: cart[i].amount,
            size: cart[i].size,
            productId: cart[i].productId,
            orderId: newOrder.id,
          });
        }
      }
    }

    // Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      userData: user,
      token,
    });

    //res.json({message: "Vamos bien"});
  } catch (error) {
    res.status(400).json({
      message: "Token de Google no es válido",
    });
  }
};

module.exports = {
  //login,
  googleSignin,
};
