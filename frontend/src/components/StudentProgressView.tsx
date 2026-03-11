import { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  BookOpen,
  CheckCircle,
  BarChart3,
  Calendar,
  Star,
  Volume2,
  Edit3,
  Palette,
  ArrowRight,
} from "lucide-react";
import { Classroom, User } from "../types";
import {
  progressTracking,
  ACTIVITY_NAMES,
  getScoreColor,
  getScoreText,
} from "../utils/progressTracking";
import api from "../API/axios";
import { useNavigate } from "react-router-dom";
import { getClassById } from "../API/classrooms";
import userIcon from "../assets/user_gray.svg";
import { motion } from "framer-motion";
import { SplashScreen } from "./SplashScreen";
interface StudentProgressViewProps {
  classroomId: number;
  studentId?: number;
  onBack?: () => void;
}

export function StudentProgressView({
  classroomId,
  studentId,
}: StudentProgressViewProps) {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    studentId ?? null,
  );
    const [showSplash, setShowSplash] = useState(true);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  console.log(classroomId);
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
  console.log(classroom);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await api.get(`/class/student/${classroomId}`);
      setStudents(res.data.data);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchStudentProgress = async () => {
      setLoading(true);
      const res = await api.get(
        `/progress/students/${selectedStudentId}/progress`,
      );
      setStudentData(res.data.data);

      setLoading(false);
    };

    fetchStudentProgress();
  }, [selectedStudentId]);

  // تنسيق التاريخ
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "اليوم";
    if (days === 1) return "أمس";
    if (days < 7) return `منذ ${days} أيام`;
    return date.toLocaleDateString("ar-EG");
  };

  // أيقونة النشاط
  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "learn":
        return <Volume2 className="w-5 h-5" />;
      case "write":
        return <Edit3 className="w-5 h-5" />;
      case "position":
        return <Target className="w-5 h-5" />;
      case "tashkeel":
        return <Palette className="w-5 h-5" />;
      case "video":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  // لون النشاط
  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case "learn":
        return "#10b981";
      case "write":
        return "#3b82f6";
      case "position":
        return "#f59e0b";
      case "tashkeel":
        return "#ec4899";
      case "video":
        return "#ec4848ff";
      default:
        return "#164194";
    }
  };
  const getActivityPercentage = (
    activityType: string,
    score: number,
  ): number => {
    switch (activityType) {
      case "learn":
      case "write":
      case "video":
        return score * 100;

      case "position":
      case "tashkeel":
        return score * 25;

      case "game":
        return score;

      default:
        return 0;
    }
  };

  // عرض قائمة الطلاب
  if (!selectedStudentId) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-3 rounded-xl shadow-lg"
            style={{ backgroundColor: "#164194" }}
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl" style={{ color: "#164194" }}>
              تقدم الطلاب
            </h2>
            <p className="text-gray-600">اختر طالباً لعرض إنجازاته التفصيلية</p>
          </div>
        </div>

        <div className="grid gap-4">
          {students.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#ECEEEF" }}
              >
                <Award className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">لا يوجد طلاب في هذا الصف بعد</p>
            </div>
          ) : (
            students.map((student) => {
              const stats = progressTracking.calculateStats(student.id);
              // const hasProgress = stats.totalActivities > 0;
              const hasProgress = true;

              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-300 text-right"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shadow-md"
                      style={{ backgroundColor: "#164194" }}
                    >
                      {student.username.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl mb-1" style={{ color: "#164194" }}>
                        {student.username}
                      </h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>

                    {hasProgress ? (
                      <div
                        className="text-center px-6 py-3 rounded-2xl shadow-md"
                        style={{
                          backgroundColor:
                            getScoreColor(stats.averageScore) + "15",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Star
                            className="w-5 h-5"
                            style={{
                              color: getScoreColor(stats.averageScore),
                              fill: getScoreColor(stats.averageScore),
                            }}
                          />
                          <span
                            className="text-2xl"
                            style={{ color: getScoreColor(stats.averageScore) }}
                          >
                            {stats.averageScore}٪
                          </span>
                        </div>
                        <span
                          className="text-sm"
                          style={{ color: getScoreColor(stats.averageScore) }}
                        >
                          {getScoreText(stats.averageScore)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center px-6 py-3 rounded-2xl bg-gray-100">
                        <Award className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                        <span className="text-sm text-gray-500">لم يبدأ</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  const student = studentData?.student ?? {};

  const stats = studentData?.stats;
  const recentActivities = studentData?.recentActivities || [];

  if (loading) {
 return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!studentData) {
    return <div>لا توجد بيانات لهذا الطالب</div>;
  }
  return (
    <div className="space-y-4" dir="rtl">
      {/* رأس الصفحة */}
      <div
        className="w-full flex items-center gap-3 p-3"
        style={{
          background: "#652B820F",
        }}
      >
        <div style={{ marginRight: "30px" }}>
          <img src={userIcon} />
        </div>
        <div>
          <h2
            className="text-base md:text-xl lg:text-2xl mb-1"
            style={{
              // fontSize: "20px",
              color: "#7B7B7B",
              fontFamily: "tajawal",
              fontWeight: "400",
            }}
          >
            {student.username}
          </h2>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div
          className="flex justify-center items-center gap-4"
          style={{ width: "90%" }}
        >
          {/* إحصائيات عامة */}
          <div className="flex flex-col w-72 gap-4">
            {/* المعدل العام */}
            <div className="rounded-2xl p-3 border-2">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div
                  className="text-base md:text-xl lg:text-2xl"
                  style={{
                    // fontSize: "30px",
                    color: "#7B7B7B",
                    fontFamily: "tajawal",
                    fontWeight: "500",
                  }}
                >
                  {isNaN(stats.averageScore) ? 0 : stats.averageScore}%
                </div>
              </div>
              <p
                className="text-base md:text-sm lg:text-xl"
                style={{
                  // fontSize: "25px",
                  color: "#7B7B7B",
                  fontFamily: "tajawal",
                  fontWeight: "400",
                }}
              >
                المعدل العام
              </p>
            </div>

            {/* عدد الأنشطة */}
            <div className="rounded-2xl p-3 border-2">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div
                  className="text-base md:text-xl lg:text-2xl"
                  style={{
                    // fontSize: "30px",
                    color: "#7B7B7B",
                    fontFamily: "tajawal",
                    fontWeight: "500",
                  }}
                >
                  {stats.totalActivities || 0}
                </div>
              </div>
              <p
                className="text-base md:text-xl lg:text-2xl text-gray-600"
                style={{
                  // fontSize: "25px",
                  color: "#7B7B7B",
                  fontFamily: "tajawal",
                  fontWeight: "400",
                }}
              >
                الأنشطة
              </p>
            </div>

            {/* الوقت الإجمالي */}
            <div className="p-3 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div
                  className="text-base md:text-xl lg:text-2xl"
                  style={{
                    // fontSize: "30px",
                    color: "#7B7B7B",
                    fontFamily: "tajawal",
                    fontWeight: "500",
                  }}
                >
                  {Math.floor((stats.totalTimeSpent || 0) / 60)}
                </div>
              </div>
              <p
                className="text-base md:text-xl lg:text-2xl"
                style={{
                  // fontSize: "25px",
                  color: "#7B7B7B",
                  fontFamily: "tajawal",
                  fontWeight: "400",
                }}
              >
                دقيقة
              </p>
            </div>

            {/* الحروف المكتملة */}
            <div className="p-3 rounded-2xl border-2">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div
                  className="text-base md:text-xl lg:text-2xl"
                  style={{
                    // fontSize: "30px",
                    color: "#7B7B7B",
                    fontFamily: "tajawal",
                    fontWeight: "500",
                  }}
                >
                  {stats.completedLetters?.length || 0}
                </div>
              </div>
              <p
                className="text-base md:text-xl lg:text-2xl"
                style={{
                  // fontSize: "25px",
                  color: "#7B7B7B",
                  fontFamily: "tajawal",
                  fontWeight: "400",
                }}
              >
                حرف
              </p>
            </div>
          </div>

          {/* الأداء حسب النشاط */}
          <div className="p-4 rounded-2xl w-full flex justify-center items-center">
            {stats.activityScores &&
            Object.keys(stats.activityScores).length > 0 ? (
              <div className="flex flex-col gap-3" style={{ width: "85%" }}>
                {Object.entries(stats.activityScores).map(
                  ([activityType, score]) => {
                    const percentage = getActivityPercentage(
                      activityType,
                      score,
                    );

                    return (
                      <div key={activityType} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="text-base md:text-xl lg:text-2xl"
                            style={{
                              color: getActivityColor(activityType),
                              // fontSize: "20px",
                              fontFamily: "tajawal",
                              fontWeight: "500",
                            }}
                          >
                            {percentage}%
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-base md:text-sm lg:text-2xl"
                              style={{
                                color: "#626262",
                                // fontSize: "20px",
                                fontFamily: "tajawal",
                                fontWeight: "500",
                              }}
                            >
                              {activityType}
                            </span>
                          </div>
                        </div>

                        {/* شريط التقدم */}
                        <div
                          className="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
                          dir="ltr"
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: getActivityColor(activityType),
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div
                className="text-center py-8 rounded-xl w-full"
                style={{ backgroundColor: "#ECEEEF" }}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-white">
                  <Target className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">لا توجد أنشطة بعد</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* النشاطات الأخيرة */}
      <div className="flex justify-center items-center">
        <div
          className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200"
          style={{ width: "90%", marginBottom: "50px" }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3
              className="text-base md:text-xl lg:text-2xl flex justify-center"
              style={{
                color: "#000000",
                // fontSize: "25px",
                fontFamily: "tajawal",
                fontWeight: "500",
              }}
            >
              النشاطات الأخيرة
            </h3>
          </div>

          {recentActivities.length === 0 ? (
            <div
              className="text-center py-8 rounded-xl"
              style={{ backgroundColor: "#ECEEEF" }}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-white">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">لا توجد نشاطات بعد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivities.map((activity: any, index: number) => {
                const percentage = getActivityPercentage(
                  activity.lessonName,
                  activity.score,
                );
                return (
                  <div key={index} className="p-3 rounded-xl border-2">
                    <div
                      className="flex items-center gap-3"
                      style={{ justifyContent: "space-between" }}
                    >
                      {/* معلومات النشاط */}
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-800">
                            {
                              ACTIVITY_NAMES[
                                activity.lessonName as keyof typeof ACTIVITY_NAMES
                              ]
                            }
                          </span>

                          <span
                            className="text-base md:text-xl lg:text-2xl"
                            style={{
                              color: "#272626",
                              // fontSize: "20px",
                              fontFamily: "tajawal",
                              fontWeight: "500",
                            }}
                          >
                            {activity.activityType} {activity.letter}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span
                            className="flex items-center gap-1 text-base md:text-xl lg:text-2xl"
                            style={{
                              color: "#7B7B7B",
                              // fontSize: "20px",
                              fontFamily: "tajawal",
                              fontWeight: "400",
                            }}
                          >
                            {formatDate(activity.completedAt)}
                          </span>
                          <span
                            className="flex items-center gap-1 text-base md:text-xl lg:text-2xl"
                            style={{
                              color: "#7B7B7B",
                              // fontSize: "20px",
                              fontFamily: "tajawal",
                              fontWeight: "400",
                            }}
                          >
                            <Clock className="w-3 h-3" />
                            {Math.ceil(activity.timeSpent / 60)} دقيقة
                          </span>
                        </div>
                      </div>

                      {/* الدرجة */}
                      <div className="px-3 py-2 rounded-lg text-center w-96 flex justify-center items-center gap-4 w-full">
                        {/* شريط التقدم */}
                        <div
                          className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
                          dir="ltr"
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: getScoreColor(percentage),
                            }}
                          />
                        </div>
                        <div
                          className="text-base md:text-xl lg:text-2xl"
                          style={{
                            color: getScoreColor(percentage),
                            // fontSize: "30px",
                            fontFamily: "tajawal",
                            fontWeight: "500",
                          }}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* الحروف المكتملة */}
      {stats.completedLetters.length > 0 && (
        <div className="flex justify-center items-center">
          <div
            className="bg-white p-4 rounded-2xl shadow-lg border-2"
            style={{ width: "90%", marginBottom: "50px" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3
                className="text-base md:text-xl lg:text-2xl"
                style={{
                  color: "#272626",
                  // fontSize: "25px",
                  fontFamily: "tajawal",
                  fontWeight: "500",
                }}
              >
                الحروف المدروسة {stats.completedLetters.length} حرف
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {stats.completedLetters.map((letter: any) => (
                <div
                  key={letter}
                  className="w-12 h-12 rounded-xl shadow-md flex items-center justify-center text-xl text-white"
                  style={{
                    backgroundColor: "#ACDAA9",
                    color: "#272626",
                    fontFamily: "tajawal",
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
