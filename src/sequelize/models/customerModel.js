"use strict";
const { v4: uuidv4 } = require("uuid");
const genRandomString = require("../../helpers/genString");

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class customerModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here (if needed later)
    }
  }

  const PHONE_NUM_MIN_DIGITS = 11;
  const PHONE_NUM_MAX_DIGITS = 11;

  customerModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email already in use",
        },
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },

      phone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: {
          args: true,
          msg: "Phone number already in use",
        },
        validate: {
          isCorrectLength(value) {
            if (value) {
              const length = value.toString().length;
              if (
                length < PHONE_NUM_MIN_DIGITS ||
                length > PHONE_NUM_MAX_DIGITS
              ) {
                throw new Error("Phone number must have exactly 11 digits");
              }
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
            if (value) {
              if (
                !/[a-z]/.test(value) ||
                !/[A-Z]/.test(value) ||
                !/[0-9]/.test(value) ||
                !/[^a-zA-Z0-9]/.test(value)
              ) {
                throw new Error(
                  "Password must contain lowercase, uppercase, number, and special character."
                );
              }
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
              if (enteredDate > today) {
                throw new Error("Date of birth cannot be a future date");
              }
            }
          },
        },
        defaultValue: null,
      },

      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },

      country: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },

      state: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },

      agreed_to_regular_updates: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      accepted_privacy_policy: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

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
      modelName: "customerModel",
      tableName: "customers_profile",
      timestamps: true,
      indexes: [{ unique: true, fields: ["public_unique_Id", "email"] }],
    }
  );

  return customerModel;
};
