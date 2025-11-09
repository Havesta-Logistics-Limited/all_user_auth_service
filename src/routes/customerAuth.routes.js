const express = require("express");
const vendorAuth = require("../controllers/vendorsAuth.Controller");
const testing = require("../middleware/testing");
const isAuth = require("../middleware/isAuth.middleware")
const passport = require("../controllers/customerAuth/googleAuth/googleStrategy")
const CustomerAuth = require("../controllers/customerAuth/CustomerAuth.controller")
const path = require("path");
const VendorProfile = require("../controllers/getVendorProfile.Controller");


const router = express.Router();

router.post("/auth/google", () => CustomerAuth.googleAuth());
router.post("/auth/signup", (req,res) => CustomerAuth.signup(req,res));
router.post("/auth/signin", (req,res) => CustomerAuth.signin(req,res));
router.post("/auth/get_access_token", (req,res) => CustomerAuth.signin(req,res));





// router.post("/signin", (req, res) => vendorAuth.signin(req, res));
// router.post("/forgot_password", (req,res) => vendorAuth.forgotPassword(req,res))
// router.get("/validate_reset_token/:token", (req, res) => vendorAuth.validateResetToken(req, res));
// router.post("/reset_password/:token", (req,res) => vendorAuth.resetPassword(req,res))
// router.get("/get_profile", isAuth, (req,res) => VendorProfile.getProfile(req,res))
// router.patch("/update_profile", isAuth, (req,res) => VendorProfile.updateProfile(req,res))
// router.patch("/update_profile_picture", isAuth, (req,res) => VendorProfile.updateProfilePicture(req,res))
// router.patch("/change_password", isAuth, (req,res) => vendorAuth.changePassword(req,res))



module.exports = router;
