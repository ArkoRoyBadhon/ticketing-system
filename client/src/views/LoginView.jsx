import { useState } from "react";
import { useLoginMutation } from "../redux/features/auth.api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/auth.slice";
import { useNavigate } from "react-router-dom";

const LoginView = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");
    try {
      const { data } = await login(formData);
      if (!data) {
        return toast.error("Something went wrong");
      }
      if (!data.success) {
        return toast.error(data.message);
      }

      const authData = {
        user: data.data,
        token: data.accessToken,
      };
      dispatch(setUser(authData));
      Cookies.set("refreshToken", data.refreshToken);
      Cookies.set("accessToken", data.accessToken);

      toast.success("Successfully logged in", {
        description: "Welcome back!",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center mt-20">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-violet-600 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            {`Don't have an account?`}{" "}
            <a href="/register" className="text-violet-600 hover:underline">
              Sign up
            </a>
          </p>
          <p className="text-center text-gray-600 mt-2">
            Forgot your password?{" "}
            <a
              href="/reset-password"
              className="text-violet-600 hover:underline"
            >
              Reset here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
