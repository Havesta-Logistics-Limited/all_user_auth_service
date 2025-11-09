import express from "express";
import Marketplace from "../controllers/marketplace.controller.js";

const router = express.Router();

router.get("/get_all_vendors", (req, res) => Marketplace.getVendors(req, res));

export default router;
