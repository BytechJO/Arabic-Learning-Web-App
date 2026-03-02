import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Copy,
  Check,
  X,
  Star,
  Award,
  UserX,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Trash2,
} from "lucide-react";
import { storage } from "../utils/storage";
import { copyToClipboard } from "../utils/clipboard";
import { Classroom, User, ClassStudent } from "../types";
import { StudentProgressView } from "./StudentProgressView";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import trashIcon from "../assets/delete icon.svg";
import writeIcon from "../assets/write icon.svg";
import writeIconNavey from "../assets/write icon nave.svg";
import addIcon from "../assets/addIcon.svg";
import {
  getTeacherClasses,
  getStudentsByClassId,
  createClass,
  deleteClassById,
} from "../API/classrooms";
import { AnimatePresence, motion } from "framer-motion";
import { ClassroomStudent } from "./ClassroomStudent";

// interface ClassroomManagementProps {
//   teacher: User;
//   onClose: () => void;
// }

export function ClassroomManagement() {
  const navigate = useNavigate()
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Classroom | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  const teacher = useSelector((state: RootState) => state.auth.user);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await getTeacherClasses();
      setClassrooms(res.data.data);
    } catch (error) {
      console.log(error);

      // console.error("فشل تحميل الصفوف", error);
    }
  };
  const handleSelectClassroom = async (classId: number) => {
    navigate(`/teacher/students/${classId}`)

  };
  const handleCreateClassroom = async () => {
    if (!newClassName.trim()) return;

    try {
      const res = await createClass(newClassName);

      // إضافة الصف الجديد مباشرة للقائمة
      await fetchClassrooms();

      setNewClassName("");
      setShowCreateForm(false);
    } catch (error: any) {
      console.log(error);

      if (error.response?.status === 409) {
        alert("كود الصف موجود مسبقًا، حاول مرة ثانية");
      } else {
        alert("فشل إنشاء الصف");
      }
    }
  };
  // const handleCopyCode = (code: string) => {
  //   copyToClipboard(code);
  //   setCopiedCode(code);
  //   setTimeout(() => setCopiedCode(null), 2000);
  // };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setClassToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;

    try {
      await deleteClassById(classToDelete.id);

      setClassrooms((prev) => prev.filter((c) => c.id !== classToDelete.id));

      handleCancelDelete();
    } catch (error) {
      console.error(error);
      alert("فشل حذف الصف");
    }
  };

  // // عرض تفاصيل طالب محدد
  // if (selectedStudentId && selectedClassroomId) {
  //   return (
  //     <div className="space-y-4" dir="rtl">
  //       {/* زر الرجوع */}
  //       <button
  //         onClick={() => setSelectedStudentId(null)}
  //         className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md"
  //         style={{ backgroundColor: "#652b82" }}
  //       >
  //         <ChevronRight className="w-4 h-4" />
  //         <span>العودة لقائمة الطلاب</span>
  //       </button>

  //       <StudentProgressView
  //         classroomId={selectedClassroomId}
  //         studentId={selectedStudentId}
  //       />
  //     </div>
  //   );
  // }


  // عرض قائمة الصفوف الرئيسية
  return (
    <div dir="rtl">
      <AnimatePresence>
        {showDeleteModal && classToDelete && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelDelete}
          >
            <motion.div
              className="bg-white p-6 md:p-8 shadow-2xl text-center max-w-sm mx-4 flex flex-col items-center"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* أيقونة التحذير */}
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fee2e2" }}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <span className="text-3xl md:text-4xl">⚠️</span>
              </motion.div>

              {/* العنوان */}
              <motion.h2
                className="text-2xl md:text-3xl mb-2"
                style={{ color: "#652b82" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                تأكيد الحذف
              </motion.h2>

              {/* الرسالة */}
              <motion.p
                className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                هل أنت متأكد من حذف الصف
                <br />
                <span className="font-semibold" style={{ color: "#652b82" }}>
                  {classToDelete.name}
                </span>
                ؟
                <br />
                لا يمكن التراجع عن هذا الإجراء.
              </motion.p>

              {/* الأزرار */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleCancelDelete}
                  className="px-5 py-2.5 rounded-xl border-2"
                  style={{
                    borderColor: "#652b82",
                    color: "#652b82",
                    backgroundColor: "white",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  إلغاء
                </motion.button>

                <motion.button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl text-white shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {classrooms.length === 0 ? (
          <div>
            <div
              className="text-center py-16 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center"
              style={{ gap: "25px" }}
            >
              <div
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#f5f3f7" }}
              >
                <img src={writeIconNavey} />
              </div>
              <p
                style={{
                  color: "#3E3E3E",
                  fontFamily: "tajawal",
                  fontSize: "25px",
                  fontWeight: "400",
                }}
              >
                لا توجد صفوف بعد
              </p>
              <div className="flex items-center justify-center gap-4">
                <p
                  className="text-sm text-gray-400 mt-2"
                  style={{
                    color: "#3E3E3E",
                    fontFamily: "tajawal",
                    fontSize: "20px",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  إنشاء صف جديد
                </p>
                <motion.button
                  className="w-8 h-8 rounded-2xl flex items-center justify-center transition"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -4, 4, -4, 0],
                  }}
                  whileTap={{
                    scale: 0.85,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: "#FDC333",
                    color: "#3E3E3E",
                    fontFamily: "tajawal",
                    fontSize: "20px",
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-7 h-7" />
                </motion.button>
              </div>
            </div>
            <AnimatePresence>
              {showCreateModal && (
                <motion.div
                  className="fixed inset-0 flex items-center justify-center z-50"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewClassName("");
                  }}
                >
                  <motion.div
                    className="bg-white p-8 shadow-2xl text-center max-w-md mx-4 flex flex-col items-center rounded-2xl"
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* أيقونة */}
                    <motion.div
                      className="w-16 h-16 mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#fef3c7" }}
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <span className="text-3xl">
                        <img src={writeIconNavey} />
                      </span>
                    </motion.div>

                    {/* العنوان */}
                    <motion.h2
                      className="text-2xl mb-4"
                      style={{ color: "#652b82" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      إضافة صف جديد
                    </motion.h2>

                    {/* الانبوت */}
                    <motion.input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="اسم الصف (مثال: الصف الأول - أ)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FDC333] outline-none mb-6"
                      style={{ backgroundColor: "#f5f3f7" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    />

                    {/* الأزرار */}
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => {
                          setShowCreateModal(false);
                          setNewClassName("");
                        }}
                        className="px-5 py-2.5 rounded-xl border-2"
                        style={{
                          borderColor: "#652b82",
                          color: "#652b82",
                          backgroundColor: "white",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        إلغاء
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleCreateClassroom();
                          setShowCreateModal(false);
                        }}
                        className="px-5 py-2.5 rounded-xl shadow-lg"
                        style={{
                          backgroundColor: "#FDC333",
                          color: "#2D2D2D",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        إضافة
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto text-white" dir="rtl">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="text-white py-2.5 px-5 flex items-center hover:opacity-90 transition-all shadow-md"
                style={{
                  backgroundColor: "#FDC333",
                  color: "#3E3E3E",
                  fontFamily: "tajawal",
                  fontSize: "20px",
                  fontWeight: "400",
                }}
              >
                <Plus className="w-5 h-5" />
                <span>إنشاء صف جديد</span>
              </motion.button>
            </div>
            {showCreateForm && (
              <div
                className="bg-white p-6 shadow-lg border-2"
                style={{ marginBottom: "20px" }}
              >
                <div className="flex justify-center items-center">
                  <label
                    style={{
                      width: "15%",
                      color: "#3E3E3E",
                      fontFamily: "tajawal",
                      fontSize: "25px",
                      fontWeight: "400",
                    }}
                  >
                    اسم الصف
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="اسم الصف (مثال: الصف الأول - أ)"
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fad656] outline-none mb-4"
                    style={{ backgroundColor: "#f5f3f7" }}
                  />
                </div>
                <div
                  className="flex flex-row justify-end gap-3"
                  style={{ justifyContent: "flex-end" }}
                >
                  <button
                    onClick={handleCreateClassroom}
                    className="w-40 text-white py-1 rounded hover:opacity-90 shadow-md"
                    style={{
                      backgroundColor: "#FDC333",
                      color: "#2D2D2D",
                      fontFamily: "tajawal",
                      fontSize: "25px",
                      fontWeight: "500",
                    }}
                  >
                    اضافة
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewClassName("");
                    }}
                    className="w-40 py-1 rounded hover:opacity-90"
                    style={{
                      backgroundColor: "#FDC333",
                      color: "#2D2D2D",
                      fontFamily: "tajawal",
                      fontSize: "25px",
                      fontWeight: "500",
                    }}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
            {/* Header */}
            <div
              className="grid grid-cols-4 px-6 py-4"
              style={{
                fontFamily: "tajawal",
                fontSize: "25px",
                fontWeight: "700",
              }}
            >
              <div>اسم الصف</div>
              <div className="text-center">كود الصف</div>
              <div className="text-center">عدد الطلاب</div>
              <div></div>
            </div>

            {/* Rows */}
            {classrooms.map((classroom, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                onClick={() => handleSelectClassroom(classroom.id)}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="grid grid-cols-4 items-center px-6 py-5 mb-4 rounded backdrop-blur-md"
                style={{
                  background: "linear-gradient(90deg, #8e63b0, #b89ad3)",
                  height: "80px",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center justify-between">
                  <img src={writeIcon} />
                  <motion.span
                    style={{
                      fontFamily: "tajawal",
                      fontSize: "20px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    whileHover={{
                      scale: 1.3,
                    }}
                    whileTap={{
                      scale: 0.85,
                    }}
                    onClick={() => handleSelectClassroom(classroom.id)}
                  >
                    {" "}
                    {classroom.name}
                  </motion.span>
                </div>

                <div
                  className="text-center tracking-widest"
                  style={{
                    fontFamily: "tajawal",
                    fontSize: "22px",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  {classroom.code}
                </div>

                <div
                  className="text-center"
                  style={{
                    fontFamily: "tajawal",
                    fontSize: "22px",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  {classroom.students_count} طالب
                </div>

                <motion.div className="flex justify-center">
                  <motion.button
                    className="transition text-xl"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -4, 4, -4, 0],
                    }}
                    whileTap={{
                      scale: 0.85,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setClassToDelete(classroom);
                      setShowDeleteModal(true);
                    }}
                  >
                    <motion.img
                      src={trashIcon}
                      style={{ height: "35px", width: "35px" }}
                      whileHover={{ rotate: 10 }}
                    />
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
