const server = require("express").Router();
const { succesfulCheckoutEmail } = require("../util/succesfulCheckoutEmail");
const { Order, OrderDetails, ProductSizes } = require("../db.js");

const { MercadoPagoController } = require("../controllers/mercadopago");

server.post("/", MercadoPagoController);

server.post("/checkout", async (req, res) => {
  const { userId, userEmail, orderId } = req.body;
  try {
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
    //todo order active
  } catch (err) {
    res.send(err);
  }
});

module.exports = server;
