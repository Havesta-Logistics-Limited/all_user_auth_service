import express from "express";
import CustomerController from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/", CustomerController.createCustomer);
router.get("/", CustomerController.getCustomers);
router.get("/:id", CustomerController.getCustomerById);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
