import logo from "../assets/woofly-logo2.png";
import { useNavigate } from "react-router-dom";
import WoofCard from "../components/WoofCard";
import ComposeWoof from "./ComposeWoof";
import { useContext } from "react";
import { UserContext, WoofsContext } from "../App";
import { formatTime } from "../utils/utils";

function Homepage() {
  const { user, userinfo } = useContext(UserContext);
  const navigate = useNavigate();
  const woofs = useContext(WoofsContext);

  let followedUsers = [user.uid];

  if (userinfo.following !== undefined) {
    followedUsers = Object.keys(userinfo.following);
    followedUsers.push(user.uid);
  }

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
        {followedUsers.length < 2 && (
          <div className="flex justify-center">
            <span
              className="bg-blue-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 my-3 rounded-full cursor-pointer hover:bg-blue-200 transition duration-300 md:mt-0 md:mb-5"
              onClick={() => navigate("/search")}
            >
              Follow someone to view their woofs!
            </span>
          </div>
        )}
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {woofs
              .filter((woof) => followedUsers.includes(woof.val.user))
              .sort((a, b) => new Date(b.val.date) - new Date(a.val.date))
              .map((woof) => (
                <WoofCard
                  key={woof.key}
                  woofKey={woof.key}
                  user={woof.val.user}
                  profilePicture={woof.val.profilePicture}
                  name={woof.val.name}
                  userName={woof.val.username}
                  dateTime={formatTime(new Date(woof.val.date))}
                  content={woof.val.woof}
                  comments={woof.val.comments ? woof.val.comments : 0}
                  rewoofs={woof.val.rewoofs}
                  likes={woof.val.likes}
                  image={woof.val.url ? woof.val.url : null}
                  canDelete={woof.val.user === user.uid}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
