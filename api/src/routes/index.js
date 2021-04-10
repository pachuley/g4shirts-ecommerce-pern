const { Router } = require("express");

const productRouter = require("./product.js");
const orderRouter = require("./order.js");
const categoryRouter = require("./category.js");
const reviewRouter = require("./review.js");
const userRouter = require("./user.js");
const roleRouter = require("./role.js");
const emailRouter = require("./email.js");
const authRouter = require("./auth.js");
const mercadopagoRouter = require("./mercadopago.js");

const router = Router();

router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/categories", categoryRouter);
router.use("/reviews", reviewRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/email", emailRouter);
router.use("/auth", authRouter);
router.use("/mercadopago", mercadopagoRouter);

module.exports = router;
