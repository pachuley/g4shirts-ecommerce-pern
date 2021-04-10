const server = require("express").Router();
const { Role, User } = require("../db.js");

//Ruta para mostrar todos los roles
server.get("/", async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para crear un rol
server.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdRole = await Role.create({
      name: name,
      description: description,
    });
    res.json(createdRole);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para eliminar un rol
server.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Role.destroy({
      where: {
        id: id,
      },
    });
    res.send("The role with id: " + id + " was deleted.");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para modificar un rol
server.put("/update/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    await Role.update(
      { name: name, description: description },
      {
        where: {
          id: id,
        },
      }
    );
    res.send("The role with id: " + id + " was updated.");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

module.exports = server;
