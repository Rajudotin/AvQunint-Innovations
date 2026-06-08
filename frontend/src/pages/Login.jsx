import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      // Save User Data
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2">Task Manager</h1>

        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-2
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-2
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              py-2
              rounded-lg
              hover:bg-blue-700
              transition
              disabled:bg-gray-400
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-5 text-gray-600">
          Don't have an account?
          <Link to="/register" className="text-blue-600 ml-1 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
