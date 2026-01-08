// 🔐 Role Controller

// ليش؟ صلاحيات

// Functions:
// createRole
// getAllRoles

// 🔑 Permission Controller

// Functions:
// createPermission
// getAllPermissions
// createPermissionToRole
// getRolePermissions

// 👤 Users Controller

// Functions:

// createUser
// loginUser
// getAllUsers
// getUserById
// updateUser
// deleteUser

// 🏫 Class Controller

// Functions:

// createClass
// getAllClasses
// getClassById
// updateClass
// deleteClass
// getTeacherClasses


// 👩‍🎓 ClassStudent Controller (Relation Table)

// Functions:

// addStudentToClass
// removeStudentFromClass
// getStudentClasses

// 🔤 Letters Controller

// Functions:

// createLetter
// getAllLetters
// getLetterById
// updateLetter
// deleteLetter

// 📚 LetterLessons Controller

// Functions:

// createLesson
// getLessonsByLetter
// getLessonById
// updateLesson
// deleteLesson

// 🎥 VideoLessons Controller

// Functions:

// addVideoLesson
// getVideoLessonsByLetter
// getVideoLessonById
// updateVideoLesson
// deleteVideoLesson

// 🎮 GamesLessons Controller

// Functions:

// addGameLesson
// getGamesByLetter
// getGameById
// updateGame
// deleteGame

// ❓ QuestionsLessons Controller

// Functions:

// addQuestion
// getQuestionsByLesson
// updateQuestion
// deleteQuestion

// 📈 UserProgress Controller

// Functions:

// updateProgress
// getUserProgress
// markLessonCompleted
// getUserLetterProgress

// ✍️ StudentAnswers Controller

// Functions:

// submitAnswer
// getUserAnswersByLesson
// getQuestionAnswers
// deleteAnswer

// 🧮 StudentLessonResult Controller

// Functions:

// submitLessonResult
// getLessonResult
// getUserLessonResults