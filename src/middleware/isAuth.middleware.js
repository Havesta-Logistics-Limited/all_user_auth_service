import jwt from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const isAuth = async (req, res, next) => {
  // module.exports = async (req, res, next) => {
  //   try {

  //     const token = req.cookies.accessToken
  //     if (!token) {
  //       throw new Error("Token Invalid or unprovided, please sign in again");
  //     }

  //    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
  //    console.log(decodedToken, "decoded token")
  //    res.locals.user = decodedToken.PUID;
  //    if(!decodedToken){
  //     return responseHandler.forbidden(res, "Invalid session please login again")
  //    }

  //    req.user = decodedToken
  //     next();
  //   } catch (err) {
  //     res.status(403).json({ status: "failed", message: err.message });
  //   }
  // };
  try {
    // Get the Authorization header (e.g., "Bearer eyJhbGciOiJI...")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseHandler.forbidden(
        res,
        "Token missing or malformed. Please log in again."
      );
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    if (!decodedToken) {
      return responseHandler.forbidden(
        res,
        "Invalid session, please log in again."
      );
    }

    // Attach user info to request and res.locals
    req.user = decodedToken;
    res.locals.user = decodedToken.PUID;

    next();
  } catch (err) {
    return res.status(403).json({ status: "failed", message: err.message });
  }
};

export default isAuth;
