import { v4 as uuidv4 } from "uuid";
import genRandomString from "../../helpers/genString.js";
import { Model, DataTypes } from "sequelize";

const PHONE_NUM_MIN_DIGITS = 11;
const PHONE_NUM_MAX_DIGITS = 11;
const NIN_LENGTH = 12;
const ACCOUNT_NUM_LENGTH = 10;

export default (sequelize) => {
  class RiderModel extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  RiderModel.init(
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
      method_of_delivery: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      current_location: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      currently_working_with_another_logistics: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      NIN: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
          isCorrectLength(value) {
            if (value) {
              if (value.toString().length !== NIN_LENGTH) {
                throw new Error("NIN should be 12 digits");
              }
            }
          },
        },
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
          isCorrectLength(value) {
            if (value && value.toString().length !== ACCOUNT_NUM_LENGTH) {
              throw new Error("Account number must be exactly 10 digits");
            }
          },
        },
      },
      guarantor_1_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      guarantor_1_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
          isCorrectLength(value) {
            if (
              value &&
              (value.toString().length < PHONE_NUM_MIN_DIGITS ||
                value.toString().length > PHONE_NUM_MAX_DIGITS)
            ) {
              throw new Error("Phone number must be 11 digits");
            }
          },
        },
      },
      guarantor_2_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      guarantor_2_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
          isCorrectLength(value) {
            if (
              value &&
              (value.toString().length < PHONE_NUM_MIN_DIGITS ||
                value.toString().length > PHONE_NUM_MAX_DIGITS)
            ) {
              throw new Error("Phone number must be 11 digits");
            }
          },
        },
      },
      agreed_to_regular_updates: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      accepted_privacy_policy: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_activated_by_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      profile_photo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      vehicle_img: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      mode_of_identification_img: {
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
    },
    {
      sequelize,
      modelName: "riderModel",
      tableName: "riders_profile",
    }
  );

  return RiderModel;
};
