import db from "../sequelize/models/index.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sendEmail from "../config/mailer.js";
import randomString from "../helpers/randomString.js";
import VendorProfile from "./getVendorProfile.Controller.js";
import responseHandler from "../handlers/response.handler.js";

const { sequelize, vendorModel } = db;

dotenv.config();

const randomPassword = randomString();

class VendorsAuth {
  // ---------------------- SIGNUP ----------------------
  static async signup(req, res) {
    const t = await sequelize.transaction();
    const {
      firstname,
      lastname,
      name_of_business,
      email,
      phone_number,
      legal_business_address,
      agreed_to_regular_updates,
      accepted_privacy_policy,
    } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      const newVendor = await vendorModel.create(
        {
          firstname,
          lastname,
          name_of_business,
          email,
          phone_number,
          legal_business_address,
          agreed_to_regular_updates,
          accepted_privacy_policy,
          password: hashedPassword,
        },
        { transaction: t }
      );

      const data = await vendorModel.findOne({
        where: { email },
        transaction: t,
      });

      const message = `Your password is: ${randomPassword}`;
      await sendEmail({
        receiverEmail: data.email,
        subject: "Email Verification",
        message,
      });

      await t.commit();
      return responseHandler.created(res);
    } catch (error) {
      await t.rollback();

      if (
        error.name === "SequelizeValidationError" ||
        error.errors?.[0]?.type === "Validation error"
      ) {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(400).json({
          SUCCESS: false,
          MESSAGE: validationErrors[0],
          ERROR_TYPE: "Validation error",
        });
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        const uniqueError = error.errors.map((err) => err.message);
        return res.status(409).json({
          SUCCESS: false,
          MESSAGE: uniqueError[0],
          ERROR_TYPE: "unique constraint error",
        });
      }

      return res.status(500).json({
        SUCCESS: false,
        MESSAGE: "An unexpected error occurred",
        error: error.message,
      });
    }
  }

  // ---------------------- SIGNIN ----------------------
  static async signin(req, res) {
    try {
      const { email, password } = req.body;

      const vendor = await vendorModel.findOne({ where: { email } });
      if (!vendor) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect email or password" });
      }

      const valid = await bcrypt.compare(password, vendor.password);
      if (!valid) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect email or password" });
      }

      const { public_unique_Id, ...vendorData } = vendor.dataValues;
      delete vendorData.password;
      delete vendorData.id;

      const accessToken = JWT.sign(
        { PUID: public_unique_Id },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { algorithm: "HS256", expiresIn: "10d" }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({
        success: true,
        message: "Signin successful",
        data: vendorData,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  // ---------------------- FORGOT PASSWORD ----------------------
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await vendorModel.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          success: false,
          message:
            "Email is not associated with an account, enter a correct email",
        });
      }

      const emailToken = JWT.sign(
        { email },
        process.env.FORGOT_PASSWORD_SECRET,
        {
          expiresIn: "10m",
          algorithm: "HS256",
        }
      );

      const message = `Follow the link to reset your password. This link is valid for 10 minutes \n
      ${process.env.CLIENT_FRONTEND_URL}/client/vendor/reset_password/${emailToken} \n 
      If you did not make a password reset request, please ignore this email`;

      await sendEmail({
        receiverEmail: email,
        subject: "Email Verification",
        message,
      });

      return res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      return res.status(500).json("something went wrong");
    }
  }

  // ---------------------- VALIDATE RESET TOKEN ----------------------
  static async validateResetToken(req, res) {
    const { token } = req.params;
    try {
      JWT.verify(token, process.env.FORGOT_PASSWORD_SECRET);
      return res.status(200).json({ valid: true, message: "Token is valid" });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ valid: false, message: "Token has expired" });
      }
      return res.status(400).json({ valid: false, message: "Invalid token" });
    }
  }

  // ---------------------- RESET PASSWORD ----------------------
  static async resetPassword(req, res) {
    const t = await sequelize.transaction();
    const token = req.params.token;
    const { email } = JWT.verify(token, process.env.FORGOT_PASSWORD_SECRET);
    const { newPassword, confirmPassword } = req.body;

    try {
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Passwords do not match" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await vendorModel.update(
        { password: hashedPassword },
        { where: { email }, transaction: t }
      );

      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: "Password change successful" });
    } catch (error) {
      await t.rollback();
      return res
        .status(500)
        .json({ success: false, message: "Password change unsuccessful" });
    }
  }

  // ---------------------- UPDATE PROFILE PICTURE ----------------------
  static async updateProfilePicture(req, res) {
    const { cloudinaryUrl } = req.body;
    const PUID = res.locals.user;

    await vendorModel.update(
      { profile_photo: cloudinaryUrl },
      { where: { public_unique_Id: PUID } }
    );

    return res.status(200).json({ success: true, message: "Profile updated" });
  }
}

export default VendorsAuth;
