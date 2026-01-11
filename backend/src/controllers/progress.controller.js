const client = require("../models/db");

//==================== upsertUserProgress ===================
const upsertUserProgress = async (req, res) => {
  const { user_id, letter_id, lesson_id, lesson_type, score, completed } =
    req.body;

  try {
    const query = `
      INSERT INTO user_progress
      (user_id, letter_id, lesson_id, lesson_type, score, completed, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET
        score = EXCLUDED.score,
        completed = EXCLUDED.completed,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await client.query(query, [
      user_id,
      letter_id,
      lesson_id,
      lesson_type,
      score ?? 0,
      completed ?? false,
    ]);

    res.status(200).json({
      success: true,
      message: "Progress saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//==================== getUserProgressByLetter ===================

const getUserProgressByLetter = async (req, res) => {
  const { user_id, letter_id } = req.params;

  try {
    const query = `
      SELECT *
      FROM user_progress
      WHERE user_id = $1 AND letter_id = $2
      ORDER BY updated_at DESC;
    `;

    const result = await client.query(query, [user_id, letter_id]);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//==================== getUserProgressSummary ===================
const getUserProgressSummary = async (req, res) => {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT
        ll.letter_id,
        COUNT(ll.id) AS total_lessons,
        COUNT(up.id) FILTER (WHERE up.completed = true) AS completed_lessons
      FROM letter_lessons ll
      LEFT JOIN user_progress up
        ON up.lesson_id = ll.id
        AND up.user_id = $1
      GROUP BY ll.letter_id
      ORDER BY ll.letter_id;
    `;

    const result = await client.query(query, [user_id]);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//==================== addStudentAnswer ===================
const addStudentAnswer = async (req, res) => {
  const { lessons_id, user_id, question_id, answer, is_correct, score } =
    req.body;

  try {
    const query = `
      INSERT INTO student_answers
      (lessons_id, user_id, question_id, answer, is_correct, score, answerd_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;

    const result = await client.query(query, [
      lessons_id,
      user_id,
      question_id,
      answer,
      is_correct,
      score ?? 0,
    ]);

    res.status(201).json({
      success: true,
      message: "Answer saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//================= جميع إجابات الطالب داخل ليسون
const getAnswersByLessonAndUser = async (req, res) => {
  const { lessons_id, user_id } = req.params;
  console.log("lessons_id:", lessons_id);
  console.log("user_id:", user_id);

  try {
    const query = `
      SELECT sa.*, q.question_text, q.correct_answer
      FROM student_answers sa
      JOIN questions_lessons q ON q.id = sa.question_id
      WHERE sa.lessons_id = $1 AND sa.user_id = $2
      ORDER BY sa.answerd_at;
    `;

    const result = await client.query(query, [lessons_id, user_id]);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//================== نتيجة الليسون (سكور + عدد الصح)
const getLessonResult = async (req, res) => {
  const { lessons_id, user_id } = req.params;

  try {
    const query = `
      SELECT
        COUNT(*) AS total_questions,
        COUNT(*) FILTER (WHERE is_correct = true) AS correct_answers,
        SUM(score) AS total_score
      FROM student_answers
      WHERE lessons_id = $1 AND user_id = $2;
    `;

    const result = await client.query(query, [lessons_id, user_id]);

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//=====================آخر محاولة للسؤال (اختياري)
const getLastAnswerByQuestion = async (req, res) => {
  const { question_id, user_id } = req.params;

  try {
    const query = `
      SELECT *
      FROM student_answers
      WHERE question_id = $1 AND user_id = $2
      ORDER BY answerd_at DESC
      LIMIT 1;
    `;

    const result = await client.query(query, [question_id, user_id]);

    res.status(200).json({
      success: true,
      data: result.rows[0] ?? null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
//=====================submitAnswer=====================
const submitAnswer = async (req, res) => {
  const { lessons_id, user_id, question_id, answer } = req.body;

  try {
    const q = await client.query(
      `SELECT correct_answer
       FROM questions_lessons
       WHERE id = $1`,
      [question_id]
    );

    const correctAnswer = q.rows[0].correct_answer;

    const isCorrect =
      correctAnswer.trim().toLowerCase() === answer.trim().toLowerCase();

    const score = isCorrect ? 1 : 0;

    const query = `
      INSERT INTO student_answers
        (lessons_id, user_id, question_id, answer, is_correct, score, answerd_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (lessons_id, user_id, question_id)
      DO UPDATE SET
        answer = EXCLUDED.answer,
        is_correct = EXCLUDED.is_correct,
        score = EXCLUDED.score,
        answerd_at = NOW()
      RETURNING *;
    `;

    const result = await client.query(query, [
      lessons_id,
      user_id,
      question_id,
      answer,
      isCorrect,
      score,
    ]);

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//=====================createOrUpdateLessonResult=====================
const calculateLessonResult = async (req, res) => {
  const { lessons_id, user_id } = req.body;

  try {
    // 1️⃣ حساب مجموع السكور
    const scoreResult = await client.query(
      `
      SELECT COALESCE(SUM(score), 0) AS total_score
      FROM student_answers
      WHERE lessons_id = $1 AND user_id = $2
      `,
      [lessons_id, user_id]
    );

    const totalScore = scoreResult.rows[0].total_score;

    // 2️⃣ UPSERT
    const query = `
      INSERT INTO student_lesson_result
        (lessons_id, user_id, total_score, is_completed, updated_at)
      VALUES ($1, $2, $3, false, NOW())
      ON CONFLICT (lessons_id, user_id)
      DO UPDATE SET
        total_score = EXCLUDED.total_score,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await client.query(query, [lessons_id, user_id, totalScore]);

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//=====================getLessonResultByUser=====================

const getLessonResultByUser = async (req, res) => {
  const { lessons_id, user_id } = req.params;

  try {
    const result = await client.query(
      `
      SELECT *
      FROM student_lesson_result
      WHERE lessons_id = $1 AND user_id = $2
      `,
      [lessons_id, user_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//=====================getAllLessonResultsByUser=====================

const getAllLessonResultsByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await client.query(
      `
      SELECT slr.*, ll.title, ll.type
      FROM student_lesson_result slr
      JOIN letter_lessons ll ON ll.id = slr.lessons_id
      WHERE slr.user_id = $1
      ORDER BY slr.updated_at DESC
      `,
      [user_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const markLessonCompleted = async (req, res) => {
  const { lessons_id, user_id } = req.body;

  try {
    const result = await client.query(
      `
      UPDATE student_lesson_result
      SET is_completed = true,
          updated_at = NOW()
      WHERE lessons_id = $1 AND user_id = $2
      RETURNING *;
      `,
      [lessons_id, user_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  upsertUserProgress,
  getUserProgressByLetter,
  getUserProgressSummary,
  addStudentAnswer,
  getAnswersByLessonAndUser,
  getLessonResult,
  getLastAnswerByQuestion,
  submitAnswer,
  calculateLessonResult,
  getLessonResultByUser,
  getAllLessonResultsByUser,
  markLessonCompleted,
};
