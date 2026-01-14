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
import {
  progressTracking,
  getScoreColor,
  getScoreText,
} from "../utils/progressTracking";
import { createDemoProgressForStudent } from "../utils/seedData";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/reducers/auth";
import {
  getTeacherClasses,
  getStudentsByClassId,
  createClass,
  deleteClassById,
} from "../API/classrooms";
import { AnimatePresence, motion } from "framer-motion";

// interface ClassroomManagementProps {
//   teacher: User;
//   onClose: () => void;
// }

export function ClassroomManagement() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Classroom | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
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
      console.error("فشل تحميل الصفوف", error);
    }
  };
  const handleSelectClassroom = async (classId: number) => {
    setSelectedClassroomId(classId);
    setLoadingStudents(true);

    try {
      const res = await getStudentsByClassId(classId);
      setStudents(res.data.data);
    } catch (err) {
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
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
      if (error.response?.status === 409) {
        alert("كود الصف موجود مسبقًا، حاول مرة ثانية");
      } else {
        alert("فشل إنشاء الصف");
      }
    }
  };
  const handleCopyCode = (code: string) => {
    copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStudentInfo = (studentId: string) => {
    return storage.getUserById(studentId);
  };

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

  // عرض تفاصيل طالب محدد
  if (selectedStudentId && selectedClassroomId) {
    const student = storage.getUserById(selectedStudentId);
    if (!student) {
      setSelectedStudentId(null);
      return null;
    }

    return (
      <div className="space-y-4" dir="rtl">
        {/* زر الرجوع */}
        <button
          onClick={() => setSelectedStudentId(null)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md"
          style={{ backgroundColor: "#652b82" }}
        >
          <ChevronRight className="w-4 h-4" />
          <span>العودة لقائمة الطلاب</span>
        </button>

        <StudentProgressView
          classroomId={selectedClassroomId}
          studentId={selectedStudentId}
          onBack={() => setSelectedStudentId(null)}
        />
      </div>
    );
  }

  // عرض قائمة الطلاب في صف محدد
  if (selectedClassroomId) {
    const classroom = classrooms.find((c) => c.id === selectedClassroomId);
    if (!classroom) {
      setSelectedClassroomId(null);
      return null;
    }

    return (
      <div className="space-y-6" dir="rtl">
        {/* رأس الصف مع زر الرجوع */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedClassroomId(null);
              setStudents([]);
            }}
            className="p-2.5 rounded-xl text-white hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#652b82" }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            className="flex-1 rounded-2xl p-6 bg-white shadow-lg border-2"
            style={{ borderColor: "#fad656" }}
          >
            <h3 className="text-2xl mb-3" style={{ color: "#652b82" }}>
              {classroom.name}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">كود الصف:</span>
              <code
                className="px-4 py-2 rounded-xl text-lg shadow-sm"
                style={{ backgroundColor: "#fad656", color: "#652b82" }}
              >
                {classroom.code}
              </code>
              <button
                onClick={() => handleCopyCode(classroom.code)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                {copiedCode === classroom.code ? (
                  <Check className="w-5 h-5" style={{ color: "#10b981" }} />
                ) : (
                  <Copy className="w-5 h-5" style={{ color: "#652b82" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* زر إنشاء بيانات تجريبية */}
        {/* {classroom.students_count > 0 &&
          classroom.students.some((studentId) => {
            const stats = progressTracking.calculateStats(studentId);
            return stats.totalActivities === 0;
          }) && (
            <button
              onClick={() => {
                classroom.students.forEach((studentId) => {
                  const stats = progressTracking.calculateStats(studentId);
                  if (stats.totalActivities === 0) {
                    createDemoProgressForStudent(studentId);
                  }
                });
              }}
              className="w-full text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: "#652b82" }}
            >
              <Star className="w-5 h-5" />
              <span>إنشاء بيانات تجريبية</span>
            </button>
          )} */}

        {/* قائمة الطلاب */}
        {classroom.students_count === 0 ? (
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
            <div className="text-sm text-gray-600 mb-3 px-2">
              عدد الطلاب: {classroom.students_count} طالب
            </div>
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
                <div className="text-sm text-gray-600 mb-3 px-2">
                  عدد الطلاب: {students.length}
                </div>

                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id.toString())}
                    className="w-full bg-white px-5 py-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: "#652b82" }}
                    >
                      {student.username.charAt(0)}
                    </div>

                    <div className="flex-1 text-right">
                      <h4 className="text-lg" style={{ color: "#652b82" }}>
                        {student.username}
                      </h4>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>

                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // عرض قائمة الصفوف الرئيسية
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-white py-2.5 px-5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
          style={{ backgroundColor: "#fad656", color: "#652b82" }}
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء صف جديد</span>
        </button>
      </div>
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
              className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl text-center max-w-sm mx-4 flex flex-col items-center"
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

      {showCreateForm && (
        <div
          className="bg-white rounded-2xl p-6 shadow-lg border-2"
          style={{ borderColor: "#fad656" }}
        >
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="اسم الصف (مثال: الصف الأول - أ)"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#fad656] outline-none mb-4"
            style={{ backgroundColor: "#f5f3f7" }}
          />
          <div className="flex gap-3">
            <button
              onClick={handleCreateClassroom}
              className="flex-1 text-white py-3 rounded-xl hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#652b82" }}
            >
              إنشاء
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewClassName("");
              }}
              className="flex-1 py-3 rounded-xl hover:opacity-90"
              style={{ backgroundColor: "#f5f3f7", color: "#652b82" }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {classrooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#f5f3f7" }}
            >
              <Users className="w-10 h-10" style={{ color: "#652b82" }} />
            </div>
            <p className="text-gray-600">لا توجد صفوف بعد</p>
            <p className="text-sm text-gray-400 mt-2">ابدأ بإنشاء صف جديد</p>
          </div>
        ) : (
          classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all border-2 border-transparent hover:border-[#fad656]"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => handleSelectClassroom(classroom.id)}
                  className="flex items-center gap-4 flex-1 text-right"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: "#652b82" }}
                  >
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-800 mb-1">
                      {classroom.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">كود:</span>
                      <code
                        className="px-3 py-1 rounded-lg text-sm"
                        style={{ backgroundColor: "#fad656", color: "#652b82" }}
                      >
                        {classroom.code}
                      </code>
                    </div>
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setClassToDelete(classroom);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="حذف الصف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => handleSelectClassroom(classroom.id)}
                className="w-full rounded-xl p-4 hover:opacity-90 transition-all"
                style={{ backgroundColor: "#f5f3f7" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" style={{ color: "#652b82" }} />
                    <span className="text-gray-700">عدد الطلاب:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl" style={{ color: "#652b82" }}>
                      {classroom.students_count}
                    </span>
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
