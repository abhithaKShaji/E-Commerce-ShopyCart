import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginLeft } from "../../features/login";
import { useLogin } from "../../features/login/hooks/useLogin";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading, error } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(formData);
      toast.success("Login successful!", { position: "top-right" });
      navigate("/");
    } catch {
      toast.error(error || "Login failed", { position: "top-right" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Toaster />
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-md overflow-hidden w-full max-w-4xl">
        <LoginLeft />
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border-b-2 border-pink-500 focus:outline-none py-2 text-gray-700"
              required
            />

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border-b-2 border-pink-500 focus:outline-none py-2 pr-10 text-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-gray-500 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 hover:bg-blue-600 transition text-white font-semibold w-full py-3 rounded-sm text-sm disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <div className="text-center mt-6 text-sm">
              <p className="text-gray-600">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-pink-600 font-medium hover:underline"
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
