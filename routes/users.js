const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");

router.post("/", userCtrl.create);
router.get("/", userCtrl.index);

module.exports = router;
