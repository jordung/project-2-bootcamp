import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Homepage from "./pages/Homepage";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

export const UserContext = createContext({});

function App() {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <div>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<Homepage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="search" element={<Search />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
        <Navbar />
      </UserContext.Provider>
    </div>
  );
}

export default App;
