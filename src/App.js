import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "./firebase";

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
import NewProfile from "./pages/NewProfile";
import { onChildAdded, ref } from "firebase/database";

export const UserContext = createContext({});
export const WoofsContext = createContext({});

function App() {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [woofs, setWoofs] = useState([]);

  const navigate = useNavigate();
  const DB_WOOFS_KEY = "woofs";

  const DB_USERNAME_KEY = "username/";

  useEffect(() => {
    const woofsRef = ref(database, DB_WOOFS_KEY);

    onChildAdded(woofsRef, (data) => {
      setWoofs((prevwoofs) => [
        ...prevwoofs,
        { key: data.key, val: data.val() },
      ]);
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);
        const usernameRef = databaseRef(database, DB_USERNAME_KEY + user.uid);
        onValue(usernameRef, (snapshot) => {
          setUsername(snapshot.val());
        });
      } else {
        setUser({});
        setUsername("");
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
      <UserContext.Provider value={{ user, username }}>
        <WoofsContext.Provider value={woofs}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="home" element={<Homepage />} />
            <Route path="messages" element={<Messages />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="composeWoof" element={<ComposeWoof />} />
            <Route path="newProfile" element={<NewProfile />} />
            <Route
              path="profile"
              element={<Profile handleSignOut={handleSignOut} />}
            />
          </Routes>
          <Navbar handleSignOut={handleSignOut} />
        </WoofsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
