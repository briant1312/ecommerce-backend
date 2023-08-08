const express = require("express");
const router = express.Router();
const itemsCtrl = require("../controllers/items");

router.post("/", itemsCtrl.create);
router.get("/", itemsCtrl.index);
router.get("/:id", itemsCtrl.show);
router.delete("/:id", itemsCtrl.deleteOne);
router.patch("/:id", itemsCtrl.update);

module.exports = router;
