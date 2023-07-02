import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Homepage from "./pages/Homepage";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ComposeWoof from "./pages/ComposeWoof";

export const UserContext = createContext({});

function App() {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Signed out :(");
      navigate("/");
    });
  };

  return (
    <div>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Homepage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="search" element={<Search />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="composeWoof" element={<ComposeWoof />} />
          <Route
            path="profile"
            element={<Profile handleSignOut={handleSignOut} />}
          />
        </Routes>
        <Navbar handleSignOut={handleSignOut} />
      </UserContext.Provider>
    </div>
  );
}

export default App;
