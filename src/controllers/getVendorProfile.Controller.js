import db from "../sequelize/models/index.js";
import JWT from "jsonwebtoken";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import responseHandler from "../handlers/response.handler.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const { vendorModel } = db;

class VendorProfile {
  static async getProfile(req, res) {
    try {
      const vendor = await vendorModel.findOne({
        where: { public_unique_Id: res.locals.user },
        attributes: { exclude: ["id", "password"] },
      });

      if (!vendor) {
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      return res.status(200).json(vendor);
    } catch (err) {
      console.error(err, "error in getProfile");
      return responseHandler.serverError(res);
    }
  }

  static async updateProfile(req, res) {
    const updatedFields = req.body;
    try {
      const [affectedRows] = await vendorModel.update(updatedFields, {
        where: { public_unique_Id: res.locals.user },
      });

      if (affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      const updatedVendor = await vendorModel.findOne({
        where: { public_unique_Id: res.locals.user },
        attributes: { exclude: ["id", "password"] },
      });

      return res.status(200).json(updatedVendor);
    } catch (err) {
      console.error(err, "error in updateProfile");
      return responseHandler.serverError(res);
    }
  }

  static async updateProfilePicture(req, res) {
    const { cloudinaryUrl, public_id } = req.body;
    try {
      const [affectedRows] = await vendorModel.update(
        { profile_photo: cloudinaryUrl },
        { where: { public_unique_Id: res.locals.user } }
      );

      if (affectedRows === 0) {
        if (public_id) {
          await cloudinary.uploader.destroy(public_id);
        }
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      return responseHandler.created(res);
    } catch (err) {
      console.error(err, "error in updateProfilePicture");

      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }

      return responseHandler.serverError(res);
    }
  }
}

export default VendorProfile;
