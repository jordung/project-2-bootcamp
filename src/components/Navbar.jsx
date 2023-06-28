import { GoHome, GoSearch, GoBell, GoMail } from "react-icons/go";
import { FaPaw } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="sticky bottom-0 border border-gray-200 w-screen p-5 flex justify-center items-center gap-10">
      <Link to="home">
        <GoHome className="h-8 w-8 text-gray-500 hover:text-orange-400 transition duration-300" />
      </Link>
      <Link to="search">
        <GoSearch className="h-8 w-8 text-gray-500 hover:text-orange-400 transition duration-300" />
      </Link>
      <FaPaw className="h-12 w-12 text-orange-400" />
      <Link to="notifications">
        <GoBell className="h-8 w-8 text-gray-500 hover:text-orange-400 transition duration-300" />
      </Link>
      <Link to="messages">
        <GoMail className="h-8 w-8 text-gray-500 hover:text-orange-400 transition duration-300" />
      </Link>
    </div>
  );
}

export default Navbar;
