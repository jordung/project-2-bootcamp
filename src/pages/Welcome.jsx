import logo from "../assets/woofly-logo2.png";
import { useNavigate } from "react-router-dom";
import welcomeBg from "../assets/welcome-bg.jpg";

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="max-sm:bg-white min-h-screen flex justify-center items-center">
      <div className="hidden md:inline-block h-screen w-[80vw]">
        <img
          className="h-full w-full object-cover"
          src={welcomeBg}
          alt="welcome-bg"
        />
      </div>
      <div className="flex flex-col justify-center items-center w-[80vw] h-[70vh] rounded-xl max-sm:bg-white bg-opacity-80 md:justify-start md:items-center">
        <img className="h-72 w-72 object-contain" src={logo} alt="logo" />
        <h1 className="text-2xl font-bold py-4 w-full text-center md:text-3xl">
          Hey, Welcome to{" "}
          <span className="md:text-3xl text-2xl py-2 bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 animate-gradient-x bg-clip-text text-transparent animate-gradient-x ease-in-out transition-all duration-300">
            Woofly
          </span>{" "}
          🐶
        </h1>
        <p className="text-md mb-1 text-gray-500 px-5 py-2 text-center">
          Connect, Share, and Explore with Woofly, the ultimate social
          networking app.
        </p>
        <p className="text-md mb-1 text-gray-500 px-5 py-2 text-center">
          Join our vibrant community and embark on a journey filled with
          meaningful connections.
        </p>
        <button
          type="button"
          className="text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-full text-md w-full px-10 py-4 mr-2 mt-4 md:w-[20vw]"
          onClick={() => navigate("/login")}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}

export default Welcome;
