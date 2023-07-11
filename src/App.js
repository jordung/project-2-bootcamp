import "./App.css";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import {
  ref as databaseRef,
  onChildChanged,
  onValue,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";

import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Homepage from "./pages/Homepage";
import Chatterbox from "./pages/Chatterbox";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ComposeWoof from "./pages/ComposeWoof";
import NewProfile from "./pages/NewProfile";
import ErrorPage from "./pages/ErrorPage";
import FriendProfile from "./pages/FriendProfile";
import Explore from "./pages/Explore";

export const UserContext = createContext({});
export const WoofsContext = createContext({});
export const UserDataContext = createContext({});
export const ChatDataContext = createContext({});

function App() {
  const [user, setUser] = useState({});
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userinfo, setUserinfo] = useState("");
  const [woofs, setWoofs] = useState([]);
  const [userData, setUserData] = useState();
  const [chatData, setChatData] = useState();

  const navigate = useNavigate();

  const DB_WOOFS_KEY = "woofs";
  const DB_USERINFO_KEY = "userinfo/";
  const DB_CHAT_KEY = "chats";

  useEffect(() => {
    const woofsRef = databaseRef(database, DB_WOOFS_KEY);

    const handleChildChanged = (data) => {
      const woofKey = data.key;
      const updatedWoof = { key: woofKey, val: data.val() };

      setWoofs((prevWoofs) => {
        // Find the index of the existing woof with the same key
        const existingWoofIndex = prevWoofs.findIndex(
          (woof) => woof.key === woofKey
        );

        if (existingWoofIndex !== -1) {
          // If the woof exists, replace it with the updated woof
          const updatedWoofs = [...prevWoofs];
          updatedWoofs[existingWoofIndex] = updatedWoof;
          return updatedWoofs;
        } else {
          // If the woof doesn't exist, add it to the woofs state
          return [...prevWoofs, updatedWoof];
        }
      });
    };

    onChildAdded(woofsRef, (data) => {
      setWoofs((prevwoofs) => [
        ...prevwoofs,
        { key: data.key, val: data.val() },
      ]);
    });

    onChildRemoved(woofsRef, (data) => {
      setWoofs((prevwoofs) =>
        prevwoofs.filter((woof) => woof.key !== data.key)
      );
    });

    onChildChanged(woofsRef, handleChildChanged);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);
        const userInfoRef = databaseRef(database, DB_USERINFO_KEY + user.uid);
        onValue(userInfoRef, (snapshot) => {
          setUserinfo(snapshot.val());
        });
        navigate("/home");
      } else {
        setUser({});
        setUserinfo("");
      }
    });

    const userDataRef = databaseRef(database, DB_USERINFO_KEY);
    onValue(userDataRef, (snapshot) => {
      setUserData(snapshot.val());
    });

    const messagesRef = databaseRef(database, DB_CHAT_KEY);
    onValue(messagesRef, (snapshot) => {
      setChatData(snapshot.val());
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Successfully logged out!");
      navigate("/");
    });
  };

  return (
    <div>
      <UserContext.Provider value={{ user, userinfo }}>
        <WoofsContext.Provider value={woofs}>
          <UserDataContext.Provider value={userData}>
            <ChatDataContext.Provider value={chatData}>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="home" element={<Homepage />} />
                <Route path="chatterbox" element={<Chatterbox />} />
                <Route path="search" element={<Search />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="composeWoof" element={<ComposeWoof />} />
                <Route path="newProfile" element={<NewProfile />} />
                <Route path="explore" element={<Explore />} />
                <Route
                  path="profile"
                  element={<Profile handleSignOut={handleSignOut} />}
                />
                <Route path="/profile/:id" element={<FriendProfile />} />
                <Route path="*" element={<Navigate replace to="/404" />} />
                <Route path="/404" element={<ErrorPage />} />
              </Routes>
              <Navbar handleSignOut={handleSignOut} />
            </ChatDataContext.Provider>
          </UserDataContext.Provider>
        </WoofsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
