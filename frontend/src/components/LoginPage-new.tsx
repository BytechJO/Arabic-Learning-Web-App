// import { useState } from 'react';
// import { GraduationCap, Users, LogIn, UserPlus, Key } from 'lucide-react';
// import { storage } from '../utils/storage';
// import { validateActivationCode } from '../utils/activationCodes';
// import { User } from '../types';
// import logoImg from 'figma:asset/88c947873fadcbe40b0efc61aa8546f4ea7f8a9f.png';

// interface LoginPageProps {
//   onLogin: (user: User) => void;
// }

// export function LoginPage({ onLogin }: LoginPageProps) {
//   const [mode, setMode] = useState<'choose' | 'login' | 'register'>('choose');
//   const [userType, setUserType] = useState<'teacher' | 'student'>('student');
//   const [activationCode, setActivationCode] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');

//   const handleChooseType = (type: 'teacher' | 'student') => {
//     setUserType(type);
//     setMode('login');
//     setError('');
//   };

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     const user = storage.getUserByEmail(formData.email);
//     if (!user) {
//       setError('البريد الإلكتروني غير موجود');
//       return;
//     }

//     if (user.password !== formData.password) {
//       setError('كلمة المرور غير صحيحة');
//       return;
//     }

//     if (user.type !== userType) {
//       setError(`هذا الحساب مسجل كـ ${user.type === 'teacher' ? 'معلم' : 'طالب'}`);
//       return;
//     }

//     storage.setCurrentUser(user);
//     onLogin(user);
//   };

//   const handleRegister = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.name || !formData.email || !formData.password) {
//       setError('يرجى ملء جميع الحقول');
//       return;
//     }

//     if (!activationCode.trim()) {
//       setError('يرجى إدخال كود التفعيل');
//       return;
//     }

//     if (!validateActivationCode(activationCode, userType)) {
//       setError('كود التفعيل غير صحيح');
//       return;
//     }

//     if (storage.getUserByEmail(formData.email)) {
//       setError('البريد الإلكتروني مستخدم بالفعل');
//       return;
//     }

//     const newUser: User = {
//       id: Date.now().toString(),
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       type: userType,
//     };

//     storage.saveUser(newUser);
//     storage.setCurrentUser(newUser);
//     onLogin(newUser);
//   };

//   const handleActivationSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!validateActivationCode(activationCode, userType)) {
//       setError('كود التفعيل غير صحيح');
//       return;
//     }

//     setMode('register');
//   };

//   const resetToChoose = () => {
//     setMode('choose');
//     setError('');
//     setActivationCode('');
//     setFormData({ name: '', email: '', password: '' });
//   };

//   if (mode === 'choose') {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#ECEEEF' }} dir="rtl">
//         <div className="w-full max-w-4xl">
//           {/* Logo */}
//           <div className="text-center mb-10">
//             <div className="inline-block bg-white rounded-2xl p-6 shadow-lg mb-6">
//               <img 
//                 src={logoImg} 
//                 alt="مدرستي لغتي" 
//                 className="h-20 w-auto mx-auto object-contain"
//               />
//             </div>
            
//             <h2 className="text-3xl mb-2" style={{ color: '#164194' }}>
//               مرحباً بك <span className="inline-block animate-bounce">👋</span>
//             </h2>
//             <p className="text-gray-600 text-lg">
//               اختر نوع حسابك للبدء
//             </p>
//           </div>

//           {/* Choice Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Student Card */}
//             <button
//               onClick={() => {
//                 setUserType('student');
//                 setMode('login');
//               }}
//               className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
//             >
//               <div className="rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-110 transition-transform" style={{ backgroundColor: '#164194' }}>
//                 <span className="text-5xl">👦</span>
//               </div>
              
//               <h3 className="text-2xl mb-2" style={{ color: '#164194' }}>أنا طالب</h3>
//               <p className="text-gray-600 mb-6">هيا نتعلم معاً 📚</p>
              
//               <div className="text-white py-3 px-6 rounded-xl inline-block shadow-md" style={{ backgroundColor: '#164194' }}>
//                 ابدأ التعلم →
//               </div>
//             </button>

//             {/* Teacher Card */}
//             <button
//               onClick={() => {
//                 setUserType('teacher');
//                 setMode('login');
//               }}
//               className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
//             >
//               <div className="rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-110 transition-transform" style={{ backgroundColor: '#164194' }}>
//                 <span className="text-5xl">👨‍🏫</span>
//               </div>
              
//               <h3 className="text-2xl mb-2" style={{ color: '#164194' }}>أنا معلم</h3>
//               <p className="text-gray-600 mb-6">لننشئ صفوفاً رائعة 📖</p>
              
//               <div className="text-white py-3 px-6 rounded-xl inline-block shadow-md" style={{ backgroundColor: '#164194' }}>
//                 ابدأ التدريس →
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Activation Code Screen
//   if (mode === 'activation') {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#ECEEEF' }}>
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <div className="text-center mb-6">
//               <div className="inline-block rounded-2xl p-4 mb-4" style={{ backgroundColor: '#164194' }}>
//                 <Key className="w-8 h-8 text-white" />
//               </div>
//               <h2 className="text-2xl mb-2" style={{ color: '#164194' }}>
//                 كود التفعيل
//               </h2>
//               <p className="text-gray-600">
//                 {userType === 'student' ? 'للطالب' : 'للمعلم'}
//               </p>
//             </div>

