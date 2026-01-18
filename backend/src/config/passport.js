import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { client } from "../models/db";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        const username = profile.displayName;

        const userResult = await client.query(
          `SELECT * FROM users WHERE email = $1`,
          [email]
        );

        let user;

        if (userResult.rowCount) {
          // مستخدم موجود → Login
          user = userResult.rows[0];
        } else {
          // مستخدم جديد → نخليه يكمّل Register
          user = {
            isNew: true,
            email,
            username,
          };
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
