const pool = require("./models/db"); // أو مكان الاتصال بالـ DB
require("dotenv").config();

const seedQuestions = async () => {
  try {
    await pool.connect();

    const questions = [
      {
        letter_id: 1,
        lesson_id: 2,
        question_text: JSON.stringify({
          word: "أَسَد",
          position: "البداية",
        }),
        correct_answer: "start",
        question_type: "position",
      },
    ];

    for (const q of questions) {
      await pool.query(
        `
        INSERT INTO questions_lessons
        (letter_id, lesson_id, question_text, correct_answer, question_type)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          q.letter_id,
          q.lesson_id,
          q.question_text,
          q.correct_answer,
          q.question_type,
        ]
      );
    }

    console.log("✅ Questions seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedQuestions();
