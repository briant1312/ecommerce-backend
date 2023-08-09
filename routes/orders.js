const express = require("express");
const router = express.Router();
const ordersCtrl = require("../controllers/orders");
const checkToken = require("../config/checkToken");
const ensureLoggedIn = require("../config/ensureLoggedIn");

router.post("/", checkToken, ensureLoggedIn, ordersCtrl.create);
router.patch("/:id", checkToken, ensureLoggedIn, ordersCtrl.completeOrder);
router.post("/add/:itemId", checkToken, ensureLoggedIn, ordersCtrl.addItemToOrder);
router.delete("/remove/:itemId", checkToken, ensureLoggedIn, ordersCtrl.removeItemFromOrder);

module.exports = router;
