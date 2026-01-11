import { useState, useEffect } from 'react';
import { Plus, Users, Copy, Check, X, Star, Award, UserX, ChevronRight, ChevronLeft, BookOpen, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { copyToClipboard } from '../utils/clipboard';
import { Classroom, User } from '../types';
import { StudentProgressView } from './StudentProgressView';
import { progressTracking, getScoreColor, getScoreText } from '../utils/progressTracking';
import { createDemoProgressForStudent } from '../utils/seedData';

interface ClassroomManagementProps {
  teacher: User;
  onClose: () => void;
}

export function ClassroomManagement({ teacher, onClose }: ClassroomManagementProps) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = () => {
    const teacherClassrooms = storage.getClassroomsByTeacher(teacher.id);
    setClassrooms(teacherClassrooms);
    console.log('🔄 تم تحميل الصفوف:', teacherClassrooms.length);
  };

  const handleCreateClassroom = () => {
    if (!newClassName.trim()) return;

    const newClassroom: Classroom = {
      id: Date.now().toString(),
      name: newClassName,
      teacherId: teacher.id,
      code: storage.generateClassCode(),
      students: [],
    };

    storage.saveClassroom(newClassroom);
    loadClassrooms();
    setNewClassName('');
    setShowCreateForm(false);
  };

  const handleCopyCode = (code: string) => {
    copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStudentInfo = (studentId: string) => {
    return storage.getUserById(studentId);
  };

  const handleDeleteClassroom = (classroomId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الصف؟')) {
      const allClassrooms = storage.getClassrooms();
      const updatedClassrooms = allClassrooms.filter(c => c.id !== classroomId);
      localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
      loadClassrooms();
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
          style={{ backgroundColor: '#652b82' }}
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
    const classroom = classrooms.find(c => c.id === selectedClassroomId);
    if (!classroom) {
      setSelectedClassroomId(null);
      return null;
    }

    return (
      <div className="space-y-6" dir="rtl">
        {/* رأس الصف مع زر الرجوع */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedClassroomId(null)}
            className="p-2.5 rounded-xl text-white hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: '#652b82' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="flex-1 rounded-2xl p-6 bg-white shadow-lg border-2" style={{ borderColor: '#fad656' }}>
            <h3 className="text-2xl mb-3" style={{ color: '#652b82' }}>{classroom.name}</h3>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">كود الصف:</span>
              <code className="px-4 py-2 rounded-xl text-lg shadow-sm" style={{ backgroundColor: '#fad656', color: '#652b82' }}>
                {classroom.code}
              </code>
              <button
                onClick={() => handleCopyCode(classroom.code)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                {copiedCode === classroom.code ? (
                  <Check className="w-5 h-5" style={{ color: '#10b981' }} />
                ) : (
                  <Copy className="w-5 h-5" style={{ color: '#652b82' }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* زر إنشاء بيانات تجريبية */}
        {classroom.students.length > 0 && classroom.students.some(studentId => {
          const stats = progressTracking.calculateStats(studentId);
          return stats.totalActivities === 0;
        }) && (
          <button
            onClick={() => {
              classroom.students.forEach(studentId => {
                const stats = progressTracking.calculateStats(studentId);
                if (stats.totalActivities === 0) {
                  createDemoProgressForStudent(studentId);
                }
              });
              alert('✅ تم إنشاء البيانات التجريبية بنجاح!');
              loadClassrooms();
            }}
            className="w-full text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#652b82' }}
          >
            <Star className="w-5 h-5" />
            <span>إنشاء بيانات تجريبية</span>
          </button>
        )}

        {/* قائمة الطلاب */}
        {classroom.students.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f5f3f7' }}>
              <Users className="w-10 h-10" style={{ color: '#652b82' }} />
            </div>
            <p className="text-gray-600 mb-2">لا يوجد طلاب في هذا الصف</p>
            <p className="text-sm text-gray-400">شارك الكود مع الطلاب للانضمام</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3 px-2">
              عدد الطلاب: {classroom.students.length} طالب
            </div>
            {classroom.students.map((studentId) => {
              const student = getStudentInfo(studentId);
              if (!student) return null;

              const stats = progressTracking.calculateStats(studentId);
              const hasProgress = stats.totalActivities > 0;

              return (
                <button
                  key={studentId}
                  onClick={() => setSelectedStudentId(studentId)}
                  className="w-full bg-white px-5 py-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition-all border-2 border-transparent hover:border-[#fad656] shadow-sm"
                >
                  {/* أيقونة الطالب */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md text-xl"
                    style={{ backgroundColor: '#652b82' }}
                  >
                    <span>{student.name.charAt(0)}</span>
                  </div>

                  {/* معلومات الطالب */}
                  <div className="flex-1 text-right">
                    <h4 className="text-lg mb-1" style={{ color: '#652b82' }}>{student.name}</h4>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>

                  {/* التقييم */}
                  {hasProgress ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm" style={{ backgroundColor: getScoreColor(stats.averageScore) + '20' }}>
                        <Star className="w-5 h-5" style={{ color: getScoreColor(stats.averageScore), fill: getScoreColor(stats.averageScore) }} />
                        <div className="text-right">
                          <div className="font-semibold text-lg" style={{ color: getScoreColor(stats.averageScore) }}>
                            {stats.averageScore}%
                          </div>
                          <div className="text-xs text-gray-500">المعدل</div>
                        </div>
                      </div>
                      <div className="text-center px-4 py-2.5 rounded-xl shadow-sm" style={{ backgroundColor: '#fad656' }}>
                        <div className="font-semibold text-lg" style={{ color: '#652b82' }}>{stats.totalActivities}</div>
                        <div className="text-xs text-gray-600">نشاط</div>
                      </div>
                      {stats.completedLetters?.length > 0 && (
                        <div className="text-center px-4 py-2.5 rounded-xl shadow-sm" style={{ backgroundColor: '#10b98120' }}>
                          <div className="font-semibold text-lg" style={{ color: '#10b981' }}>{stats.completedLetters.length}</div>
                          <div className="text-xs" style={{ color: '#10b981' }}>حرف</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-5 py-3 rounded-xl" style={{ backgroundColor: '#f5f3f7' }}>
                      <span className="text-sm text-gray-500">لم يبدأ بعد</span>
                    </div>
                  )}

                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
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
          style={{ backgroundColor: '#fad656', color: '#652b82' }}
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء صف جديد</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2" style={{ borderColor: '#fad656' }}>
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="اسم الصف (مثال: الصف الأول - أ)"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#fad656] outline-none mb-4"
            style={{ backgroundColor: '#f5f3f7' }}
          />
          <div className="flex gap-3">
            <button
              onClick={handleCreateClassroom}
              className="flex-1 text-white py-3 rounded-xl hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#652b82' }}
            >
              إنشاء
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewClassName('');
              }}
              className="flex-1 py-3 rounded-xl hover:opacity-90"
              style={{ backgroundColor: '#f5f3f7', color: '#652b82' }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {classrooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f5f3f7' }}>
              <Users className="w-10 h-10" style={{ color: '#652b82' }} />
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
                  onClick={() => setSelectedClassroomId(classroom.id)}
                  className="flex items-center gap-4 flex-1 text-right"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: '#652b82' }}>
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-800 mb-1">{classroom.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">كود:</span>
                      <code className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: '#fad656', color: '#652b82' }}>
                        {classroom.code}
                      </code>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClassroom(classroom.id);
                  }}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="حذف الصف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setSelectedClassroomId(classroom.id)}
                className="w-full rounded-xl p-4 hover:opacity-90 transition-all"
                style={{ backgroundColor: '#f5f3f7' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" style={{ color: '#652b82' }} />
                    <span className="text-gray-700">عدد الطلاب:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl" style={{ color: '#652b82' }}>
                      {classroom.students.length}
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