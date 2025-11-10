import models from "../sequelize/models/index.js";
const { Product } = models;

class ProductController {
  // Create a new product
  static async createProduct(req, res) {
    try {
      const { name, price, description, stock } = req.body;
      const product = await Product.create({ name, price, description, stock });

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (err) {
      console.error("Error creating product:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to create product",
        error: err.message,
      });
    }
  }

  // Get all products
  static async getProducts(req, res) {
    try {
      const products = await Product.findAll();
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: err.message,
      });
    }
  }

  // Get single product by id
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({ success: true, product });
    } catch (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: err.message,
      });
    }
  }

  // Update product
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, price, description, stock } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      await product.update({ name, price, description, stock });

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
      });
    } catch (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: err.message,
      });
    }
  }

  // Delete product
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      await product.destroy();

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete product",
        error: err.message,
      });
    }
  }
}

export default ProductController;
