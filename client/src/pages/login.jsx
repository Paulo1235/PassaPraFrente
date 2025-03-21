import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../lib/authSlice"; // Adjust the path as needed
import { useNavigate } from "react-router-dom"; // Using react-router-dom for navigation

// Backend URL from environment variable or default
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function LoginPage() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // React Router's useNavigate for navigation
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call the Express backend login endpoint
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();
      
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Get user info from protected route
      const userResponse = await fetch(`${BACKEND_URL}/api/protected-route`, {
        credentials: "include", // Important for cookies
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user information");
      }

      const userData = await userResponse.json();

      // Dispatch login action with username from the protected route
      dispatch(
        login({
          user: {
            email: email,
            message: userData.message,
          },
        })
      );

      navigate("/index"); // Navigate to the dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="p-3 mb-4 text-sm text-white bg-red-500 rounded">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
  );
}