const server = require("express").Router();
const { Category, Product } = require("../db.js");

//Ruta para mostrar todas las categorias
server.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para obtener una categoría exacto
server.get("/exact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sendCategory = await Category.findOne({
      where: {
        id: id,
      },
    });
    if (sendCategory === null) {
      res.send("The category with the id of " + id + " was not found.");
    }
    res.json(sendCategory);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para crear una categoría
server.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdCategory = await Category.create({
      name: name,
      description: description,
    });
    res.json(createdCategory);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para eliminar una categoría
server.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Category.destroy({
      where: {
        id: id,
      },
    });
    res.send("The category with id: " + id + " was deleted.");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para modificar una categoría
server.put("/update/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    await Category.update(
      { name: name, description: description },
      {
        where: {
          id: id,
        },
      }
    );
    res.send("The category with id: " + id + " was updated.");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para dado un id de producto me devuelve sus categorias
server.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Category.findAll({
      include: { model: Product, where: { id: id } },
    });
    res.json(categories);
  } catch (error) {
    res.send(err.message);
    console.log(error.message);
  }
});
module.exports = server;