//             {error && (
//               <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleActivationSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 mb-2 text-sm">
//                   أدخل كود التفعيل الخاص بك
//                 </label>
//                 <input
//                   type="text"
//                   value={activationCode}
//                   onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
//                   className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-center text-lg tracking-wider transition-all"
//                   style={{ borderColor: '#16419440' }}
//                   onFocus={(e) => e.target.style.borderColor = '#164194'}
//                   onBlur={(e) => e.target.style.borderColor = '#16419440'}
//                   placeholder="XXXXXX"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full text-white py-3 rounded-xl hover:opacity-90 transition-all shadow-md"
//                 style={{ backgroundColor: '#164194' }}
//               >
//                 تحقق من الكود
//               </button>

//               <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#16419420' }}>
//                 <p className="text-sm text-gray-600">
//                   💡 اطلب كود التفعيل من {userType === 'teacher' ? 'إدارة المدرسة' : 'معلمك'}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setMode('register');
//                   setActivationCode('');
//                   setError('');
//                 }}
//                 className="w-full text-gray-600 hover:text-gray-700 py-2"
//               >
//                 ← الرجوع
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Login/Register Screen
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#ECEEEF' }} dir="rtl">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <div className="text-center mb-6">
//             <div className="inline-block rounded-2xl p-4 mb-4" style={{ backgroundColor: '#164194' }}>
//               {userType === 'student' ? (
//                 <span className="text-4xl">👦</span>
//               ) : (
//                 <span className="text-4xl">👨‍🏫</span>
//               )}
//             </div>
//             <h2 className="text-2xl mb-2" style={{ color: '#164194' }}>
//               {mode === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
//             </h2>
//             <p className="text-gray-600">
//               {userType === 'student' ? 'للطالب' : 'للمعلم'}
//             </p>
//           </div>

//           {error && (
//             <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">
//               {error}
//             </div>
//           )}

//           <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
//             {mode === 'register' && (
//               <>
//                 {/* Activation Code Section */}
//                 <div className="rounded-xl p-4 mb-4 border-2" style={{ backgroundColor: '#16419410', borderColor: '#16419440' }}>
//                   <div className="flex items-center gap-2 mb-3">
//                     <Key className="w-5 h-5" style={{ color: '#164194' }} />
//                     <label className="font-medium" style={{ color: '#164194' }}>كود التفعيل</label>
//                   </div>
//                   <input
//                     type="text"
//                     value={activationCode}
//                     onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
//                     className="w-full px-4 py-3 rounded-lg border-2 outline-none text-center text-xl tracking-widest font-bold transition-all bg-white"
//                     style={{ borderColor: '#164194' }}
//                     placeholder="XXX123"
//                     maxLength={6}
//                   />
//                   <p className="text-xs text-gray-600 mt-2 text-center">
//                     💡 اطلب كود التفعيل من {userType === 'teacher' ? 'إدارة المدرسة' : 'معلمك'}
//                   </p>
//                 </div>

//                 {/* Name Input */}
//                 <div>
//                   <label className="block text-gray-700 mb-2 text-sm">الاسم الكامل</label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none transition-all"
//                     onFocus={(e) => e.target.style.borderColor = '#164194'}
//                     onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
//                     placeholder="أدخل اسمك الكامل"
//                   />
//                 </div>
//               </>
//             )}

//             <div>
//               <label className="block text-gray-700 mb-2 text-sm">البريد الإلكتروني</label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none transition-all"
//                 onFocus={(e) => e.target.style.borderColor = '#164194'}
//                 onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
//                 placeholder="example@email.com"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 mb-2 text-sm">كلمة المرور</label>
//               <input
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none transition-all"
//                 onFocus={(e) => e.target.style.borderColor = '#164194'}
//                 onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
//                 placeholder="••••••••"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full text-white py-3 rounded-xl hover:opacity-90 transition-all shadow-md"
//               style={{ backgroundColor: '#164194' }}
//             >
//               {mode === 'login' ? 'دخول' : 'إنشاء حساب'}
//             </button>

//             <div className="text-center mt-4">
//               {mode === 'login' ? (
//                 <button
//                   type="button"
//                   onClick={() => setMode('register')}
//                   className="hover:opacity-80"
//                   style={{ color: '#164194' }}
//                 >
//                   لا تملك حساباً؟ سجل الآن
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => setMode('login')}
//                   className="hover:opacity-80"
//                   style={{ color: '#164194' }}
//                 >
//                   لديك حساب؟ سجل دخول
//                 </button>
//               )}
//             </div>

//             <button
//               type="button"
//               onClick={() => setMode('choose')}
//               className="w-full text-gray-600 hover:text-gray-700 py-2"
//             >
//               ← الرجوع
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
