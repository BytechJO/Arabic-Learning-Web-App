import { useState, useEffect } from "react";
import { Users, LogIn, ArrowRight, GraduationCap, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { storage } from "../utils/storage";
import { User } from "../types";
import { AppHeader } from "./AppHeader";
import { useNavigate } from "react-router-dom";
import { joinClassroomByCode } from "../API/classrooms";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses, fetchMyClass } from "../redux/reducers/classSlice";
import { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/reducers/auth";
import { clearMyClass } from "../redux/reducers/classSlice";
interface JoinClassroomProps {
  // student: User;
  onClose: () => void;
  // onJoined: () => void;
}

export function JoinClassroom({
  // student,
  onClose,
}: // onJoined,
JoinClassroomProps) {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { myClass: currentClassroom, allClasses } = useSelector(
    (state: RootState) => state.class
  );


  useEffect(() => {
    console.log("JOIN CLASS COMPONENT MOUNTED");

    dispatch(fetchMyClass());
    dispatch(fetchAllClasses());
  }, [dispatch]);


  const handleJoin = async () => {
    try {
      await joinClassroomByCode(classCode);

      // 🔥 رجّعي الصف من الباك إند
      dispatch(fetchMyClass());

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ");
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMyClass());
    navigate("/");
  };
  const handleToggleClasses = () => {
    setShowDebug((prev) => !prev);

    if (!showDebug) {
      dispatch(fetchAllClasses());
    }
  };
  return (
    <>
      {/* الهيدر - خارج container الرئيسي */}
      <div className="relative z-50">
        <AppHeader
          showUserInfo={true}
          onLogout={handleLogout}
          showBackButton={false}
          onBack={onClose}
        />
      </div>

      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        {/* خلفية متدرجة */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-50"></div>

        {/* عناصر زخرفية متحركة */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-56 h-56 md:w-64 md:h-64 rounded-full opacity-10"
            style={{ backgroundColor: "#fad656" }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10"
            style={{ backgroundColor: "#652b82" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        {/* زر الرجوع العائم في أعلى اليمين */}
        <motion.button
          onClick={onClose}
          className="fixed top-24 right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: "#fad656" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ArrowRight
            className="w-6 h-6 md:w-7 md:h-7"
            style={{ color: "#652b82" }}
          />
        </motion.button>

        {/* المحتوى الرئيسي */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-8">
          {/* العنوان الرئيسي */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1
              className="text-4xl md:text-5xl mb-3"
              style={{ color: "#652b82" }}
            >
              صفي الدراسي
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              {currentClassroom
                ? "أنت مسجل في الصف التالي"
                : "انضم إلى صفك وابدأ التعلم"}
            </p>
          </motion.div>

          {/* البطاقة الرئيسية */}
          <motion.div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            style={{ border: "3px solid #652b82" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* دوائر ديكور */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
              style={{
                backgroundColor: "#fad656",
                transform: "translate(30%, -30%)",
              }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20"
              style={{
                backgroundColor: "#fad656",
                transform: "translate(-30%, 30%)",
              }}
            ></div>

            <div className="relative">
              {/* الأيقونة */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "#fad656" }}
                >
                  <Users
                    className="w-10 h-10 md:w-12 md:h-12"
                    style={{ color: "#652b82" }}
                  />
                </div>
              </div>

              {currentClassroom ? (
                <motion.div
                  className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-purple-50 to-yellow-50"
                  style={{ border: "3px solid #652b82" }}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                >
                  <div className="relative flex items-center gap-3 mb-4">
                    <div
                      className="p-3 rounded-full shadow-md"
                      style={{ backgroundColor: "#fad656" }}
                    >
                      <Users className="w-6 h-6" style={{ color: "#652b82" }} />
                    </div>
                    <div>
                      <h3
                        className="text-xl md:text-2xl"
                        style={{ color: "#652b82" }}
                      >
                        {currentClassroom.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        صفك الحالي
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-gray-700 text-sm md:text-base">
                      <span className="text-gray-600">كود الصف: </span>
                      <code
                        style={{ color: "#652b82" }}
                        className="font-bold text-base md:text-lg"
                      >
                        {currentClassroom.code}
                      </code>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {success ? (
                    <motion.div
                      className="rounded-2xl text-center p-6 bg-gradient-to-br from-green-50 to-green-100"
                      style={{ border: "3px solid #10b981" }}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      <div className="text-5xl mb-4">✅</div>
                      <p className="text-lg" style={{ color: "#065f46" }}>
                        تم الانضمام للصف بنجاح!
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {error && (
                        <motion.div
                          className="rounded-2xl mb-4 p-4 bg-gradient-to-br from-red-50 to-red-100"
                          style={{ border: "3px solid #ef4444" }}
                          initial={{ x: -10 }}
                          animate={{ x: 0 }}
                        >
                          <p
                            className="text-center"
                            style={{ color: "#991b1b" }}
                          >
                            {error}
                          </p>
                        </motion.div>
                      )}

                      <div className="mb-6">
                        <label className="block text-gray-700 mb-3 text-sm md:text-base text-center">
                          أدخل كود الصف الذي قدمه لك المعلم
                        </label>
                        <input
                          type="text"
                          value={classCode}
                          onChange={(e) =>
                            setClassCode(e.target.value.toUpperCase())
                          }
                          placeholder="مثال: ABC123"
                          className="w-full px-4 py-3 rounded-2xl outline-none text-center text-xl md:text-2xl font-bold tracking-wider transition-all"
                          style={{ border: "3px solid #e5e7eb" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#652b82")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#e5e7eb")
                          }
                          maxLength={6}
                        />
                      </div>

                      <button
                        onClick={handleJoin}
                        className="w-full text-white py-3 md:py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all hover:shadow-xl hover:scale-105"
                        style={{ backgroundColor: "#652b82" }}
                      >
                        <LogIn className="w-5 h-5" />
                        <span className="text-base md:text-lg">انضم للصف</span>
                      </button>

                      <div
                        className="mt-6 rounded-2xl p-4 bg-gradient-to-br from-yellow-50 to-yellow-100"
                        style={{ border: "2px solid #fad656" }}
                      >
                        <p className="text-xs md:text-sm text-gray-700 text-center">
                          <span style={{ color: "#652b82" }}>💡 ملاحظة:</span>{" "}
                          اطلب من معلمك كود الصف للانضمام إلى صفه الدراسي
                        </p>
                      </div>

                      {/* قسم مساعدة للاختبار - يعرض الصفوف المتاحة */}
                      {allClasses.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={handleToggleClasses}
                            className="text-xs text-gray-400 hover:text-gray-600 underline w-full text-center"
                          >
                            {showDebug ? "إخفاء" : "عرض"} الصفوف المتاحة
                            للاختبار
                          </button>
                          {showDebug && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs">
                              <p className="text-gray-600 mb-2">
                                الصفوف المتاحة:
                              </p>
                              <div className="space-y-1">
                                {allClasses.map((classroom) => (
                                  <div
                                    key={classroom.id}
                                    className="flex items-center justify-between bg-white px-2 py-1 rounded"
                                  >
                                    <span className="text-gray-700">
                                      {classroom.name}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setClassCode(classroom.code)
                                      }
                                      className="font-mono font-bold"
                                      style={{ color: "#652b82" }}
                                    >
                                      {classroom.code}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
