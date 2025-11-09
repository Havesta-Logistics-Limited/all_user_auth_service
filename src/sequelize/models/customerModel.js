<<<<<<< HEAD
import { v4 as uuidv4 } from "uuid";
import genRandomString from "../../helpers/genString.js";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Customer extends Model {
=======
"use strict";
const { v4: uuidv4 } = require("uuid");
const genRandomString = require("../../helpers/genString");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customerModel extends Model {
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
<<<<<<< HEAD
      // define association here (if needed later)
    }
  }

  const PHONE_NUM_MIN_DIGITS = 11;
  const PHONE_NUM_MAX_DIGITS = 11;

  Customer.init(
=======
      // define association here
    }
  }
  const PHONE_NUM_MIN_DIGITS = 11;
  const PHONE_NUM_MAX_DIGITS = 11;
  customerModel.init(
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
<<<<<<< HEAD
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
=======
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      google_id: {
        type:DataTypes.STRING(50),
        allowNull:true,
        unique:true
      },
      phone_number: {
        type: DataTypes.BIGINT,
        allowNull: true,
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
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
<<<<<<< HEAD
                throw new Error("Phone number must have exactly 11 digits");
=======
                throw new Error(
                  `Phone number must have no more than 11 numbers.`
                );
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
              }
            }
          },
        },
      },
<<<<<<< HEAD
=======
      email: {
        type: DataTypes.STRING,
        allowNull: true,
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
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af

      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
<<<<<<< HEAD
          len: [8, 100],
=======
          len: [8, 100], // Ensure password is between 8 and 100 characters
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
          isStrongPassword(value) {
            if (value) {
              if (
                !/[a-z]/.test(value) ||
                !/[A-Z]/.test(value) ||
                !/[0-9]/.test(value) ||
                !/[^a-zA-Z0-9]/.test(value)
              ) {
                throw new Error(
<<<<<<< HEAD
                  "Password must contain lowercase, uppercase, number, and special character."
=======
                  "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
                );
              }
            }
          },
        },
        defaultValue: null,
      },
<<<<<<< HEAD

=======
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
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
<<<<<<< HEAD
        },
        defaultValue: null,
      },

=======

          // notOldEnough(value) {
          //   if (value) {
          //     const enteredDate = new Date(value)
          //     const enteredYear = enteredDate.getFullYear()
          //     const today = new Date();
          //     const ageCutoff = new Date(
          //       today.setFullYear(today.getFullYear() - 18)
          //     );
          //     if (enteredYear > ageCutoff) {
          //       throw new Error("You must be at least 18 years old");
          //     }
          //   }
          // },
        },
        defaultValue: null,
      },
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
<<<<<<< HEAD

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

=======
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
      profile_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
<<<<<<< HEAD

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
=======
      public_unique_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => uuidv4(),
      }
    },
    {
      sequelize,
      modelName: "customerModel",
      tableName: "customer_profile",
    }
  );
  return customerModel;
>>>>>>> 580536c31eaa2bf28a0c6ef7d6dc9e33b4c784af
};
