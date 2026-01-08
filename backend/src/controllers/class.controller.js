const client = require("../models/db");
const crypto = require("crypto");

const generateSecureCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(length);
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length];
  }

  return code;
};

//===================create new class ======================//
const createNewClass = async (req, res) => {
  const { name } = req.body;
  const teacher_id = req.token.userId;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Class name is required",
    });
  }

  const classCode = generateSecureCode();
  console.log(classCode);

  const query = `
    INSERT INTO "class" (name, code, teacher_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [name, classCode, teacher_id];

  try {
    const response = await client.query(query, values);

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: response.rows[0],
    });
  } catch (error) {
    // في حال خليتي code UNIQUE
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Class code already exists, try again",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
//===================get All Classes for admin ======================//
const getAllClasses = async (req, res) => {
  const query = `SELECT * FROM  "class" WHERE is_deleted=0`;
  try {
    const response = await client.query(query);
    if (response.rowCount) {
      res.status(200).json({
        status: true,
        data: response.rows,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Class not found",
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

//===================get All Classes by admin and teacher for admin ======================//
const getClassById = async (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM  "class"  Where id=$1 and is_deleted=0`;
  try {
    const response = await client.query(query, [id]);
    if (response.rowCount) {
      res.status(200).json({
        status: true,
        data: response.rows,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Class not found",
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

//===================update class name ======================//
const updateClassName = async (req, res) => {
  const id = req.params.id;
  const teacher_id = req.token.userId;
  const { name } = req.body;

  const query = `
    UPDATE "class"
    SET name = $1
    WHERE id = $2 AND teacher_id=$3 AND is_deleted = 0
    RETURNING *;
  `;

  try {
    const response = await client.query(query, [name, id, teacher_id]);

    if (response.rowCount) {
      res.status(200).json({
        status: true,
        data: response.rows[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Class not found",
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

//===================delete class teacher and admin ======================//
const deleteClass = async (req, res) => {
  const id = req.params.id;
  const teacher_id = req.token.userId;

  const query = `
    UPDATE "class"
    SET is_deleted=1
    WHERE id = $1 AND teacher_is=$2 
    RETURNING *;
  `;

  try {
    const response = await client.query(query, [id, teacher_id]);

    if (response.rowCount) {
      res.status(200).json({
        status: true,
        data: response.rows[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Class not found",
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

//===================get All Classes by teacher_id  ======================//
const getClassByTeacherId = async (req, res) => {
  const teacher_id = req.token.userId;
  const query = `SELECT * FROM  "class"  Where teacher_id=$1 AND is_deleted=0`;
  try {
    const response = await client.query(query, [teacher_id]);
    if (response.rowCount) {
      res.status(200).json({
        status: true,
        data: response.rows,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Theres is no class",
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

//=================== addStudentToClass   ======================//
const addStudentToClass = async (req, res) => {
  const class_id = req.params.id;
  const { student_id } = req.body;

  const query = `
    INSERT INTO class_student (class_id, student_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    const response = await client.query(query, [class_id, student_id]);

    res.status(201).json({
      status: true,
      message: "Student added to class successfully",
      data: response.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  createNewClass,
  getAllClasses,
  getClassById,
  updateClassName,
  deleteClass,
  getClassByTeacherId
};
