const client = require("../models/db");

//==================== upsertUserProgress ===================
const upsertUserProgress = async (req, res) => {
  const { letter_id, lesson_id, lesson_type, score, completed } = req.body;
  const user_id = req.token.userId;
  try {
    const query = `
      INSERT INTO user_progress
      (user_id, letter_id, lesson_id, lesson_type, score, completed, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, letter_id, lesson_id)
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

//==================== getCurrentLessonForLetter ===================
const getCurrentLessonForLetter = async (req, res) => {
  const { letter_id } = req.params;
  const user_id = req.token.userId;

  try {
    const query = `
      SELECT 
        ll.id AS lesson_id,
        ll.title,
        ll.order_index,
        COALESCE(up.completed, false) AS completed
      FROM letter_lessons ll
      LEFT JOIN user_progress up
        ON up.lesson_id = ll.id
        AND up.user_id = $1
      WHERE ll.letter_id = $2
      ORDER BY ll.order_index ASC;
    `;

    const result = await client.query(query, [user_id, letter_id]);

    // أول درس غير مكتمل
    const currentLesson = result.rows.find(
      (lesson) => lesson.completed === false
    );

    // الطالب مخلص كل الدروس
    if (!currentLesson) {
      const completedLessons = result.rows.map((lesson) => ({
        lesson_id: lesson.lesson_id,
        title: lesson.title,
        order_index: lesson.order_index,
      }));

      return res.status(200).json({
        success: true,
        data: {
          completed_all: true,
          completed_lessons: completedLessons,
        },
      });
    }

    // لسه في دروس
    res.status(200).json({
      success: true,
      data: {
        completed_all: false,
        currentLesson: {
          lesson_id: currentLesson.lesson_id,
          title: currentLesson.title,
          order_index: currentLesson.order_index,
        },
      },
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
  const { lessons_id, question_id, answer } = req.body;
  const user_id = req.token.userId;
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
  const { lessons_id } = req.body;
  const user_id = req.token.userId;
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


const checkLetterCompletion = async (req, res) => {
  try {
    const userId = req.token.userId;
    const { letterId } = req.params;

    // 1️⃣ عدد الدروس الكلي (ثابت لكل الحروف)
    const totalLessonsQuery = `
      SELECT COUNT(*) AS total
      FROM letter_lessons
    `;

    // 2️⃣ عدد الدروس المكتملة لهذا الحرف عند الطالب
    const completedLessonsQuery = `
      SELECT COUNT(DISTINCT lesson_id) AS completed
      FROM user_progress
      WHERE user_id = $1
        AND letter_id = $2
        AND completed = true
    `;

    const [{ rows: totalRows }, { rows: completedRows }] = await Promise.all([
      client.query(totalLessonsQuery),
      client.query(completedLessonsQuery, [userId, letterId]),
    ]);

    const totalLessons = Number(totalRows[0].total);
    const completedLessons = Number(completedRows[0].completed);

    const isCompleted = totalLessons > 0 && totalLessons === completedLessons;

    // 3️⃣ جلب الحرف التالي
    const nextLetterQuery = `
      SELECT id, symbol, name
      FROM letters
      WHERE id > $1
      ORDER BY id ASC
      LIMIT 1
    `;

    const nextLetterResult = await client.query(nextLetterQuery, [letterId]);

    const nextLetter = nextLetterResult.rows[0] || null;

    res.status(200).json({
      letterId: Number(letterId),
      totalLessons,
      completedLessons,
      isCompleted,
      unlockNextLetter: isCompleted && !!nextLetter,
      nextLetter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to check letter completion",
    });
  }
};



 const getUserLettersStatus = async (req, res) => {
  try {
    const userId = req.token.userId;

    // 1️⃣ كل الحروف بالترتيب
    const lettersQuery = `
      SELECT id, symbol, name
      FROM letters
      ORDER BY id ASC
    `;

    // 2️⃣ عدد الدروس الكلي
    const totalLessonsQuery = `
      SELECT COUNT(*) AS total
      FROM letter_lessons
    `;

    // 3️⃣ الدروس المكتملة لكل حرف عند الطالب
    const progressQuery = `
      SELECT letter_id, COUNT(DISTINCT lesson_id) AS completed
      FROM user_progress
      WHERE user_id = $1
        AND completed = true
      GROUP BY letter_id
    `;

    const [lettersRes, totalLessonsRes, progressRes] =
      await Promise.all([
        client.query(lettersQuery),
        client.query(totalLessonsQuery),
        client.query(progressQuery, [userId]),
      ]);

    const letters = lettersRes.rows;
    const totalLessons = Number(totalLessonsRes.rows[0].total);

    // خريطة إنجاز الطالب
    const progressMap = {};
    progressRes.rows.forEach((row) => {
      progressMap[row.letter_id] = Number(row.completed);
    });

    let firstUnlockedFound = false;

    const lettersWithStatus = letters.map((letter) => {
      const completedLessons = progressMap[letter.id] || 0;
      const isCompleted =
        totalLessons > 0 && completedLessons === totalLessons;

      let status = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (!firstUnlockedFound) {
        status = "unlocked";
        firstUnlockedFound = true;
      }

      return {
        ...letter,
        status, // locked | unlocked | completed
      };
    });

    res.status(200).json({
      totalLessons,
      letters: lettersWithStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get letters status",
    });
  }
};
const getStudentProgress = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await client.query(
      `SELECT id, name, email FROM users WHERE id = $1`,
      [studentId]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const stats = await getStudentStats(studentId);
    const activityScores = await getActivityScores(studentId);
    const recentActivities = await getRecentActivities(studentId);

    res.json({
      success: true,
      data: {
        student: student.rows[0],
        ...stats,
        activityScores,
        recentActivities,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
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
  getCurrentLessonForLetter,
  checkLetterCompletion,getUserLettersStatus,getStudentProgress
};
