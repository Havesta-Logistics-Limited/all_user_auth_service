const { sequelize, vendorModel, Sequelize } = require("../sequelize/models");
const JWT = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const responseHandler = require("../handlers/response.handler");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const sendEmail = require("../config/mailer");
const randomString = require("../helpers/randomString");

class Marketplace {
  static async getVendors(req, res) {
    try {
      // console.log(res.locals.user, "res user")
      const vendors = await vendorModel.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
      
      if (vendors) {
        const data = vendors.map((vendor) => vendor.dataValues);
        console.log(data, 'ftatadytsafydgwjhnfnrwge');
        const { dataValues } = vendors;
        console.log(dataValues, "respojnse");
       

        // return res.status(200).json(dataValues);
        return responseHandler.success(res, data)

      }
    } catch (err) {
      console.log(err, "error here");
      return responseHandler.serverError(res);
    }
  }

  static async updateProfile(req, res) {
   
    const userid = req.params.id;
    const updatedFields = req.body;
    try {
      const profile = await vendorModel.update(updatedFields, {
        where: { public_unique_Id: res.locals.user },
      });

      const { dataValues } = profile;
      return res.status(200).json(dataValues);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Marketplace;
