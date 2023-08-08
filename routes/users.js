const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");

router.post("/", userCtrl.create);
router.get("/", userCtrl.index);
router.post("/log-in", userCtrl.logIn);

module.exports = router;
