import { GoHome, GoSearch, GoBell, GoMail } from "react-icons/go";
import { FaPaw } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/woofly-logo2.png";
import { useLocation } from "react-router-dom";
import john from "../assets/john.jpg";

function Navbar() {
  const location = useLocation();
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  return (
    <div className="fixed bg-white bottom-0 border border-gray-200 w-screen p-5 flex justify-center items-center gap-10 md:w-60 md:fixed md:flex-col md:top-10 md:left-5 md:justify-start md:shadow-lg md:min-h-fit md:rounded-xl">
      <div className="flex justify-center items-center h-16 md:center max-sm:hidden md:z-10">
        <img
          className="w-12 h-12 py-2 px-2 md:w-20 md:h-20 md:m-8"
          src={logo}
          alt="Woofly Logo"
        />
      </div>
      <div className="flex gap-10 w-full md:flex-col md:w-2/3 md:my-12">
        {/* <Link to="login">Login/Signup</Link> */}

        <Link to="home" className="flex items-center gap-2 group">
          <GoHome className="h-8 w-8 text-gray-500 group-hover:text-orange-400 transition duration-300" />
          <p className="hidden md:inline-block text-md font-bold text-gray-500 group-hover:text-orange-400 transition duration-300">
            Home
          </p>
        </Link>
        <Link to="search" className="flex items-center gap-2 group">
          <GoSearch className="h-8 w-8 text-gray-500 group-hover:text-orange-400 transition duration-300" />
          <p className="hidden md:inline-block text-md font-bold text-gray-500 group-hover:text-orange-400 transition duration-300">
            Search
          </p>
        </Link>
        <FaPaw className="h-12 w-12 text-orange-400 md:hidden" />
        <Link to="notifications" className="flex items-center gap-2 group">
          <GoBell className="h-8 w-8 text-gray-500 group-hover:text-orange-400 transition duration-300" />
          <p className="hidden md:inline-block text-md font-bold text-gray-500 group-hover:text-orange-400 transition duration-300">
            Notifications
          </p>
        </Link>
        <Link to="messages" className="flex items-center gap-2 group">
          <GoMail className="h-8 w-8 text-gray-500 group-hover:text-orange-400 transition duration-300" />
          <p className="hidden md:inline-block text-md font-bold text-gray-500 group-hover:text-orange-400 transition duration-300">
            Messages
          </p>
        </Link>
        <Link
          to="profile"
          className="hidden group md:visible md:flex md:items-center md:gap-2"
        >
          <img
            className="hidden md:inline-block md:h-8 md:w-8 md:rounded-full md:shadow md:group-hover:ring-2 md:group-hover:ring-orange-400 md:transition md:duration-300"
            src={john}
            alt="profile"
          />
          <p className="hidden md:inline-block text-md font-bold text-gray-500 group-hover:text-orange-400 transition duration-300">
            Profile
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
