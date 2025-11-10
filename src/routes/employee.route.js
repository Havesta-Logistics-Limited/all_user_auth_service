import express from "express";
import EmployeeController from "../controllers/employee.controller.js";
const router = express.Router();

router.post("/", EmployeeController.createEmployee);
router.get("/", EmployeeController.getEmployees);
router.get("/:id", EmployeeController.getEmployeeById);
router.patch("/:id", EmployeeController.updateEmployee);
router.delete("/:id", EmployeeController.deleteEmployee);

export default router;
