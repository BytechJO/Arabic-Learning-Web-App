const client = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const activationDB = require("../models/activationDB");
//===================register ======================//
// const register = async (req, res) => {
//   const { username, email, password, role_id } = req.body;
//   const encryptedPassword = await bcrypt.hash(password, 10);

//   const query = `INSERT INTO users  (username,email,password,avatar_url,role_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
//   const value = [
//     username,
//     email.toLowerCase(),
//     encryptedPassword,
//     "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
//     role_id,
//   ];

//   try {
//     const response = await client.query(query, value);
//     if (response.rowCount) {
//       res.status(201).json({
//         success: true,
//         message: "User account created successfully",
//         response: response.rows,
//       });
//     }
//   } catch (error) {
//     if (error.constraint === "users_email_key") {
//       res.status(409).json({
//         success: false,
//         message: "The email already exists",
//       });
//     }
//     if (error.constraint === "chk_email") {
//       res.status(409).json({
//         success: false,
//         message: "The email you entered is not correct",
//       });
//     } else {
//       res.status(500).json({
//         message: "Server Error",
//         error: error.message,
//       });
//     }
//   }
// };

/**
 * POST /auth/register-with-activation
 */
const register = async (req, res) => {
  const { username, email, password, activation_code } = req.body;

  if (!username || !email || !password || !activation_code) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      err: error.message,
    });
  }

  try {
    /* ----------------------------------------------------
       1️⃣ Check activation code (Central DB)
    ---------------------------------------------------- */
    const codeResult = await activationDB.query(
      `
      SELECT
        id,
        book_id,
        role,
        is_used
      FROM activation_codes
      WHERE code = $1
      `,
      [activation_code]
    );

    if (!codeResult.rowCount) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation code",
        err: error.message,
      });
    }

    const code = codeResult.rows[0];

    if (code.is_used !== false) {
      return res.status(400).json({
        success: false,
        message: "Activation code already used",
        err: error.message,
      });
    }

    // ⬅️ اختياري: تأكد إنو الكود تابع لهذا الكتاب
    // if (code.book_slug !== "math-grade-3") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Activation code not valid for this book",
    //   });
    // }

    /* ----------------------------------------------------
       2️⃣ Register user (Book DB)
    ---------------------------------------------------- */
    const encryptedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
      INSERT INTO users
        (username, email, password, avatar_url, role_id)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const role_id = code.role === "student" ? 2 : 3;
    const insertValues = [
      username,
      email.toLowerCase(),
      encryptedPassword,
      "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg",
      role_id, // 🔐 الدور جاي من الاكتيفيشن كود
    ];

    let userId;
    try {
      const userResult = await client.query(insertUserQuery, insertValues);
      userId = userResult.rows[0].id;
    } catch (error) {
      if (error.constraint === "users_email_key") {
        return res.status(409).json({
          success: false,
          message: "The email already exists",
          err: error,
        });
      }

      if (error.constraint === "chk_email") {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
          err: error,
        });
      }

      throw error;
    }

    /* ----------------------------------------------------
       3️⃣ Mark activation code as used (Central DB)
    ---------------------------------------------------- */
    console.log(code.id);

    await activationDB.query(
      `
      UPDATE activation_codes
      SET
        is_used = TRUE,
        used_at = NOW()
      WHERE id = $1
      `,
      [code.id]
    );

    /* ----------------------------------------------------
       4️⃣ Success response
    ---------------------------------------------------- */
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user_id: userId,
    });
  } catch (error) {
    console.error("REGISTER WITH ACTIVATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      err: error,
    });
  }
};

//=================== login ======================//
const login = (req, res) => {
  const { password } = req.body;
  const { email } = req.body;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  client
    .query(query, data)
    .then((result) => {
      if (result.rows) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);

          if (response) {
            const payload = {
              userId: result.rows[0].id,
              role: result.rows[0].role_id,
            };
            const options = { expiresIn: "10d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId: result.rows[0].id,
                role: result.rows[0].role_id,
                username: result.rows[0].username,
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
    });
};

//===================get user by id ======================//
const getUserById = async (req, res) => {
  const id = req.token.userId;
  const values = [id];
  console.log(id);

  const query = `SELECT * FROM  users WHERE id=$1 AND is_deleted=0`;
  try {
    const response = await client.query(query, values);
    if (response.rowCount) {
      res.status(200).json({
        status: true,
        data: response.rows,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//===================get all users ======================//
const getAllUsers = async (req, res) => {
  const query = `SELECT * FROM  users`;
  try {
    const response = await client.query(query, values);
    if (response.rowCount) {
      res.status(200).json({
        status: true,
        data: response.rows,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================== update user ==================//
const updateUser = async (req, res) => {
  const { email, password } = req.body;
  const userId = req.params.id; // /users/:id

  // تحقق بسيط
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Nothing to update",
    });
  }

  try {
    const query = `
      UPDATE users
      SET
        email = COALESCE($1, email),
        password = COALESCE($2, password)
      WHERE id = $3
      RETURNING id, username, email;
    `;

    const values = [email || null, password || null, userId];

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================== delete user ==================
const deleteUser = async (req, res) => {
  const userId = req.params.id; // /users/:id

  try {
    const query = `
     UPDATE users
      SET
      is_deleted=1
      WHERE id = $1
      RETURNING *;
    `;

    const values = [userId];

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    // FK error (مثلاً user مرتبط بكلاس)
    if (error.code === "23503") {
      return res.status(409).json({
        status: false,
        message: "Cannot delete user because it has related data",
      });
    }

    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
