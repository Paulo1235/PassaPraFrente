// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import { toast } from "react-toastify";
// import { login } from "../lib/authSlice";
// import { loginSchema } from "../lib/form";
// import { Eye, EyeOff } from "lucide-react";

// export default function LoginForm({ backendUrl }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: loginSchema,
//     onSubmit: async (values) => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${backendUrl}/api/auth/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(values),
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Login failed");

//         const userResponse = await fetch(`${backendUrl}/api/protected-route`, {
//           credentials: "include",
//         });
//         if (!userResponse.ok) throw new Error("Failed to get user information");

//         const userData = await userResponse.json();
//         dispatch(login({ user: { email: values.email, message: userData.message } }));
//         navigate("/index");
//       } catch (err) {
//         toast.error("Login Falhou", {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//   });

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <label htmlFor="email" className="block text-sm font-medium text-txtp">
//             Email:
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="exemplo@email.com"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             className={`w-full px-3 py-2 border ${
//               formik.touched.email && formik.errors.email ? "border-red-500" : "border-txtp"
//             } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
//           />
//           {formik.touched.email && formik.errors.email && <p className="text-red-500 text-sm">{formik.errors.email}</p>}
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="password" className="block text-sm font-medium text-txtp">
//             Palavra-Passe:
//           </label>
//           <div className="relative">
//             <input
//               id="password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className={`w-full px-3 py-2 border ${
//                 formik.touched.password && formik.errors.password ? "border-red-500" : "border-txtp"
//               } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//             >
//               {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
//             </button>
//           </div>
//           {formik.touched.password && formik.errors.password && (
//             <p className="text-red-500 text-sm">{formik.errors.password}</p>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <a href="RecoverPass" className="text-sm text-txts hover:underline">
//           Alterar Palavra-Passe
//         </a>
//       </div>

//       <div className="mt-8 space-y-4">
//         <button
//           type="submit"
//           className="w-full text-white py-2 px-4 bg-btns hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
//         >
//           {isLoading ? (
//             <svg
//               className="animate-spin h-5 w-5 mx-auto"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4"></circle>
//               <path className="opacity-50" fill="#fff" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"></path>
//             </svg>
//           ) : (
//             "Entrar"
//           )}
//         </button>

//         <p className="text-center text-sm">
//           Novo aqui?{" "}
//           <a href="SignIn" className="text-txtp hover:underline">
//             Criar Conta
//           </a>
//         </p>
//       </div>
//     </form>
//   );
// }