import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Register = () => {
  const [email, setEmail] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  useEffect(() => {
    if (user.email) {
      navigate("/home");
    }
  }, [navigate, user.email]);

  useEffect(() => {
    if (confirmPassword !== password) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [confirmPassword, password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("signing up...");
    if (email && password) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          console.log("signed in!");
          console.log(userCred);
          setEmail("");
          setPassword("");
          navigate("/newProfile");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow ">
        <h2 className="text-3xl mb-5 font-bold">Register</h2>
        <form className="flex flex-col items-center">
          {/* <div className="w-72 mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              First Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
              value={firstName}
              required
              name="firstname"
              type="text"
              placeholder="Chandler"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-72 mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Last Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
              value={lastName}
              required
              name="lastname"
              type="text"
              placeholder="Bing"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div> */}
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
          {/* <div className="w-72 mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
              value={username}
              // required
              name="username"
              type="text"
              placeholder="chandlerbing"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div> */}
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
          <div className="w-72 mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
              // value={password}
              name="password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              // onChange={(e) => setPassword(e.target.value)}
            />
            {passwordMismatch && (
              <p className="text-red-400 text-sm">Passwords do not match.</p>
            )}
          </div>
          <button
            className={`text-white w-44 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-5 mb-2 transition-all duration-300 ease-in-out ${
              passwordMismatch ? "bg-gray-400" : "bg-orange-400"
            }`}
            onClick={handleRegister}
            disabled={passwordMismatch}
          >
            Register
          </button>
        </form>
        <button
          className="text-gray-500 underline text-sm"
          onClick={() => navigate("/login")}
        >
          <p>Have an account? Back to Login</p>
        </button>
      </div>
    </div>
  );
};

export default Register;
