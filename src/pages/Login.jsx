import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const user = useContext(UserContext);
  useEffect(() => {
    if (user.email) {
      navigate("/home");
    }
  }, [navigate, user.email]);

  const handleLogin = async () => {
    console.log("logging in...");
    await signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setEmail("");
        setPassword("");
        navigate("/home");
      })
      .catch((err) => {
        if (err.code === "auth/user-not-found") {
          alert(
            "Account not found. Kindly sign up with a new account instead."
          );
          setEmail("");
          setPassword("");
        } else if (err.code === "auth/wrong-password") {
          alert("Invalid password. Please try again");
          setPassword("");
        } else {
          console.log(err);
          alert("There was an error in logging you in.");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow ">
        <h2 className="text-3xl mb-5 font-bold">Login</h2>
        <div className="w-72">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
            value={email}
            required
            name="email"
            type="email"
            placeholder="chandler.bing@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-72 mt-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
            value={password}
            name="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="text-white w-44 bg-orange-400 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-5 mb-2"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="text-gray-500 underline text-sm"
          onClick={() => navigate("/register")}
        >
          <p>Don't have an account? Register now.</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
