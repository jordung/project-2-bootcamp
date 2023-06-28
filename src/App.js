import "./App.css";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <div>
      <Routes>
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
