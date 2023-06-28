import "./App.css";
import { Route, Routes, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <Link to="login">Temporary</Link>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="home" element={<Homepage />} />
        <Route path="messages" element={<Messages />} />
        <Route path="search" element={<Search />} />
        <Route path="notifications" element={<Notifications />} />
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;
