const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { sequelize, customerModel } = require("../../../sequelize/models");



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "process.env.GOOGLE_CALLBACK_URL",
    },
    async (accessToken, refreshToken, profile, done) => {
        const t = await sequelize.transaction();
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if user already exists
        const existingUser = await customerModel.findOne(
          { where: { google_id: googleId } },
          { transaction: t }
        );

        if (existingUser) {
          await t.commit();
          return done(null, existingUser); // User exists
        }

         const newCustomer = await customerModel.create(
          { google_id: googleId, email, name },
          { transaction: t }
        );
        await t.commit();
        done(null, newUser);

    } catch (err) {
        await t.rollback();
        console.error('Error saving user to database:', err);
        done(err, null);
      }
    }
  )
);





module.exports = passport;