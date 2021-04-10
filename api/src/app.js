const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const passport = require("./routes/passport");
const cors = require("cors");
const firma = "ecomerce04";
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { CLIENT_URL } = process.env;

require("./db.js");

const server = express();

server.name = "API";

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${CLIENT_URL}`); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});
server.use(passport.initialize());
server.all("*", function (req, res, next) {
  let token2 =
    req.headers.authorization &&
    req.headers.authorization.replace(/['"]+/g, "");
  token2 = token2 && token2.slice(7, token2.length - 1);
  if (token2) {
    let payload2 = jwt.decode(token2, firma);
    if (payload2 && payload2.exp <= moment().unix()) {
      return res.status(401).send({ message: "Token expirado" });
    }
  }
  next();
});
server.all("*", function (req, res, next) {
  passport.authenticate("bearer", function (err, user) {
    if (err) return next(err);
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
});
server.use("/", routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
