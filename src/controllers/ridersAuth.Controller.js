import db from "../sequelize/models/index.js";
const { sequelize, riderModel } = db;

import JWT from "jsonwebtoken";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import responseHandler from "../handlers/response.handler.js";
import bcrypt from "bcryptjs";
import randomString from "../helpers/randomString.js";
import sendEmail from "../config/mailer.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const randomPassword = randomString();

class RidersAuth {
  //signup handler
  static async signup(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        firstname,
        lastname,
        phone_number,
        email,
        agreed_to_regular_updates,
        accepted_privacy_policy,
      } = req.body;

      const hashedPassword = await bcrypt.hash(randomPassword, 12);
      const newRider = await riderModel.create(
        {
          firstname,
          lastname,
          phone_number,
          email,
          password: hashedPassword,
          agreed_to_regular_updates,
          accepted_privacy_policy,
        },
        { transaction: t }
      );

      if (newRider) {
        const data = await riderModel.findOne({
          attributes: ["signup_upload_temp_id"],
          where: { email },
          transaction: t,
        });

        if (data) {
          const tempId = data.signup_upload_temp_id;
          this.setCookieForImmediateUpload(req, res, tempId);
          const message = `Your password is ${randomPassword}`;
          await sendEmail({
            receiverEmail: email,
            subject: "Email Verification",
            message,
          });
        }
      }

      await t.commit();
      return responseHandler.created(res);
    } catch (error) {
      console.error(error);
      await t.rollback();

      if (error.name === "SequelizeValidationError") {
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

  // multer setup
  static multerSetup() {
    return multer.memoryStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "uploads"));
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
      },
    });
  }

  // cloudinary upload handler
  static async uploadToCloudinaryAndDatabase(req, res) {
    try {
      const tempId = req.cookies?.temp_Id;
      const uploadPromises = [];

      for (const [fieldName, files] of Object.entries(req.files)) {
        files.forEach((file) => {
          uploadPromises.push(
            new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  resource_type: "image",
                  folder: "havesta_rider_images",
                  public_id: `${fieldName}-${Date.now()}`,
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              streamifier.createReadStream(file.buffer).pipe(uploadStream);
            })
          );
        });
      }

      const data = await Promise.all(uploadPromises);

      if (data && tempId) {
        const riderVehicle = data[0].public_id.includes("vehicle_image")
          ? data[0].secure_url
          : data[1].secure_url;
        const riderModeOfId = data[1].public_id.includes("ID_image")
          ? data[1].secure_url
          : data[0].secure_url;

        await this.saveUploadURLToDb(tempId, riderVehicle, riderModeOfId, res);
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }
    } catch (error) {
      console.error("Cloudinary error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  static async saveUploadURLToDb(tempId, vehicleImg, modeOfIdImg, res) {
    const t = await sequelize.transaction();
    try {
      const data = await riderModel.findOne({
        where: { signup_upload_temp_id: tempId },
        transaction: t,
      });

      if (data) {
        await riderModel.update(
          { mode_of_identification_img: modeOfIdImg, vehicle_img: vehicleImg },
          { where: { signup_upload_temp_id: tempId }, transaction: t }
        );
      }

      await t.commit();
      res.clearCookie("temp_Id");
      return res
        .status(201)
        .json({ success: true, message: "Operation Successful" });
    } catch (error) {
      console.error(error);
      await t.rollback();
      return responseHandler.serverError(res);
    }
  }

  static setCookieForImmediateUpload(req, res, tempId) {
    res.cookie("temp_Id", tempId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  // signin
  static async signin(req, res) {
    try {
      const { email, password } = req.body;
      const rider = await riderModel.findOne({ where: { email } });

      if (!rider) {
        return responseHandler.notfound(res, "Incorrect Email or Password");
      }

      const valid = await bcrypt.compare(password, rider.password);
      if (!valid) {
        return responseHandler.notfound(res, "Incorrect Email or Password");
      }

      const accessToken = JWT.sign(
        { PUID: rider.public_unique_Id },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { algorithm: "HS256", expiresIn: "15m" }
      );

      const refreshToken = JWT.sign({}, process.env.REFRESH_TOKEN_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "1d",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  // forgot password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await riderModel.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Email not associated with any account",
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

      const message = `Follow the link to reset your password. Valid for 10 minutes:
      ${process.env.CLIENT_FRONTEND_URL}/client/rider/reset_password/${emailToken}`;

      await sendEmail({
        receiverEmail: email,
        subject: "Password Reset",
        message,
      });

      return res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  static async validateResetToken(req, res) {
    const { token } = req.params;
    try {
      const isTokenValid = JWT.verify(
        token,
        process.env.FORGOT_PASSWORD_SECRET
      );
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
      await riderModel.update(
        { password: hashedPassword },
        { where: { email }, transaction: t }
      );

      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: "Password change successful" });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Password change unsuccessful" });
    }
  }
}

export default RidersAuth;
