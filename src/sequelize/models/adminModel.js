import { Model } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // define any relationships here if needed
    }

    // Check password
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  Admin.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("basic", "IT", "superadmin"),
        defaultValue: "basic", // automatically assign basic role
      },
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "admins",
      hooks: {
        beforeCreate: async (admin) => {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        },
        beforeUpdate: async (admin) => {
          if (admin.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(admin.password, salt);
          }
        },
      },
    }
  );

  return Admin;
};
