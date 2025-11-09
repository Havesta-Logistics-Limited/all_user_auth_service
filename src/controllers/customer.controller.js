import db from "../sequelize/models/index.js";
const Customer = db.customerModel;

class CustomerController {
  static async createCustomer(req, res) {
    try {
      const { firstname, lastname, email, phone_number } = req.body;
      const customer = await Customer.create({
        firstname,
        lastname,
        email,
        phone_number,
      });
      return res.status(201).json({
        message: "Customer created successfully",
        customer,
      });
    } catch (err) {
      console.error("Error creating customer:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCustomers(req, res) {
    try {
      const customers = await Customer.findAll({
        attributes: { exclude: ["password"] },
      });
      return res.status(200).json(customers);
    } catch (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);
      if (!customer)
        return res.status(404).json({ message: "Customer not found" });
      return res.status(200).json(customer);
    } catch (err) {
      console.error("Error fetching customer:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { firstname, lastname, email, phone_number } = req.body;

      const customer = await Customer.findByPk(id);
      if (!customer)
        return res.status(404).json({ message: "Customer not found" });

      await customer.update({ firstname, lastname, email, phone_number });
      return res.status(200).json({
        message: "Customer updated successfully",
        customer,
      });
    } catch (err) {
      console.error("Error updating customer:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);
      if (!customer)
        return res.status(404).json({ message: "Customer not found" });

      await customer.destroy();
      return res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
      console.error("Error deleting customer:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default CustomerController;
