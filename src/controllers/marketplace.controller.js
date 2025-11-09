import db from "../sequelize/models/index.js";
import responseHandler from "../handlers/response.handler.js";

const { vendorModel } = db;

class Marketplace {
  static async getVendors(req, res) {
    try {
      const vendors = await vendorModel.findAll({
        attributes: { exclude: ["password"] },
      });

      if (!vendors || vendors.length === 0) {
        return responseHandler.success(res, []);
      }

      // Map Sequelize instances to plain objects
      const data = vendors.map((vendor) => vendor.toJSON());

      return responseHandler.success(res, data);
    } catch (err) {
      console.error(err, "error in getVendors");
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
        attributes: { exclude: ["password"] },
      });

      return res.status(200).json(updatedVendor);
    } catch (err) {
      console.error(err, "error in updateProfile");
      return responseHandler.serverError(res);
    }
  }
}

export default Marketplace;
