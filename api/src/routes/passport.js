const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const firma = "ecomerce04";
const jwt = require("jsonwebtoken");
const { User, Role, Order } = require("../db.js");
const bcrypt = require("bcrypt");

//Aqui se debe actualizar el orden del usuario con los detalles de la orden
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async function (email, password, done) {
      const user = await User.findOne({
        include: [
          {
            model: Role,
          },
        ],
        where: { email: email },
      });
      if (!user) return done(null, false);
      if (!bcrypt.compareSync(password, user.password))
        return done(null, false);
      const {
        id,
        name,
        surname,
        birthday,
        country,
        state,
        city,
        postalcode,
        street,
        number,
        role,
      } = user;
      return done(null, {
        id,
        email,
        role: role ? role.name : role,
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
    }
  )
);

passport.use(
  new BearerStrategy(function (token, done) {
    jwt.verify(token, firma, function (err, user) {
      if (err) return done(err);
      return done(null, user ? user : false);
    });
  })
);

module.exports = passport;
