import { useState, useEffect } from "react";
import {
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  Users,
  Sparkles,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import tigerImg from "../assets/tiger_login.svg";
import backGroundImg from "../assets/background_img_login_page.jpg";
import alphabet from "../assets/alphabet login.svg";
import userIcon from "../assets/Users.svg";
import waves from "../assets/waves_login.svg";
import homeIcon from "../assets/Home.svg";
import { useAppDispatch } from "../redux/hooks";
import { loginSuccess } from "../redux/reducers/auth";

interface LoginPageProps {
  userType: "teacher" | "student";
  onBack: () => void;
}
const mapRoleNumberToType = (role: number): "teacher" | "student" => {
  if (role === 3) return "teacher";
  if (role === 2) return "student";
  throw new Error("نوع مستخدم غير معروف");
};

const loginApi = async (email: string, password: string) => {
  const res = await fetch(
    "https://arabic-learning-web-app.onrender.com/users/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error(data.message || "فشل تسجيل الدخول");
  }

  return data;
};
// const registerApi = async (
//   username: string,
//   email: string,
//   password: string,
//   role_id: number
// ) => {
//   const res = await fetch("https://arabic-learning-web-app.onrender.com/users/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       username,
//       email,
//       password,
//       role_id, // ⬅️ 2 أو 3
//     }),
//   });

//   const data = await res.json();
//   console.log(data.response[0]);

//   if (!res.ok) {
//     throw new Error(data.message || "فشل إنشاء الحساب");
//   }

//   return data;
// };

const registerApi = async (
  username: string,
  email: string,
  password: string,
  activationCode: string,
  userType: "student" | "teacher",
) => {
  const res = await fetch(
    "https://arabic-learning-web-app.onrender.com/users/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        activation_code: activationCode,
        requested_role: userType,
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.log(res);

    throw new Error(data.message);
  }

  return data;
};

export function LoginPage({ userType, onBack }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [activationCode, setActivationCode] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    setShowPassword(false);
  }, [mode]);
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginApi(formData.email, formData.password);

      const mappedRole = mapRoleNumberToType(data.role);

      // حماية: المستخدم دخل على نوع غلط
      console.log(mappedRole);
      if (mappedRole !== userType) {
        setError(
          `هذا الحساب مسجل كـ ${mappedRole === "teacher" ? "معلم" : "طالب"}`,
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
        }),
      );

      // إذا لسه محتاجة onLogin (تنقّل مثلاً)
      // onLogin(user);
      navigate(user.type === "teacher" ? "/teacher/home" : "/student/home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("صار خطأ");
      }
    }
  };

  // const handleRegister = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!formData.username || !formData.email || !formData.password) {
  //     setError("يرجى ملء جميع الحقول");
  //     return;
  //   }

  //   try {
  //     const roleNumber = userType === "teacher" ? 2 : 3;

  //     const data = await registerApi(
  //       formData.username,
  //       formData.email,
  //       formData.password,
  //       roleNumber
  //     );

  //     const userData = data.response[0]; // ⭐⭐⭐

  //     const mappedType = mapRoleNumberToType(userData.role_id);

  //     const user = {
  //       id: String(userData.id),
  //       username: userData.username,
  //       email: userData.email,
  //       roleId: userData.role_id,
  //       type: mappedType,
  //     };

  //     navigate(`/login/${userType}`);
  //     // (اختياري) تفريغ كلمة المرور
  //     setFormData((prev) => ({ ...prev, password: "" }));
  //   } catch (err) {
  //     console.error(err);
  //     setError(err instanceof Error ? err.message : "فشل إنشاء الحساب");
  //   }
  // };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !activationCode
    ) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    try {
      await registerApi(
        formData.username,
        formData.email,
        formData.password,
        activationCode,
        userType,
      );

      // بعد نجاح التسجيل → رجّعيه على تسجيل الدخول

      setFormData((prev) => ({ ...prev, password: "" }));
      setMode("login");
      setActivationCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إنشاء الحساب");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* خلفية متدرجة */}
     {userType === "student" ? (
  <div
    className="fixed inset-0 -z-10 overflow-hidden"
    style={{
      backgroundImage: `
        linear-gradient(#652b82c7, #ececed80),
        url(${backGroundImg})
      `,
      backgroundSize: "1540px auto",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      opacity: "0.8",
    }}
  /> 
) : (<div
    className="fixed inset-0 -z-10 overflow-hidden"
    style={{
       background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)",
    }}
  /> )}

      {/* خلفية الهيدر */}
      <div className="absolute w-full overflow-hidden">
        <div className="relative bg-white-200 h-56 flex items-center justify-center">
          <div
            className="absolute z-9999"
            style={{
              top: "10px",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              marginRight: "45%",
              width: "50%",
              zIndex: "999",
              // top: "10px",
            }}
          >
            <h1
              // className="absolute"
              style={{
                fontFamily: "tajawal",
                fontSize: "40px",
                fontWeight: "700",
                color: "#652B82",
                zIndex: "999",
                // top: "10px",
              }}
            >
              مراتي لغتي
            </h1>
            <div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2,boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255,255,255,1)
    ` }}
                whileTap={{
                  scale: 0.97,
                  boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255,255,255,1)
    `,
                }}
                type="button"
                onClick={() => navigate("/")}
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f2f2f2",
                  borderRadius: "8px",

                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: `
        inset 6px 6px 12px rgba(0, 0, 0, 0.07),
        inset -6px -6px 12px rgba(255,255,255,0.9)`,
                }}
              >
                <img src={homeIcon} style={{ width: "30px", height: "30px" }} />
              </motion.button>
            </div>
          </div>
        </div>

        <img
          src={waves}
          alt="wave"
          className="absolute bottom-16 left-0 w-full"
        />
      </div>

      <div
        className="relative z-10 min-h-screen flex justify-center p-4 md:p-6"
        style={{ alignItems: "flex-end" }}
      >
        <motion.div
          // className="w-96"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ height: "70vh" }}
        >
          {/* بطاقة تسجيل الدخول/التسجيل */}
          <div
            className="w-96 h-full rounded-3xl shadow-2xl overflow-hidden flex flex-row md:flex-col relative"
            style={{ backgroundColor: "#FDC333", width: "100%" }}
          >
            {/*النمر الموجود بالنص */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -ml-6 top-1/2 -translate-y-1/2 z-20 flex justify-center items-center shadow-2xl"
              style={{
                left: "42%",
                backgroundColor: "white",
                height: "150px",
                width: "150px",
                borderRadius: "50%",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={tigerImg}
                alt="نمر"
                className="w-20 md:w-20 lg:w-20 object-contain drop-shadow-2xl"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col justify-center">
              <div>
                <div
                  className="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-20"
                  style={{
                    backgroundColor: "white",
                    transform: "translate(-30%, 30%)",
                  }}
                ></div>

                <motion.div
                  className="relative flex flex-col items-center"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="mb-3">
                    <img
                      src={userIcon}
                      className="w-12 h-12 md:w-14 md:h-14 mx-auto text-white"
                    />
                  </div>
                  <p className="text-sm md:text-base opacity-90">
                    {userType === "student" ? "حساب الطالب" : "حساب المعلم"}
                  </p>
                </motion.div>
              </div>
              {/* النموذج */}
              <div className="p-5 md:p-6 bg-white rounded-3xl">
                <form onSubmit={handleLogin} className="space-y-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* <label className="block text-gray-700 mb-1.5 text-sm md:text-base">
                      البريد الإلكتروني
                    </label> */}
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
                        className="w-full pr-10 py-3 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 outline-none transition"
                        placeholder=" البريد الإلكتروني"
                        style={{ borderBottom: "2px solid #652b8251" }}
                        // dir="ltr"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* <label className="block text-gray-700 mb-1.5 text-sm md:text-base">
                      كلمة المرور
                    </label> */}

                    <div className="relative">
                      <Lock
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5"
                        style={{ color: "#652b82" }}
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full pr-10 pl-10 py-3 bg-transparent border-b-2 border-gray-300 focus:border-purple-600 outline-none transition"
                        style={{ borderBottom: "2px solid #652b8243" }}
                        placeholder=" كلمة المرور"
                      />

                      {/* زر إظهار / إخفاء */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 text-gray-500 hover:text-purple-600 transition"
                        style={{ left: "10%" }}
                        aria-label={
                          showPassword
                            ? "إخفاء كلمة المرور"
                            : "إظهار كلمة المرور"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>

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
                    className="w-full py-3 md:py-2\.5 text-white text-base md:text-lg shadow-lg hover:shadow-xl transition-all"
                    style={{
                      background: "linear-gradient(135deg, #652b82, #7d3ba0)",
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {"دخول"}
                  </motion.button>
                  <div className="text-center space-y-2">
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/");
                        }}
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
            <div
              className="flex flex-col items-center justify-center"
              style={{
                marginTop: "80px",
              }}
            >
              <h1
                style={{
                  fontFamily: "tajawal",
                  fontSize: "22px",
                  fontWeight: "500",
                  color: "#652B82",
                }}
              >
                رحلة تعلم اللغة العربية تبدأ هنا
              </h1>
              <img src={alphabet} style={{ width: "82%" }} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
