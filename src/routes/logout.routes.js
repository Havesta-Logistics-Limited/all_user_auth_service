import express from "express";
import isAuth from "../middleware/isAuth.middleware.js";
import { logout } from "../controllers/logout.controller.js";

const router = express.Router();

router.post("/logout", isAuth, (req, res) => logout(req, res));

export default router;
