import express from "express";
import RidersAuth from "../controllers/ridersAuth.Controller.js";
import testing from "../middleware/testing.js";
import multer from "multer";
import catchMulterErrors from "../middleware/multer.error.js";

const router = express.Router();

// Multer setup with custom storage from RidersAuth class
const upload = multer({
  storage: RidersAuth.multerSetup(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Routes
router.post("/signup", testing, (req, res) => RidersAuth.signup(req, res));

router.post(
  "/upload",
  upload.fields([
    { name: "vehicle_image", maxCount: 1 },
    { name: "ID_image", maxCount: 1 },
  ]),
  catchMulterErrors,
  (req, res) => RidersAuth.uploadToCloudinaryAndDatabase(req, res)
);

router.post("/signin", (req, res) => RidersAuth.signin(req, res));

router.post("/forgot_password", (req, res) =>
  RidersAuth.forgotPassword(req, res)
);

router.get("/validate_reset_token/:token", (req, res) =>
  RidersAuth.validateResetToken(req, res)
);

router.post("/reset_password/:token", (req, res) =>
  RidersAuth.resetPassword(req, res)
);

export default router;
