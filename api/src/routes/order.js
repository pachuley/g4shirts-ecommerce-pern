const server = require("express").Router();
const { Order, OrderDetails, User, ProductSizes } = require("../db.js");
const Stripe = require("stripe");
const { succesfulCheckoutEmail } = require("../util/succesfulCheckoutEmail");
const { packageSent } = require("../util/packageSent");
const stripe = new Stripe(
  "sk_test_51IZ69ADth4KCYGlucibqbVZw605XIBYzYuGZsGWmL4ltS83pdwAtj3pV53V6T3UwVQ34kWWuNXT0vesJxcog0HBo00JQLZexAi"
);

//Ruta para obtener todas las ordenes con sus details
server.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
        },
        {
          model: OrderDetails,
          as: "OrderDetails",
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para actualizar un orden detail de una orden
server.get("/active/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orderId = await Order.findOrCreate({
      where: {
        userId: userId,
        state: "Active",
      },
    });
    if (!!orderId) {
      const latestOrder = await OrderDetails.findAll({
        where: {
          orderId: orderId[0].id,
        },
      });
      res.json(latestOrder);
    } else {
      res.send([]);
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para obtener a una orden exacta y su detail
server.get("/exact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sendOrder = await Order.findOne({
      include: [
        {
          model: OrderDetails,
          as: "OrderDetails",
        },
      ],
      where: {
        id: id,
      },
    });
    if (sendOrder != null) {
      res.json(sendOrder);
    } else {
      res.send("The order with the id of " + id + " was not found.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para obtener todas las ordenes en un mismo estado
server.get("/state/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const sendOrder = await Order.findAll({
      include: [
        {
          model: OrderDetails,
          as: "OrderDetails",
        },
      ],
      where: {
        state: state,
      },
    });
    if (sendOrder != null) {
      res.json(sendOrder);
    } else {
      res.send("No orders found.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para modificar el estado de una orden
server.put("/state/update/:id", async (req, res) => {
  try {
    const { state } = req.body;
    const { id } = req.params;
    await Order.update(
      { state: state },
      {
        where: {
          id: id,
        },
      }
    );
    res.send("The state with id: " + id + " was updated.");
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});
//Ruta para crear una orden y sus ordenes detail
server.post("/create", async (req, res) => {
  try {
    const { name, url, price, amount, size, productId, userId } = req.body;
    if (name && url && price && amount && size && productId && userId) {
      if (price.length === amount.length && price.length === productId.length) {
        const orderId = await Order.findOrCreate({
          where: {
            userId: userId,
            state: "Active",
          },
        });
        for (let i = 0; i < productId.length; i++) {
          await OrderDetails.create({
            name: name[i],
            url: url[i],
            price: price[i],
            amount: amount[i],
            size: size[i],
            productId: productId[i],
            userId: userId,
            orderId: orderId[0].id,
          });
        }
        res.send("Order created.");
      } else {
        res.send(
          "The length of price, size, amount, and productId must be the same."
        );
      }
    } else {
      res.send(
        "You need to provide name and url. The price, amount, size, productId and userId must be greater than 0."
      );
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para actualizar un orden detail de una orden
server.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, price } = req.body;
    if (amount > 0 || price >= 0) {
      const latestOrder = await OrderDetails.findOne({
        where: {
          id: id,
        },
      });
      if (latestOrder != null) {
        await OrderDetails.update(
          {
            price: price,
            amount: amount,
            size: size,
          },
          { where: { id: id } }
        );
        res.send("Order updated.");
      } else {
        res.send("The order with the id of " + id + " was not found.");
      }
    } else {
      res.send("You must provide price, amount or size.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para agregar un orden detail de una orden
server.post("/add", async (req, res) => {
  try {
    const { name, url, price, size, productId, userId } = req.body;
    if (name && url && price >= 0 && size && productId >= 0 && userId >= 0) {
      const orderId = await Order.findOrCreate({
        where: {
          userId: userId,
          state: "Active",
        },
      });
      const sizeAmount = await ProductSizes.findOne({
        where: {
          size: size,
          productId: productId,
        },
      });
      if (sizeAmount.stock > 0) {
        const order = await OrderDetails.findOrCreate({
          where: {
            name: name,
            url: url,
            price: price,
            size: size,
            productId: productId,
            orderId: orderId[0].id,
          },
        });
        if (order[1] === false) {
          await OrderDetails.increment(["amount"], {
            by: 1,
            where: {
              name: name,
              url: url,
              price: price,
              size: size,
              productId: productId,
              orderId: orderId[0].id,
            },
          });
        }
        res.send("OrderDetail created.");
      } else {
        res.send("Size lower than 0.");
      }
    } else {
      res.send("You must provide price, size, amount, productId and userId.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para agregar un orden detail de una orden
server.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id >= 0) {
      const deleted = await OrderDetails.destroy({
        where: {
          id: id,
        },
      });
      if (deleted) {
        res.send("The orderDetail was deleted.");
      } else {
        res.send("The orderDetail was not found.");
      }
    } else {
      res.send("You must provide an id equal or greater than 1.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para eliminar un orden detail de una orden
server.delete("/all/delete/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orderId = await Order.findOrCreate({
      where: {
        userId: userId,
        state: "Active",
      },
    });
    if (orderId) {
      await OrderDetails.destroy({
        where: {
          orderId: orderId[0].id,
        },
      });
      res.send("All the orderDetails were deleted.");
    } else {
      res.send("The email was not found.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para aumentar el amount de un orden detail
server.put("/amount/increment/", async (req, res) => {
  try {
    const { id, pid, size, amount } = req.body;
    const sendProduct = await ProductSizes.findOne({
      where: {
        productId: pid,
        size: size.toUpperCase(),
      },
    });
    if (id >= 1) {
      id, pid, size, amount;
      if (sendProduct.stock > amount) {
        const order = await OrderDetails.increment(["amount"], {
          by: 1,
          where: { id: id },
        });
        if (order) {
          res.send("OrderDetail amount was incremented.");
        } else {
          res.send("Order not found.");
        }
      } else {
        res.send("Stock not available.");
      }
    } else {
      res.send("You must provide an id equal or greater than 1.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para reducir el amount de un orden detail
server.put("/amount/decrement/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id >= 1) {
      const orderAux = await OrderDetails.findOne({
        where: {
          id: id,
        },
      });
      if (orderAux.amount > 1) {
        const order = await OrderDetails.decrement(["amount"], {
          by: 1,
          where: { id: id },
        });
        if (order) {
        res.send("OrderDetail amount was decremented.");
        } else {
          res.send("Order not found.");
        }
      } else {
        res.send("The quantity of an order cannot have a negative number");
      }
    } else {
      res.send("You must provide an id equal or greater than 1.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ordenes de un usuario en particular de acuerdo a su estado
server.get("/state/:stateName/:userId", async (req, res) => {
  try {
    const { stateName, userId } = req.params;
    const state = stateName.charAt(0).toUpperCase() + stateName.slice(1);
    const orderId = await Order.findOrCreate({
      where: {
        userId: userId,
        state: state,
      },
    });
    if (orderId) {
      const latestOrder = await OrderDetails.findAll({
        where: {
          orderId: orderId[0].id,
        },
        order: [["id", "ASC"]],
      });
      res.json(latestOrder);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

server.post("/checkout", async (req, res) => {
  const { userId, userEmail, orderId, paymentId, total } = req.body;
  try {
    await stripe.paymentIntents.create({
      amount: total,
      currency: "USD",
      description: "Gaming Keyboard",
      payment_method: paymentId,
      confirm: true,
    });
    const orders = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderDetails,
          as: "OrderDetails",
        },
      ],
    });
    for (let i = 0; i < orders.OrderDetails.length; i++) {
      await ProductSizes.decrement(["stock"], {
        by: orders.OrderDetails[i].amount,
        where: {
          productId: orders.OrderDetails[i].productId,
          size: orders.OrderDetails[i].size,
        },
      });
    }
    await Order.update(
      {
        state: "Pending",
      },
      { where: { id: orderId } }
    );
    await Order.findOrCreate({
      where: {
        userId: userId,
        state: "Active",
      },
    });
    succesfulCheckoutEmail(userEmail);
    res.send("The payment was successful.");
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

//Ordenes de un usuario en particular de acuerdo a su estado
server.get("/filterState/:state/:userId", async (req, res) => {
  try {
    const { state, userId } = req.params;
    const sendOrder = await Order.findAll({
      include: [
        {
          model: OrderDetails,
          as: "OrderDetails",
        },
      ],
      where: {
        state: state,
        userId: userId,
      },
    });
    if (sendOrder != null) {
      res.json(sendOrder);
    } else {
      res.send("Not orders found.");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

server.get("/filter/:state", async (req, res) => {
  try {
    const { state } = req.params;
    if (state !== "All") {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
          },
          {
            model: OrderDetails,
            as: "OrderDetails",
          },
        ],
        where: {
          state: state,
        },
      });
      if (orders != null) {
        res.json(orders);
      } else {
        res.send("No orders found.");
      }
    } else {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
          },
          {
            model: OrderDetails,
            as: "OrderDetails",
          },
        ],
      });
      if (orders != null) {
        res.json(orders);
      } else {
        res.send("No orders found.");
      }
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

//Ruta para completar la Orden
server.post("/complete", async (req, res) => {
  const { orderId, user } = req.body;
  try {
    packageSent(user, orderId);
    await Order.update(
      {
        state: "Complete",
      },
      { where: { id: orderId } }
    );
    res.send("The order is completed");
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

module.exports = server;
