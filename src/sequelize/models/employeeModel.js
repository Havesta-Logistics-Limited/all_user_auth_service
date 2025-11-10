import { v4 as uuidv4 } from "uuid";
import genRandomString from "../../helpers/genString.js";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      // define associations here (if needed)
    }
  }

  const PHONE_NUM_MIN_DIGITS = 11;
  const PHONE_NUM_MAX_DIGITS = 11;

  Employee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
            const len = value?.toString().length;
            if (len < PHONE_NUM_MIN_DIGITS || len > PHONE_NUM_MAX_DIGITS)
              throw new Error("Phone number must have exactly 11 digits");
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
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
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "employee",
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      hire_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      profile_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      employee_code: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: genRandomString(8),
      },
      public_unique_Id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employees_profile",
      timestamps: true,
      indexes: [{ unique: true, fields: ["public_unique_Id", "email"] }],
    }
  );

  return Employee;
};
