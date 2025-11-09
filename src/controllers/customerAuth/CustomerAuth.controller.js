const passport = require("./googleAuth/googleStrategy");
const jwt = require("jsonwebtoken");
const { sequelize, customerModel } = require("../../sequelize/models");
const { OAuth2Client } = require("google-auth-library");


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
        { public_id: user.public_unique_id, email: user.email, name: user.name },
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
}

module.exports = CustomerAuth;
