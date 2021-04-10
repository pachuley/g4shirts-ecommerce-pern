const server = require("express").Router();
const { User, Role, Review, Order, OrderDetails } = require("../db.js");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { passwordReset } = require("../util/passwordReset");
const firma = "ecomerce04";
const saltRounds = 12;
const messagePassword =
  "The password must have a minimum of 8 characters and maximum 16 characters, at least 1 upper and lower case letter, also 1 number and 1 special character. Without blank spaces.";
// Email con caracteres latinos
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
// Contraseña con su tipo aclarada en messagePassword
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,16}$/;

//Ruta para obtener todos los usuarios
server.get("/", async (req, res) => {
  try {
    if (req.user && req.user.role == "admin") {
      const allUsers = await User.findAll({ include: { model: Role } });
      res.json(allUsers);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para obtener todos los usuarios
server.get("/exact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sendUser = await User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Review,
        },
        {
          model: Order,
          include: [
            {
              model: OrderDetails,
            },
          ],
        },
      ],
    });
    return res.json(sendUser);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para ver si existe el usuario y de ser así que su e-mail y contraseña sean validos
server.post("/login", async function (req, res, next) {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    else if (!user) return res.sendStatus(401);
    else {
      const { cart, email } = req.body;
      const userData = await User.findOne({
        where: {
          email: email,
        },
      });
      if (userData.roleId === 2) {
        const newOrder = await Order.findOne({
          where: {
            userId: userData.id,
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
      return res.json({
        token: jwt.sign(user, firma, { expiresIn: "365d" }),
        userData,
      });
    }
  })(req, res, next);
});

//Ruta para registrar un usuario y linkear sus orderdetails si es que tenia del localstorage
server.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      surname,
      birthday,
      country,
      state,
      city,
      postalcode,
      street,
      number,
      cart,
    } = req.body;
    let emailRepetido;
    if (email) {
      emailRepetido = await User.findOne({ where: { email: email } }); //Para chequear que no exista ya ese mail
    }
    if (!emailRepetido) {
      if (
        email &&
        password &&
        name &&
        surname &&
        birthday &&
        country &&
        state &&
        city &&
        postalcode &&
        street &&
        number
      ) {
        //Validamos que vengan todos los campos
        if (emailRegex.test(email) && passwordRegex.test(password)) {
          //Validamos que email y password cumplan parametros
          const hash = bcrypt.hashSync(password, saltRounds); //Hasheamos la contraseña
          const newUser = await User.create({
            email: email,
            password: hash,
            name: name,
            surname: surname,
            birthday: birthday,
            country: country,
            state: state,
            city: city,
            postalcode: postalcode,
            street: street,
            number: number,
            roleId: 2,
          });
          const id = newUser.id;
          if (newUser) {
            const newOrder = await Order.create({
              userId: id,
              state: "Active",
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
          res.send("Registered succesfully.");
        } else {
          //Validamos el campo que no se cumplio para mandar un mensaje acorde
          {
            !emailRegex.test(email) && !passwordRegex.test(password)
              ? res.status(400).send("Email and password incorrect.")
              : !emailRegex.test(email)
              ? res.send(
                  "Email must be a valid email. Example: user123@mail.com."
                )
              : !passwordRegex.test(password)
              ? res.send(messagePassword)
              : null;
          }
        }
      } else {
        res.send("All fields are required.");
      }
    } else {
      res.send("There is already an account linked to this email address.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para actualizar un usuario
server.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      password,
      name,
      surname,
      birthday,
      country,
      state,
      city,
      postalcode,
      street,
      number,
    } = req.body;
    const user = await User.findOne({ where: { id: id } });
    let emailRepetido2;
    if (email) {
      emailRepetido2 = await User.findOne({ where: { email: email } }); //Para chequear que no exista ya ese mail
    }
    if (user && req.user) {
      //validamos que el id de usuario haya sido valido
      if (
        email ||
        password ||
        name ||
        surname ||
        birthday ||
        country ||
        state ||
        city ||
        postalcode ||
        street ||
        number
      ) {
        //Validamos que venga al menos un campo
        if (!emailRepetido2 && email && password) {
          //Condicionales if else if para validar dependiendo de que venga en body
          if (emailRegex.test(email) && passwordRegex.test(password)) {
            //Validamos parametros
            const hash = bcrypt.hashSync(password, saltRounds); //Hasheamos la contraseña
            await User.update(
              {
                email: email,
                password: hash,
                name: name,
                surname: surname,
                birthday: birthday,
                country: country,
                state: state,
                city: city,
                postalcode: postalcode,
                street: street,
                number: number,
              },
              { where: { id: id } }
            ).then(res.send("Updated sucessfully."));
          } else {
            res.send("Email or password incorrect.");
          }
        } else if (!emailRepetido2 && email) {
          if (emailRegex.test(email)) {
            await User.update(
              {
                email: email,
                name: name,
                surname: surname,
                birthday: birthday,
                country: country,
                state: state,
                city: city,
                postalcode: postalcode,
                street: street,
                number: number,
              },
              { where: { id: id } }
            ).then(res.send("Updated sucessfully."));
          } else {
            res.send("Email must be a valid email. Example: user123@mail.com.");
          }
        } else if (password && !emailRepetido2) {
          if (passwordRegex.test(password)) {
            const hash = bcrypt.hashSync(password, saltRounds);
            await User.update(
              {
                email: email,
                password: hash,
                name: name,
                surname: surname,
                birthday: birthday,
                country: country,
                state: state,
                city: city,
                postalcode: postalcode,
                street: street,
                number: number,
              },
              { where: { id: id } }
            ).then(res.send("Updated sucessfully."));
          } else {
            res.send(messagePassword);
          }
        } else if (!emailRepetido2) {
          await User.update(
            {
              email: email,
              name: name,
              surname: surname,
              birthday: birthday,
              country: country,
              state: state,
              city: city,
              postalcode: postalcode,
              street: street,
              number: number,
            },
            { where: { id: id } }
          ).then(res.send("Updated sucessfully."));
        } else {
          res.send("There is already an account linked to this email address.");
        }
      } else {
        res.send("At least one field is required.");
      }
    } else {
      res.send("User not found.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para chequear si el user es admin (sin hacer)
server.get("/admin", async (req, res) => {
  try {
    if (req.user) {
      if (req.user.role == "admin") {
        res.send("The user is admin.");
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para eliminar un usuario
server.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let userToDelete;
    userToDelete = await User.destroy({
      where: {
        id: id,
      },
    });

    if (userToDelete) {
      res.send("The user with the id of: " + id + " was deleted succesfully.");
    } else {
      res.send("The user with the id of: " + id + " was not found.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//------- RUTAS RELACIONADAS CON EL ROL DEL USUARIO -------

//Ruta para asignarle un rol a un usuario
server.put("/role/:roleId/:userId", async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    await User.update(
      {
        roleId: roleId,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    res.send(
      "The user with id of: " +
        userId +
        " was changed to the role with the id of: " +
        roleId +
        "."
    );
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para promover a un usuario (hacerlo Admin) SUPONIENDO QUE EL ROL ADMIN POSEE EL ID 1
server.put("/promote/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await User.update(
      {
        roleId: 1,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    res.send("The user with id of: " + userId + " was promoted to admin.");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para promover a un usuario (hacerlo Admin) SUPONIENDO QUE EL ROL ADMIN POSEE EL ID 1
server.put("/degrade/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await User.update(
      {
        roleId: 2,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    res.send("The admin with id of: " + userId + " was degraded to user.");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

server.get("/me", async (req, res) => {
  if (req.user) {
    const {
      id,
      role,
      order,
      email,
      name,
      surname,
      birthday,
      country,
      state,
      city,
      postalcode,
      street,
      number,
    } = req.user;
    if (order) {
      const ordenDetails = await Order.findOne({
        include: [
          {
            model: OrderDetails,
            as: "OrderDetails",
          },
        ],
        where: {
          id: order.id,
        },
      });
    }
    res.json({
      id,
      role,
      order: order.id ? ordenDetails : null,
      email,
      name,
      surname,
      birthday,
      country,
      state,
      city,
      postalcode,
      street,
      number,
    });
  } else {
    res.sendStatus(401);
  }
});

server.put("/passwordChange/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password, oldPassword } = req.body;

  const user = await User.findOne({ where: { id: id, email: email } });

  if (!!user) {
    if (bcrypt.compareSync(oldPassword, user.password)) {
      const hash = bcrypt.hashSync(password, saltRounds);
      const passwordChange = await User.update(
        { password: hash },
        { where: { id: id, email: email } }
      )
        .then(res.send("Update succesfully"))
        .catch((err) => console.log(err));
    } else {
      res.send("Password anterior incorrecta");
    }
  } else {
    res.send("Usuario no encontrado");
  }
});

server.put("/passwordReset/:userId", async (req, res) => {
  const { newPassword } = req.body;
  const { userId } = req.params;
  const user = await User.findOne({ where: { id: userId } });

  if (!!user) {
    const hash = bcrypt.hashSync(newPassword, saltRounds);
    const passwordChange = await User.update(
      { password: hash },
      { where: { id: userId } }
    )
      .then(res.send("Update succesfully"))
      .catch((err) => console.log(err));
  } else {
    res.send("Usuario no encontrado");
  }
});

server.post("/passwordLinkReset", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });
    if (user) {
      passwordReset(user);
      res.send(`Email sent to ${userEmail}.`);
    } else {
      res.send(`User with the email of: ${userEmail} not found.`);
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

module.exports = server;
