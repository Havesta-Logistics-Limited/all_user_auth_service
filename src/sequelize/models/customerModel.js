import { v4 as uuidv4 } from "uuid";
import genRandomString from "../../helpers/genString.js";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      // One customer can have many orders
      Customer.hasMany(models.Order, {
        foreignKey: "customer_id",
        as: "orders",
      });
    }
  }

  const PHONE_NUM_MIN_DIGITS = 11;
  const PHONE_NUM_MAX_DIGITS = 11;

  Customer.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstname: { type: DataTypes.STRING, allowNull: false },
      lastname: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "Email already in use" },
        validate: { isEmail: { msg: "Provide a valid email address" } },
      },
      phone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: { args: true, msg: "Phone number already in use" },
        validate: {
          isCorrectLength(value) {
            if (value) {
              const len = value.toString().length;
              if (len < PHONE_NUM_MIN_DIGITS || len > PHONE_NUM_MAX_DIGITS)
                throw new Error("Phone number must have exactly 11 digits");
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [8, 100],
          isStrongPassword(value) {
            if (
              value &&
              (!/[a-z]/.test(value) ||
                !/[A-Z]/.test(value) ||
                !/[0-9]/.test(value) ||
                !/[^a-zA-Z0-9]/.test(value))
            ) {
              throw new Error(
                "Password must contain lowercase, uppercase, number, and special character."
              );
            }
          },
        },
        defaultValue: null,
      },
      date_of_birth: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notFutureDate(value) {
            if (value) {
              const enteredDate = new Date(value);
              const today = new Date();
              if (enteredDate > today)
                throw new Error("Date of birth cannot be a future date");
            }
          },
        },
        defaultValue: null,
      },
      gender: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      country: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      state: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      address: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      agreed_to_regular_updates: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      accepted_privacy_policy: { type: DataTypes.BOOLEAN, defaultValue: false },
      profile_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      signup_upload_temp_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: genRandomString(6),
      },
      public_unique_Id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "customers_profile",
      timestamps: true,
      indexes: [{ unique: true, fields: ["public_unique_Id", "email"] }],
    }
  );

  return Customer;
};
