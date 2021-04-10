const server = require("express").Router();
const fileUpload = require("express-fileupload");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  Product,
  ProductCategories,
  Category,
  Review,
  ProductSizes,
  ProductPhotos,
  User,
  conn,
} = require("../db.js");
const { Op } = require("sequelize");
const { API_URL } = process.env;

//Ruta para obtener todos los productos
server.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        active: true,
      },
      include: [
        {
          model: ProductPhotos,
          as: "ProductPhotos",
        },
        {
          model: ProductSizes,
          as: "ProductSizes",
        },
        {
          model: Category,
        },
        {
          model: Review,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
      order: [[ProductPhotos, "id", "asc"]],
    });
    res.json(products);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para obtener un producto exacto
server.get("/exact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sendProduct = await Product.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: ProductPhotos,
          as: "ProductPhotos",
        },
        {
          model: ProductSizes,
          as: "ProductSizes",
        },
        {
          model: Category,
        },
        {
          model: Review,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });
    if (sendProduct === null) {
      res.send("The product with the id of: " + id + " was not found.");
    }
    res.json(sendProduct);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para obtener un producto exacto
server.get("/stock/:id/:size", async (req, res) => {
  try {
    const { id, size } = req.params;
    const sendProduct = await ProductSizes.findOne({
      where: {
        productId: id,
        size: size.toUpperCase(),
      },
    });
    if (sendProduct === null) {
      res.send("The product with the id of: " + id + " was not found.");
    }
    res.json(sendProduct.stock);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para buscar un producto con match
/* server.get("/search/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const sendProduct = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
    if (sendProduct === null) {
      res.send("We didn't matched any product name.");
    }
    res.json(sendProduct);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
}); */

//Fileupload - Carga de archivos
server.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

//Ruta para crear un producto
server.post("/create", async (req, res) => {
  let files;
  let images = [];
  let image = true;

  if (!req.files || Object.keys(req.files).length === 0) {
    image = false;
  } else {
    files = req.files;

    for (const property in files) {
      let imageFile = files[property];

      const nombreCortado = imageFile.name.split(".");
      const extension = nombreCortado[nombreCortado.length - 1];

      const nombreTemp = uuidv4() + "." + extension;

      images.push(nombreTemp);

      const uploadPath = __dirname + "../../../uploads/" + nombreTemp;

      imageFile.mv(uploadPath, function (err) {
        if (err) {
          image = false;
        }
      });
    }
  }

  let message = "";
  let transaction = await conn.transaction();
  const { name, description, price, sizes, stock, categories } = req.body;
  try {
    const [product, created] = await Product.findOrCreate({
      where: { name: name },
      defaults: {
        description: description,
        price: price,
      },
      transaction,
    });
    if (created) {
      message = "Product created";
      if (categories) {
        const array_categories = categories.split(",");

        for (let i = 0; i < array_categories.length; i++) {
          const category = await Category.findOne({
            where: { id: array_categories[i] },
          });
          if (category === null) {
            message += `, the category with the id of ${array_categories[i]} does not exist`;
          } else {
            const [
              productCategories,
              created,
            ] = await ProductCategories.findOrCreate({
              where: { categoryId: array_categories[i], productId: product.id },
              defaults: {
                categoryId: array_categories[i],
                productId: product.id,
              },
              transaction,
            });
            if (created) {
              message += `, the category with the id of ${array_categories[i]} was linked`;
            } else {
              message += `, the category with the id of ${array_categories[i]} was linked before`;
            }
          }
        }
      } else {
        message += ", no categories were linked";
      }
      if (sizes && stock) {
        const array_sizes = sizes.split(",");
        const array_stock = stock.split(",");

        for (let i = 0; i < array_sizes.length; i++) {
          const [productCategories, created] = await ProductSizes.findOrCreate({
            where: { size: array_sizes[i], productId: product.id },
            defaults: {
              size: array_sizes[i],
              productId: product.id,
              stock: parseInt(array_stock[i]),
            },
            transaction,
          });
          if (created) {
            message += `, the size ${sizes[i]} was linked`;
          } else {
            message += `, the size ${sizes[i]} was linked before`;
          }
        }
      } else {
        message += ", no sizes were linked";
      }
      if (image) {
        for (let i = 0; i < images.length; i++) {
          let url = `${API_URL}/products/image/${images[i]}`;

          const [productPhotos, created] = await ProductPhotos.findOrCreate({
            where: { url },
            defaults: {
              url: url,
              productId: product.id,
            },
            transaction,
          });
          if (created) {
            message += `, the photo ${url} was linked`;
            console.log(message);
          } else {
            message += `, the photo ${url} was linked before`;
            console.log(message);
          }
        }
      }
      // else if (photos) {
      //   for (let i = 0; i < photos.length; i++) {
      //     const [productPhotos, created] = await ProductPhotos.findOrCreate({
      //       where: { url: photos[i] },
      //       defaults: {
      //         url: photos[i],
      //         productId: product.id,
      //       },
      //       transaction,
      //     });
      //     if (created) {
      //       message += `, the photo ${photos[i]} was linked`;
      //       console.log(message);
      //     } else {
      //       message += `, the photo ${photos[i]} was linked before`;
      //       console.log(message);
      //     }
      //   }
      // }
    } else {
      message = "That product is already in the database.";
    }
    await transaction.commit();
    return res.json({
      message: message,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    return res.json({
      message: error.message,
    });
  }
});

server.get("/image/:image", async (req, res) => {
  res.sendFile(path.join(__dirname, "./../../uploads/" + req.params.image));
});

server.get("/photo/:image", async (req, res) => {
  res.sendFile(path.join(__dirname, "./../../photos/" + req.params.image));
});

//Ruta para eliminar un producto
server.delete("/delete/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const productToDelete = await Product.update(
      { active: false },
      { where: { id: productId } }
    );
    if (productToDelete > 0) {
      res.send(
        "The product with the id of: " + productId + " was deleted succesfully."
      );
    } else {
      res.send("The product with the id of: " + productId + " was not found.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para actualizar un producto
server.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (name || description || price) {
      await Product.update(
        {
          name: name,
          description: description,
          price: price,
        },
        { where: { id: id } }
      );
      const latestProduct = await Product.findOne({ where: { id: id } });
      if (latestProduct != null) {
        res.json(latestProduct);
      } else {
        res.send("The product with the id of: " + id + " was not found.");
      }
    } else {
      res.send("You must provide at least a field.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para actualizar el stock de un size de un producto
server.put("/stock/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, size } = req.body;

    if (stock && size) {
      const latestProduct = await ProductSizes.findOne({ where: { id: id } });
      if (latestProduct) {
        await ProductSizes.update(
          {
            stock: stock,
          },
          { where: { productId: id, size: size } }
        );
        res.send(
          "The stock of the size " +
            size +
            " in the productId of " +
            id +
            " was updated succesfully."
        );
      } else {
        res.send("The product_size with the id of: " + id + " was not found.");
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para traer los productos de una categoría
server.get("/category/all/:id", async (req, res) => {
  const { id } = req.params;
  const products = await Product.findAll({
    include: [
      {
        model: ProductPhotos,
        as: "ProductPhotos",
      },
      {
        model: ProductSizes,
        as: "ProductSizes",
      },
      {
        model: Category,
        where: { id: id },
      },
      {
        model: Review,
        include: [
          {
            model: User,
          },
        ],
      },
    ],
    order: [[ProductPhotos, "id", "asc"]],
  });
  if (products) {
    res.json(products);
  } else {
    res.send("Products not found with that category.");
  }
});

//Ruta para asignar una categoría de un producto
server.post("/category/add/:pid/:cid", async (req, res, next) => {
  try {
    const { pid, cid } = req.params;
    const createdRelation = await ProductCategories.create({
      productId: pid,
      categoryId: cid,
    });
    res.send(createdRelation);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para eliminar una categoria de un producto
server.delete("/category/delete/:pid/:cid", async (req, res) => {
  try {
    const { pid, cid } = req.params;
    await ProductCategories.destroy({
      where: {
        productId: pid,
        categoryId: cid,
      },
    });
    res.send(
      "The category with id: " +
        categoryId +
        " no longer belongs to product with id: " +
        productId
    );
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

module.exports = server;
