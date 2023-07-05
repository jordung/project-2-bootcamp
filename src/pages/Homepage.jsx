import logo from "../assets/woofly-logo2.png";
import { useNavigate } from "react-router-dom";
import WoofCard from "../components/WoofCard";
import ComposeWoof from "./ComposeWoof";
import { useContext } from "react";
import { UserContext, WoofsContext } from "../App";

function Homepage() {
  const { user, userinfo } = useContext(UserContext);
  const navigate = useNavigate();
  const woofs = useContext(WoofsContext);

  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.abs(now - date) / 1000;
    const days = Math.floor(diffInSeconds / 86400);
    const hours = Math.floor(diffInSeconds / 3600) % 24;
    const minutes = Math.floor(diffInSeconds / 60) % 60;

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "now";
    }
  };

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
            src={userinfo.profilePicture}
            alt="profile"
          />
        </div>
      </div>

      {/* new woof container */}
      <div className="hidden md:inline-block md:w-3/5 md:px-2 md:bg-white border md:border-gray-200 md:rounded-xl md:ml-72 md:shadow-lg md:p-5 md:mt-10">
        <ComposeWoof />
      </div>

      {/* woof card container */}
      <div className="w-full px-2 mb-24 bg-white border border-gray-200 rounded-xl md:w-3/5 md:ml-72 md:shadow-lg md:p-5 md:mt-5 md:pb-0">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {woofs
              .sort((a, b) => new Date(b.val.date) - new Date(a.val.date))
              .map((woof) => (
                <WoofCard
                  key={woof.key}
                  user={woof.val.user}
                  profilePicture={woof.val.profilePicture}
                  name={woof.val.name}
                  userName={woof.val.username}
                  dateTime={formatTime(new Date(woof.val.date))}
                  content={woof.val.woof}
                  comments={woof.val.comments ? woof.val.comments : 0}
                  rewoofs={woof.val.rewoofs ? woof.val.rewoofs : 0}
                  likes={woof.val.likes ? woof.val.likes : 0}
                  image={woof.val.url ? woof.val.url : null}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
