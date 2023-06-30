import logo from "../assets/woofly-logo2.png";
import { useNavigate } from "react-router-dom";
import WoofCard from "../components/WoofCard";
import john from "../assets/john.jpg";
import mary from "../assets/mary.jpg";
import apostles from "../assets/apostles.jpeg";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col justify-start items-start">
      {/* header logo bar */}
      <div className="flex justify-between w-screen items-center h-16 md:justify-start md:hidden">
        <img
          className="w-12 h-12 py-2 px-2 mx-5 md:w-20 md:h-20 md:m-8"
          src={logo}
          alt="Woofly Logo"
        />
        <div
          onClick={() => navigate("/profile")}
          className="flex p-5 md:hidden "
        >
          <img
            className="inline-block h-8 w-8 rounded-full shadow md:hidden"
            src={john}
            alt="profile"
          />
        </div>
      </div>

      {/* woof card container */}
      <div className="w-full px-2 bg-white border border-gray-200 rounded-xl md:w-3/5 md:ml-72 md:shadow-lg md:p-5 md:mt-10">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            <WoofCard
              profilePicture={john}
              name="John Doe"
              userName="@johndoe"
              dateTime="45m"
              content="I love Woofly!"
              comments="13"
              rewoofs="20"
              likes="6"
            />
            <WoofCard
              profilePicture={mary}
              name="Mary Anne"
              userName="@maryland"
              dateTime="45m"
              content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste alias ipsum architecto vitae magni ullam velit error veniam fugit expedita?"
              comments="1123"
              rewoofs="24440"
              likes="600"
              image={apostles}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
