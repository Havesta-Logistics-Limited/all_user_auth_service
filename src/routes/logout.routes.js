const express = require("express");
const isAuth = require("../middleware/isAuth.middleware");
const { logout } = require("../controllers/logout.controller.js");

const router = express.Router();

router.post("/logout", isAuth, (req, res) => logout(req, res));

module.exports = router;
