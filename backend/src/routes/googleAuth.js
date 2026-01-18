import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { client } from "../models/db";

const router = express.Router();

/* ------------------------------------
   Google LOGIN
------------------------------------ */
router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "login",
  })
);

/* ------------------------------------
   Google REGISTER
------------------------------------ */
router.get(
  "/google/register",
  (req, res, next) => {
    req.session = { role: req.query.role }; // student / teacher
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "register",
  })
);

/* ------------------------------------
   CALLBACK
------------------------------------ */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // 🆕 مستخدم جديد → Register
      if (user.isNew) {
        const role = req.session?.role;

        if (!role) {
          return res.redirect(
            `${process.env.FRONTEND_URL}/error?msg=missing_role`
          );
        }

        const roleId = role === "teacher" ? 3 : 2;

        const insert = await client.query(
          `
          INSERT INTO users (username, email, role_id)
          VALUES ($1, $2, $3)
          RETURNING *
        `,
          [user.username, user.email, roleId]
        );

        const newUser = insert.rows[0];

        const token = jwt.sign(
          { id: newUser.id, role: newUser.role_id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.redirect(
          `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
        );
      }

      // 🔐 مستخدم موجود → Login
      const token = jwt.sign(
        { id: user.id, role: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(
        `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
      );
    } catch (err) {
      console.error(err);
      res.redirect(`${process.env.FRONTEND_URL}/error`);
    }
  }
);

export default router;
