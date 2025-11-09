import multer from "multer";
import responseHandler from "../handlers/response.handler.js";

const catchMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return responseHandler.clientError(res, err.message);
  }

  return res.status(500).json({ error: "An unexpected error occurred" });
};

export default catchMulterErrors;
