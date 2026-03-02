import {
  Download,
  FileText,
  Image,
  BookOpen,
  Printer,
  FileCheck,
  ArrowRight,
  Library,
  ChevronLeft,
  Users,
  Check,
  Copy,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { AppHeader } from "./AppHeader";
// import { User } from '../types';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/reducers/auth";
import userIcon from "../assets/users_white.svg";
import userGray from "../assets/user_gray.svg";
import tiger from "../assets/tiger_login.svg";
import background from "../assets/PDF_background.svg";
import writeIcon from "../assets/write icon nave.svg";
import {
  getTeacherClasses,
  getStudentsByClassId,
  createClass,
  deleteClassById,
  getClassById,
} from "../API/classrooms";
import { copyToClipboard } from "../utils/clipboard";
import { Classroom, ClassroomSingle, ClassStudent } from "../types";
import { StudentProgressView } from "./StudentProgressView";
export function ClassroomStudent() {
  const navigate = useNavigate();
  const { classroomId } = useParams<{ classroomId: string }>();
  const teacher = useSelector((state: RootState) => state.auth.user);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(
    null,
  );
  const handleCopyCode = (code: string) => {
    copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const [loadingStudents, setLoadingStudents] = useState(false);
  const fetchClassroom = async () => {
    try {
      const res = await getClassById(Number(classroomId));
      setClassroom(res.data.data); // لأنو الباك اند برجع array
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (classroomId) {
      fetchClassroom();
    }
  }, [classroomId]);

  const handleSelectClassroom = async (classId: number) => {
    setLoadingStudents(true);
    setSelectedClassroomId(classId);
    try {
      const res = await getStudentsByClassId(classId);
      setStudents(res.data.data);
    } catch (err) {
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };
  useEffect(() => {
    if (classroomId) {
      handleSelectClassroom(Number(classroomId));
    }
  }, [classroomId]);

  // عرض تفاصيل طالب محدد
  if (selectedStudentId && selectedClassroomId) {
    return (
      <div className="space-y-4" dir="rtl">
        {/* زر الرجوع */}

        <div className="flex items-center gap-3 md:gap-4">
          {/* زر تسجيل الخروج */}

          <motion.button
            className="fixed top-4 right-6 z-30 w-12 h-12 md:w-12 md:h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: "#FCFCFC" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setSelectedStudentId(null)}
          >
            <ArrowRight
              className="w-6 h-6 md:w-7 md:h-7"
              style={{ color: "#652b82" }}
            />
          </motion.button>
          <div
            className="relative w-full bg-[#f3f1f6] overflow-hidden flex"
            style={{ justifyContent: "space-between" }}
          >
            {/* اليسار - معلومات المستخدم وتسجيل الخروج */}

            {/* المحتوى */}
            <div
              className="relative flex justify-end items-center gap-3"
              dir="rtl"
              style={{ marginRight: "110px" }}
            >
              <img src={writeIcon} style={{ height: "35px", width: "35px" }} />
              <h1
                style={{
                  fontSize: "30px",
                  color: "#9E7DAC",
                  fontFamily: "tajawal",
                  fontWeight: "700",
                }}
              >
                {classroom?.name}
              </h1>
            </div>
            {/* شارة النوع */}
            <div className="relative flex justify-center items-center left-0 top-0">
              <img src={background} />
            </div>
          </div>
        </div>

        <StudentProgressView
          classroomId={selectedClassroomId}
          studentId={selectedStudentId}
        />
      </div>
    );
  }

  console.log(students, classroom);

  return (
    <div
      className="min-h-screen relative flex flex-col overflow-hidden"
      dir="rtl"
    >
      {/* الهيدر */}
      <div
        className="shadow-md h-64 shrink-0"
        style={{
          background: "#A68BB7",
        }}
      >
        {/* عناصر زخرفية */}
        <div className="overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -left-20 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10"
            style={{ backgroundColor: "#652b82" }}
            //   animate={{ scale: [1, 1.3, 1] }}
            //   transition={{ duration: 15, repeat: Infinity }}
          />
        </div>
        <div className="px-4 md:px-6 py-2 md:py-2.5 overflow-hidden">
          <div className="flex items-center justify-between" dir="rtl">
            {/* اليمين - اسم التطبيق */}
            <div className="flex items-center gap-2">
              {/* اليسار - معلومات المستخدم وتسجيل الخروج */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* زر تسجيل الخروج */}

                <motion.button
                  className="fixed top-4 right-6 z-30 w-12 h-12 md:w-12 md:h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: "#FCFCFC" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    navigate("/teacher/students/");
                  }}
                >
                  <ArrowRight
                    className="w-6 h-6 md:w-7 md:h-7"
                    style={{ color: "#652b82" }}
                  />
                </motion.button>
              </div>

              {/*النمر الموجود بالهيدر */}
              <motion.div
                className="absolute left-2 top-0 z-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.img
                  src={tiger}
                  alt="نمر"
                  className="tiger-choose-page w-64 md:w-64 lg:w-20 object-contain drop-shadow-2xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col justify-center items-center gap-2"
          style={{ marginTop: "20px" }}
        >
          <div className="flex justify-center items-center gap-3">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#E7E7E7] font-[tajawal] mb-3"
              style={{
                fontSize: "clamp(22px, 5vw, 50px)",
                color: "#FAF9FA",
                fontFamily: "tajawal",
                fontWeight: "700",
              }}
            >
              {classroom?.name}
            </h1>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white font-[tajawal]">
            <code
              className="px-4 py-2 rounded-xl text-lg"
              style={{
                color: "#FFFFFF",
                fontFamily: "tajawal",
                fontSize: "25px",
                fontWeight: "500",
              }}
            >
              {classroom?.code}
            </code>
            <button
              onClick={() => handleCopyCode(classroom.code)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              {copiedCode === classroom?.code ? (
                <Check className="w-5 h-5" style={{ color: "#10b981" }} />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <div
            className="w-full flex flex-col"
            style={{
              color: "#FFFFFF",
              fontFamily: "tajawal",
              fontSize: "25px",
              fontWeight: "500",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                color: "#FFFFFF",
                fontFamily: "tajawal",
                fontSize: "25px",
                fontWeight: "500",
                marginRight: "50px",
              }}
            >
              {students.length} طالب
            </div>
            <div
              className="w-full"
              style={{ backgroundColor: "#652B8257", padding: "8px" }}
            >
              <div
                className="flex"
                style={{
                  justifyContent: "space-between",
                  width: "50%",
                  marginRight: "50px",
                }}
              >
                <h3 className="flex items-center gap-4">
                  <img
                    src={userIcon}
                    style={{ height: "35px", width: "35px" }}
                  />
                  اسم الطالب
                </h3>
                <h3>البريد الأللكتروني</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6 z-50" dir="rtl">
        {/* قائمة الطلاب */}
        {students.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#f5f3f7" }}
            >
              <Users className="w-10 h-10" style={{ color: "#652b82" }} />
            </div>
            <p className="text-gray-600 mb-2">لا يوجد طلاب في هذا الصف</p>
            <p className="text-sm text-gray-400">
              شارك الكود مع الطلاب للانضمام
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {loadingStudents ? (
              <p className="text-center">جاري تحميل الطلاب...</p>
            ) : students.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <Users
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#652b82" }}
                />
                <p>لا يوجد طلاب في هذا الصف</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-6 py-4 gap-4 hover:shadow-lg transition-all ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-gray-200/60"
                    }`}
                  >
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className="px-5 py-4 rounded-xl flex items-center"
                      style={{
                        width: "50%",
                        justifyContent: "space-between",
                        marginRight: "50px",
                      }}
                    >
                      {/* الجهة اليمين (الاسم + الايقونة) */}
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400 text-xl">
                          <img
                            src={userGray}
                            style={{ height: "35px", width: "35px" }}
                          />
                        </div>{" "}
                        <span
                          className="text-gray-700 text-sm md:text-base"
                          style={{
                            fontSize: "20px",
                            color: "#7B7B7B",
                            fontFamily: "tajawal",
                            fontWeight: "400",
                          }}
                        >
                          {student.username}
                        </span>
                      </div>

                      {/* الايميل بالنص */}
                      <div className="text-gray-500 text-sm tracking-wide flex justify-center items-center">
                        <p
                          className="text-sm text-gray-500"
                          style={{
                            fontSize: "20px",
                            color: "#7B7B7B",
                            fontFamily: "tajawal",
                            fontWeight: "400",
                          }}
                        >
                          {student.email}
                        </p>
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
