import models from "../sequelize/models/index.js";
const { Employee } = models;

class EmployeeController {
  static async createEmployee(req, res) {
    try {
      const {
        firstname,
        lastname,
        email,
        phone_number,
        password,
        department,
        role,
      } = req.body;

      const employee = await Employee.create({
        firstname,
        lastname,
        email,
        phone_number,
        password,
        department,
        role,
      });

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee,
      });
    } catch (err) {
      console.error("Error creating employee:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getEmployees(req, res) {
    try {
      const employees = await Employee.findAll({
        attributes: { exclude: ["password"] },
      });
      res.status(200).json(employees);
    } catch (err) {
      console.error("Error fetching employees:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      res.status(200).json(employee);
    } catch (err) {
      console.error("Error fetching employee:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const {
        firstname,
        lastname,
        email,
        phone_number,
        department,
        role,
        is_active,
      } = req.body;

      const employee = await Employee.findByPk(id);
      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ message: "No data provided for update" });

      await employee.update({
        firstname,
        lastname,
        email,
        phone_number,
        department,
        role,
        is_active,
      });

      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        employee,
      });
    } catch (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);

      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      await employee.destroy();

      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting employee:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default EmployeeController;
