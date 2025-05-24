const { responseHandler } = require("../handlers/response.handler");
const jwt = require("jsonwebtoken")


module.exports = async (req, res, next) => {
  try {
   
    const token = req.cookies.accessToken
    if (!token) {
      throw new Error("Token Invalid or unprovided, please sign in again");
    }

   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
   console.log(decodedToken, "decoded token")
   res.locals.user = decodedToken.PUID;
   if(!decodedToken){
    return responseHandler.forbidden(res, "Invalid session please login again")
   }

   req.user = decodedToken
    next();
  } catch (err) {
    res.status(403).json({ status: "failed", message: err.message });
  }
};