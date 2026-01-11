import { useState } from "react";
import {
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  Users,
  Sparkles,
  Home,
} from "lucide-react";
import { motion } from "motion/react";
import { storage } from "../utils/storage";
// import { ACTIVATION_CODES } from "../utils/seedData";
import { User } from "../types";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { useAppDispatch } from "../redux/hooks";
import { loginSuccess } from "../redux/reducers/auth";

interface LoginPageProps {
  onLogin: (user: User) => void;
  userType: "teacher" | "student";
  onBack: () => void;
}
const mapRoleNumberToType = (role: number): "teacher" | "student" => {
  if (role === 2) return "teacher";
  if (role === 3) return "student";
  throw new Error("نوع مستخدم غير معروف");
};

const loginApi = async (email: string, password: string) => {
  const res = await fetch("http://localhost:5000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error(data.message || "فشل تسجيل الدخول");
  }

  return data;
};
const registerApi = async (
  username: string,
  email: string,
  password: string,
  role_id: number
) => {
  const res = await fetch("http://localhost:5000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      role_id, // ⬅️ 2 أو 3
    }),
  });

  const data = await res.json();
  console.log(data.response[0]);

  if (!res.ok) {
    throw new Error(data.message || "فشل إنشاء الحساب");
  }

  return data;
};

