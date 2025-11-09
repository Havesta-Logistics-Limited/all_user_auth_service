import { v4 as uuidv4 } from "uuid";
import genRandomString from "../../helpers/genString.js";
import { Model, DataTypes } from "sequelize";

const PHONE_NUM_MIN_DIGITS = 11;
const PHONE_NUM_MAX_DIGITS = 11;

export default (sequelize) => {
  class VendorModel extends Model {
    static associate(models) {
      // define associations here
    }
  }

  VendorModel.init(
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
      phone_number: {
        type: DataTypes.STRING,
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
                throw new Error(`Phone number must be 11 digits`);
              }
            }
          },
        },
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
                "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
              );
            }
          },
        },
        defaultValue: null,
      },
      name_of_business: {
        type: DataTypes.STRING,
        allowNull: false,
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
      legal_business_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_of_business: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      tax_identification_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      profile_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      signup_upload_temp_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: () => genRandomString(6),
      },
      public_unique_Id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => uuidv4(),
      },
      agreed_to_regular_updates: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      accepted_privacy_policy: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "vendorModel",
      tableName: "vendors_profile",
    }
  );

  return VendorModel;
};
