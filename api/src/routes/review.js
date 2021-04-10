const server = require("express").Router();
const { Review, User } = require("../db.js");

//Ruta para obtener todos los reviews
server.get("/", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    res.json(reviews);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para obtener un review exacto
server.get("/exact", async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const sendReview = await Review.findOne({
      where: {
        productId: productId,
        userId: userId,
      },
      include: [
        {
          model: User,
        },
      ],
    });
    if (sendReview === null) {
      res.send(
        "The review with the productId of " +
          productId +
          " and userId of " +
          userId +
          " was not found."
      );
    } else {
      res.json(sendReview);
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para crear un review -falta validar quizás que haya comprado
server.post("/create", async (req, res) => {
  try {
    const { title, description, stars, productId, userId } = req.body;
    const sendReview = await Review.findOne({
      where: {
        productId: productId,
        userId: userId,
      },
    });
    if (sendReview) {
      res.send("The user already has a review in that product.");
    } else {
      if (title && description && stars && productId && userId) {
        if (stars >= 1 && stars <= 5) {
          const createReview = await Review.create({
            title: title,
            description: description,
            stars: stars,
            productId: productId,
            userId: userId,
          });
          res.json(createReview);
        } else {
          res.send("Stars must be between 1 and 5.");
        }
      } else {
        res.send(
          "You must provide title, description and stars with the productId and userId."
        );
      }
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para actualizar un review
server.put("/update", async (req, res) => {
  try {
    const { title, description, stars, productId, userId } = req.body;
    if (productId && userId) {
      if (title || description || stars) {
        if (stars) {
          if (stars >= 1 && stars <= 5) {
            await Review.update(
              {
                title: title,
                description: description,
                stars: stars,
              },
              { where: { productId: productId, userId: userId } }
            );
            const latestReview = await Review.findOne({
              where: { productId: productId, userId: userId },
            });
            if (latestReview != null) {
              res.json(latestReview);
            } else {
              res.send(
                "The review with the productId of " +
                  productId +
                  " and userId of " +
                  userId +
                  " was not found."
              );
            }
          } else {
            res.send("Stars must be between 1 and 5. Nothing was updated.");
          }
        } else {
          await Review.update(
            {
              title: title,
              description: description,
              stars: stars,
            },
            { where: { productId: productId, userId: userId } }
          );
          const latestReview = await Review.findOne({
            where: { productId: productId, userId: userId },
          });
          if (latestReview != null) {
            res.json(latestReview);
          } else {
            res.send(
              "The review with the productId of " +
                productId +
                " and userId of " +
                userId +
                " was not found."
            );
          }
        }
      } else {
        res.send("You must provide at least a field.");
      }
    } else {
      res.send("You must provide productId and userId.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para eliminar un review
server.delete("/delete/", async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const reviewToDelete = await Review.destroy({
      where: {
        productId: productId,
        userId: userId,
      },
    });
    if (reviewToDelete > 0) {
      res.send(
        "The review with the productId of " +
          productId +
          " and userId of " +
          userId +
          " was deleted succesfully."
      );
    } else {
      res.send(
        "The review with the productId of " +
          productId +
          " and userId of " +
          userId +
          " was not found."
      );
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

module.exports = server;
