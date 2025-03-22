import { useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "../../lib/authSlice"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { loginSchema } from "../../lib/form"
import { toast, ToastContainer } from "react-toastify"


// Backend URL from environment variable or default
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const { email, password } = values

      setError("")
      setIsLoading(true)

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Login failed")
        }

        const userResponse = await fetch(`${BACKEND_URL}/api/protected-route`, {
          credentials: "include",
        })

        if (!userResponse.ok) {
          throw new Error("Failed to get user information")
        }

        const userData = await userResponse.json()

        dispatch(
          login({
            user: {
              email: values.email,
              message: userData.message,
            },
          }),
        )

        // Show success notification
        

        navigate("/index")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed")
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <div className="font-raleway flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Login</h2>
        </div>
        <ToastContainer />
        <form onSubmit={formik.handleSubmit} className="p-6">
          {error && <div className="p-3 mb-4 text-sm text-white bg-red-500 rounded">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
