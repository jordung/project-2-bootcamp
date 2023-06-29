import logo from "../assets/woofly-logo2.png";
import WoofCard from "../components/WoofCard";
import john from "../assets/john.jpg";
import mary from "../assets/mary.jpg";
import apostles from "../assets/apostles.jpeg";

function Homepage() {
  return (
    <div className="bg-white min-h-screen flex flex-col justify-start items-start">
      {/* header logo bar */}
      <div className="flex justify-center w-screen items-center h-16 md:justify-start md:hidden">
        <img
          className="w-12 h-12 py-2 px-2 md:w-20 md:h-20 md:m-8"
          src={logo}
          alt="Woofly Logo"
        />
      </div>

      {/* woof card container */}
      <div className="w-full px-2 bg-white border border-gray-200 md:w-3/5 md:ml-60">
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
