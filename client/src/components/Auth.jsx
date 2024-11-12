import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { setisLoggedin, setToken, setUser } from "../utils/AuthSlice";

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const [auth, setAuth] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userpass, setUserPass] = useState("");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (auth === "Sign Up") {
        response = await axios.post(
          "http://localhost:4000/api/v1/user/signUp",
          data
        );
      }
      if (auth === "Login") {
        response = await axios.post(
          "http://localhost:4000/api/v1/user/logIn",
          data
        );
      }

      if (response.data) {
        if (response.data.success) {
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.token);
          dispatch(setToken(response.data.token));
          dispatch(setisLoggedin(true));
          dispatch(setUser(response.data.user));

          setUsername("");
          setEmail("");
          setUserPass("");
          navigate("/home");
        } else toast.error(response.data.message || response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(setisLoggedin(true));
      navigate("/home");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400">
      <form
        onSubmit={handleSubmitButton}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {auth}
        </h1>

        {/* Sign-Up Name Field */}
        {auth === "Sign Up" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
                setUsername(e.target.value);
              }}
              placeholder="Enter Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
              setEmail(e.target.value);
            }}
            placeholder="Enter Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={userpass}
            onChange={(e) => {
              setData({ ...data, password: e.target.value });
              setUserPass(e.target.value);
            }}
            placeholder="Enter Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          {auth}
        </button>

        {/* Toggle between Login and Sign-Up */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            {auth === "Login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={() => setAuth(auth === "Login" ? "Sign Up" : "Login")}
              className="text-blue-500 font-medium hover:underline ml-1"
            >
              {auth === "Login" ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
