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


class VendorProfile {
     static async getProfile(req, res) {
        console.log("just fetched againnnnnnnnnnnnn")
        try {
            console.log(res.locals.user, "res user")
            const vendor = await vendorModel.findOne({
                where: { public_unique_Id: res.locals.user}
              });

              const {dataValues} = vendor
              console.log(dataValues, "respojnse")

            return res.status(200).json(dataValues );
        } catch(err) {
            console.log(err, "error here")
        }

    }


    static async updateProfile(req,res) {
        console.log(req.body, "from update")
        const userid = req.params.id;
        const updatedFields = req.body;
        try {
            const profile = await vendorModel.update(updatedFields, 
                {where: {public_unique_Id:res.locals.user}}
            )

            const {dataValues} = profile
return res.status(200).json(dataValues)
        }
        catch(err) {console.log(err)}
    }
}


module.exports = VendorProfile