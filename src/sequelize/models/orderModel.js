import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Use models passed in here, not imported directly
      Order.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
      });
      Order.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }

  Order.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      customer_id: { type: DataTypes.INTEGER, allowNull: false },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      total_price: { type: DataTypes.FLOAT, allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "completed", "canceled"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
    }
  );

  return Order;
};
