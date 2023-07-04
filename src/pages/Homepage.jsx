import logo from "../assets/woofly-logo2.png";
import { useNavigate } from "react-router-dom";
import WoofCard from "../components/WoofCard";
import john from "../assets/john.jpg";
import ComposeWoof from "./ComposeWoof";
import { useContext } from "react";
import { UserContext, WoofsContext } from "../App";
import { formatDistanceToNow } from "date-fns";

function Homepage() {
  const { user, username } = useContext(UserContext);
  const navigate = useNavigate();
  const woofs = useContext(WoofsContext);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-start items-start">
      {console.log(woofs)}
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
            src={user.photoURL}
            alt="profile"
          />
        </div>
      </div>

      {/* new woof container */}
      <div className="hidden md:inline-block md:w-3/5 md:px-2 md:bg-white border md:border-gray-200 md:rounded-xl md:ml-72 md:shadow-lg md:p-5 md:mt-10">
        <ComposeWoof />
      </div>

      {/* woof card container */}
      <div className="w-full px-2 bg-white border border-gray-200 rounded-xl md:w-3/5 md:ml-72 md:shadow-lg md:p-5 md:mt-5">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {woofs
              .sort((a, b) => new Date(b.val.date) - new Date(a.val.date))
              .map((woof) => (
                <WoofCard
                  key={woof.key}
                  profilePicture={john}
                  name={woof.val.user} //need to change this
                  userName={woof.val.user} //need to change this
                  dateTime={formatDistanceToNow(new Date(woof.val.date), {
                    addSuffix: true,
                  })}
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
