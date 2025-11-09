const passport = require("./googleAuth/googleStrategy");
const jwt = require("jsonwebtoken");
const { sequelize, customerModel } = require("../../sequelize/models");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const responseHandler = require("../../handlers/response.handler");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class CustomerAuth {
  // static async googleAuthInit() {
  //   passport.authenticate("google", { scope: ["profile", "email"] });
  // }

  // static async googleAuthCallback() {
  //   passport.authenticate("google", { session: false }),
  //     async (req, res) => {
  //       try {
  //         const user = req.user;

  //         // Step 3: Sign a JWT
  //         const token = jwt.sign(
  //           {
  //             sub: user.id,
  //             email: user.email,
  //             name: user.name,
  //           },
  //           process.env.CUSTOMER_ACCESS_TOKEN_SECRET_KEY,
  //           { expiresIn: "1h" }
  //         );

  //         // Return token to the client (JSON)
  //         const customer = await customerModel.findOne({
  //           where: { email: user.email },
  //         });
  //         res.json({
  //           message: "Login successful",
  //           token,
  //           user,
  //         });
  //       } catch (error) {
  //         console.error("Error in Google callback:", err);
  //         return res.status(500).json({
  //           error: "Internal server error during authentication",
  //         });
  //       }
  //     };
  // }

  static async googleAuth(req, res) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res
          .status(400)
          .json({ success: false, message: "Missing idToken" });
      }

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // const payload = {
      //   email,
      //   given_name,
      //   family_name,
      //   picture,
      //   sub: google_id,
      // };
      const { sub, email, given_name, family_name, picture } = payload;

      const name = `${given_name || ""} ${family_name || ""}`.trim();

      let user = await customerModel.findOne({ where: { google_id: sub } });

      if (!user) {
        user = await customerModel.create(
          {
            google_id: sub,
            email,
            name,
            profile_photo: picture,
          },
          { returning: true, raw: true }
        );
      }

      const accessToken = jwt.sign(
        {
          public_id: user.public_unique_id,
          email: user.email,
          name: user.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { public_id: user.public_unique_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Return tokens to mobile client
      return res.json({
        success: true,
        user: {
          public_id: user.public_unique_id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
        tokens: { accessToken, refreshToken },
      });
    } catch (error) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  }

  static async signup(req, res) {
    const t = await sequelize.transaction();
    const { name, email, phone_number, gender, password } = req.body;
    try {
      const hasshedPassword = await bcrypt.hash(password, 12);
      const newCustomer = await customerModel.create(
        {
          name: name,
          email: email,
          phone_number: phone_number,
          password: hasshedPassword,
          gender: gender,
          profile_photo: req.body.profileImage ? req.body.profileImage : null,
        },
        { transaction: t }
      );
      console.log(newCustomer);

      const data = await customerModel.findOne({
        where: { email: email },
        transaction: t,
      });
      // const message = `your password is ${randomPassword}`;
      // await sendEmail({
      //   receiverEmail: data.email,
      //   subject: "Email Verification",
      //   message: message,
      // });
      await t.commit();
      return responseHandler.created(res);
    } catch (error) {
      console.log(error);
      await t.rollback();
      const validationType = error.errors.map((err) => err.type);
      console.log(validationType[0], "this is type");
      if (
        error.name === "SequelizeValidationError" ||
        validationType[0] === "Validation error"
      ) {
        const validationErrors = error.errors.map((err) => err.message);
        console.log(validationErrors, "val errrorororororo");
        return res.status(400).json({
          SUCCESS: false,
          MESSAGE: validationErrors[0],
          ERROR_TYPE: "Validation error",
        });
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        const uniqueError = error.errors.map((err) => err.message);
        return res.status(409).json({
          SUCCESS: false,
          MESSAGE: uniqueError[0],
          ERROR_TYPE: "unique constraint error",
        });
      }

      return res.status(500).json({
        SUCCESS: false,
        MESSAGE: "An unexpected error occurred",
        error: error.message,
      });
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;
      // const vendorData = await VendorProfile.getProfile(email);

      const customer = await customerModel.findOne({
        where: { email: email },
      });

      if (!customer) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect email or password" });
      }

      const valid = await bcrypt.compare(password, customer.password);

      if (!valid) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect email or password" });
      }

      const { dataValues } = customer;

      const PUID = dataValues.public_unique_Id;
      const accessToken = jwt.sign(
        { PUID },
        process.env.CUSTOMER_ACCESS_TOKEN_SECRET_KEY,
        { algorithm: "HS256", expiresIn: "10m" }
      );

      const refreshToken = jwt.sign(
        { PUID },
        process.env.CUSTOMER_REFRESH_TOKEN_SECRET_KEY,
        { algorithm: "HS256", expiresIn: "7d" }
      );

      // const accessTokenCookie = res.cookie("accessToken", accessToken, {
      //   httpOnly: false,
      //   secure: true,
      //   sameSite: "none",
      // });

      // const refreshToken = JWT.sign({}, process.env.REFRESH_TOKEN_SECRET_KEY, {
      //   expiresIn: "1d",
      //   algorithm: "HS256",
      // });

      // const refreshTokenCookie = res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      // });
      console.log(dataValues, "datavalues");
      const dataValuesCopy = { ...dataValues };
      delete dataValuesCopy.password;
      delete dataValuesCopy.id;
      console.log(dataValuesCopy, "this is customer data");
      return res.status(200).json({
        success: true,
        message: "Signin successful",
        data: dataValuesCopy,
        tokens: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async getAccessToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Optional: check if refresh token exists in DB for this user
      // const storedToken = await RefreshTokenModel.findOne({ where: { token: refreshToken } });
      // if (!storedToken) return res.status(403).json({ message: "Invalid refresh token" });

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { public_id: decoded.public_unique_id },
        process.env.CUSTOMER_ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "15m" }
      );

      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      console.error(err);
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
  }
}

module.exports = CustomerAuth;
