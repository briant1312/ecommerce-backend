const express = require("express");
const router = express.Router();
const ordersCtrl = require("../controllers/orders");
const checkToken = require("../config/checkToken");
const ensureLoggedIn = require("../config/ensureLoggedIn");

router.get("/", checkToken, ensureLoggedIn, ordersCtrl.getUserCompletedOrders);
router.get("/cart", checkToken, ensureLoggedIn, ordersCtrl.getUserCart);
router.get("/count/:orderId", checkToken, ensureLoggedIn, ordersCtrl.getItemCount);
router.get("/items/:orderId", checkToken, ensureLoggedIn, ordersCtrl.getItemsFromOrder);
router.patch("/:orderId", checkToken, ensureLoggedIn, ordersCtrl.completeOrder);
router.post("/add", checkToken, ensureLoggedIn, ordersCtrl.addItemToOrder);
router.delete("/remove", checkToken, ensureLoggedIn, ordersCtrl.removeItemFromOrder);

module.exports = router;