export function LoginPage({ onLogin, userType, onBack }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  // const [activationCode, setActivationCode] = useState("");
  const dispatch = useAppDispatch();
  // console.log(userType);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginApi(formData.email, formData.password);

      const mappedRole = mapRoleNumberToType(data.role);

      // حماية: المستخدم دخل على نوع غلط
      if (mappedRole !== userType) {
        setError(
          `هذا الحساب مسجل كـ ${mappedRole === "teacher" ? "معلم" : "طالب"}`
        );
        return;
      }
      const mappedType = mapRoleNumberToType(data.role);

      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        roleId: data.role, // ⬅️ الرقم من الباك إند
        type: mappedType, // ⬅️ teacher / student
      };

      dispatch(
        loginSuccess({
          user,
          token: data.token,
        })
      );

      // إذا لسه محتاجة onLogin (تنقّل مثلاً)
      onLogin(user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("صار خطأ");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const roleNumber = userType === "teacher" ? 2 : 3;

      const data = await registerApi(
        formData.username,
        formData.email,
        formData.password,
        roleNumber
      );

      const userData = data.response[0]; // ⭐⭐⭐

      const mappedType = mapRoleNumberToType(userData.role_id);

      const user = {
        id: String(userData.id),
        username: userData.username,
        email: userData.email,
        roleId: userData.role_id,
        type: mappedType,
      };

      setMode("login");
      // (اختياري) تفريغ كلمة المرور
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "فشل إنشاء الحساب");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-50"></div>

      {/* عناصر زخرفية */}
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* بطاقة تسجيل الدخول/التسجيل */}
          <div
            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 md:border-4"
            style={{ borderColor: "#652b82" }}
          >
            {/* الهيدر */}
            <div
              className="p-5 md:p-6 text-center text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #652b82, #7d3ba0)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 md:w-28 md:h-28 rounded-full opacity-20"
                style={{
                  backgroundColor: "white",
                  transform: "translate(30%, -30%)",
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-20"
                style={{
                  backgroundColor: "white",
                  transform: "translate(-30%, 30%)",
                }}
              ></div>

              <motion.div
                className="relative"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="mb-3">
                  {userType === "student" ? (
                    <BookOpen className="w-12 h-12 md:w-14 md:h-14 mx-auto text-white" />
                  ) : (
                    <Users className="w-12 h-12 md:w-14 md:h-14 mx-auto text-white" />
                  )}
                </div>
                <h2 className="text-xl md:text-2xl mb-1.5">
                  {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                </h2>
                <p className="text-sm md:text-base opacity-90">
                  {userType === "student" ? "حساب الطالب" : "حساب المعلم"}
                </p>
              </motion.div>
            </div>

            {/* النموذج */}
            <div className="p-5 md:p-6">
              <form
                onSubmit={mode === "login" ? handleLogin : handleRegister}
                className="space-y-4"
              >
                {mode === "register" && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-gray-700 mb-1.5 text-sm md:text-base">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <UserIcon
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5"
                        style={{ color: "#652b82" }}
                      />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full pr-10 pl-3 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-sm md:text-base transition-all"
                        placeholder="أدخل اسمك الكامل"
                        dir="rtl"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: mode === "register" ? 0.2 : 0.1 }}
                >
                  <label className="block text-gray-700 mb-1.5 text-sm md:text-base">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5"
                      style={{ color: "#652b82" }}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pr-10 pl-3 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-sm md:text-base transition-all"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: mode === "register" ? 0.3 : 0.2 }}
                >
                  <label className="block text-gray-700 mb-1.5 text-sm md:text-base">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5"
                      style={{ color: "#652b82" }}
                    />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pr-10 pl-3 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-sm md:text-base transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                {/* {mode === "register" && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-gray-700 mb-1.5 text-sm md:text-base">
                      كود التفعيل
                    </label>
                    <div className="relative">
                      <Sparkles
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5"
                        style={{ color: "#fad656" }}
                      />
                      <input
                        type="text"
                        value={activationCode}
                        onChange={(e) => setActivationCode(e.target.value)}
                        className="w-full pr-10 pl-3 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-sm md:text-base transition-all"
                        placeholder="أدخل كود التفعيل"
                      />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-1.5">
                      كود التفعيل:{" "}
                      {userType === "teacher"
                        ? ACTIVATION_CODES.teacher
                        : ACTIVATION_CODES.student}
                    </p>
                  </motion.div>
                )} */}

                {error && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-50 border-2 border-red-300 text-red-700 px-3 py-2.5 rounded-xl text-center text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className="w-full py-3 md:py-3.5 rounded-xl text-white text-base md:text-lg shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: "linear-gradient(135deg, #652b82, #7d3ba0)",
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {mode === "login" ? "دخول" : "إنشاء حساب"}
                </motion.button>

                {/* حسابات تجريبية */}
                {mode === "login" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="border-t-2 border-gray-200 pt-4 space-y-2"
                  >
                    {userType === "student" && (
                      <button
                        type="button"
                        onClick={() => {
                          const demoUser: User = {
                            id: "demo-student-1",
                            username: "أحمد التجريبي",
                            email: "student@demo.com",
                            password: "123456",
                            type: "student",
                            // activationCode: "STUDENT2024",
                          };
                          storage.setCurrentUser(demoUser);
                          onLogin(demoUser);
                        }}
                        className="w-full py-2.5 rounded-xl border-2 text-sm md:text-base hover:shadow-md transition-all flex items-center justify-center gap-2"
                        style={{ borderColor: "#652b82", color: "#652b82" }}
                      >
                        <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                        <span>دخول كطالب تجريبي</span>
                      </button>
                    )}

                    {userType === "teacher" && (
                      <button
                        type="button"
                        onClick={() => {
                          const demoUser: User = {
                            id: "demo-teacher-1",
                            username: "المعلمة فاطمة",
                            email: "teacher@demo.com",
                            password: "123456",
                            type: "teacher",
                            // activationCode: "TEACHER2024",
                          };
                          storage.setCurrentUser(demoUser);
                          onLogin(demoUser);
                        }}
                        className="w-full py-2.5 rounded-xl border-2 text-sm md:text-base hover:shadow-md transition-all flex items-center justify-center gap-2"
                        style={{ borderColor: "#652b82", color: "#652b82" }}
                      >
                        <Users className="w-4 h-4 md:w-5 md:h-5" />
                        <span>دخول كمعلم تجريبي</span>
                      </button>
                    )}
                  </motion.div>
                )}
               

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === "login" ? "register" : "login")
                    }
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm md:text-base"
                  >
                    {mode === "login"
                      ? "ليس لديك حساب؟ سجّل الآن"
                      : "لديك حساب بالفعل؟ سجّل دخولك"}
                  </button>

                  <div>
                    <button
                      type="button"
                      onClick={onBack}
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm md:text-base flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Home className="w-4 h-4" />
                      <span>الصفحة الرئيسية</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* النمر في الزاوية اليسرى السفلى */}
      <motion.div
        className="fixed bottom-2 left-2 md:bottom-4 md:left-4 z-20"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.5,
        }}
      >
        <motion.img
          src={tigerImg}
          alt="نمر"
          className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
