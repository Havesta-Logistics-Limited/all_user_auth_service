const express = require("express");

const Marketplace = require("../controllers/marketplace.controller")



const router = express.Router();

router.get("/get_all_vendors", (req,res)=>Marketplace.getVendors(req,res))
//  Marketplace.getVendors(req,res)

module.exports = router;