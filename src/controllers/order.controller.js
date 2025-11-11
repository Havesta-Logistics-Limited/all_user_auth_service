import models from "../sequelize/models/index.js";
const { Order } = models;

class OrderController {
  // Create a new order
  static async createOrder(req, res) {
    try {
      const { customer_id, product_id, quantity, status, total_price } =
        req.body;

      const order = await Order.create({
        customer_id,
        product_id,
        quantity,
        status,
        total_price,
      });

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      });
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all orders with customer and product info
  static async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            association: "customer",
            attributes: ["id", "firstname", "lastname", "email"],
          },
          { association: "product", attributes: ["id", "name", "price"] },
        ],
      });
      res.status(200).json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get a single order by ID with customer and product info
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            association: "customer",
            attributes: ["id", "firstname", "lastname", "email"],
          },
          { association: "product", attributes: ["id", "name", "price"] },
        ],
      });

      if (!order) return res.status(404).json({ message: "Order not found" });

      res.status(200).json(order);
    } catch (err) {
      console.error("Error fetching order:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update an order
  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { customer_id, product_id, quantity, status, total_price } =
        req.body;

      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ message: "No data provided for update" });

      await order.update({
        customer_id,
        product_id,
        quantity,
        status,
        total_price,
      });

      // Return updated order with associations
      const updatedOrder = await Order.findByPk(id, {
        include: [
          {
            association: "customer",
            attributes: ["id", "firstname", "lastname", "email"],
          },
          { association: "product", attributes: ["id", "name", "price"] },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      });
    } catch (err) {
      console.error("Error updating order:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete an order
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) return res.status(404).json({ message: "Order not found" });

      await order.destroy();

      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting order:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default OrderController;
