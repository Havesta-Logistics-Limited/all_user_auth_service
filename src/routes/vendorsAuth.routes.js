import express from "express";
import vendorAuth from "../controllers/vendorsAuth.Controller.js";
import testing from "../middleware/testing.js";
import isAuth from "../middleware/isAuth.middleware.js";
import VendorProfile from "../controllers/getVendorProfile.Controller.js";
import path from "path";

const router = express.Router();

router.post("/signup", (req, res) => vendorAuth.signup(req, res));
router.post("/signin", (req, res) => vendorAuth.signin(req, res));
router.post("/forgot_password", (req, res) =>
  vendorAuth.forgotPassword(req, res)
);
router.get("/validate_reset_token/:token", (req, res) =>
  vendorAuth.validateResetToken(req, res)
);
router.post("/reset_password/:token", (req, res) =>
  vendorAuth.resetPassword(req, res)
);
router.get("/get_profile", isAuth, (req, res) =>
  VendorProfile.getProfile(req, res)
);
router.patch("/update_profile", isAuth, (req, res) =>
  VendorProfile.updateProfile(req, res)
);
router.patch("/update_profile_picture", isAuth, (req, res) =>
  VendorProfile.updateProfilePicture(req, res)
);

export default router;
