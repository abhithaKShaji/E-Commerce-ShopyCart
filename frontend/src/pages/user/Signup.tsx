import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupLeftSection from "../../features/login/components/SignupLeft";
import { useRegister } from "../../features/login/hooks/useRegister";

const SignupPage = () => {
  const navigate = useNavigate();
  const { registerUser, loading, error, success } = useRegister();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      console.log(res.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-md overflow-hidden w-full max-w-4xl">
        <SignupLeftSection />

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border-b-2 border-pink-500 focus:outline-none py-2 text-gray-700"
                required
              />
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border-b-2 border-pink-500 focus:outline-none py-2 text-gray-700"
                required
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border-b-2 border-pink-500 focus:outline-none py-2 text-gray-700"
                required
              />
            </div>

            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Terms of Use
              </span>{" "}
              and{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 hover:bg-blue-600 transition text-white font-semibold w-full py-3 rounded-sm text-sm disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            <div className="text-center mt-6 text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-pink-600 font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
