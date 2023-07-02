import profilePicture from "../assets/john.jpg";
import profileBanner from "../assets/apostles.jpeg";
import { Tabs, Tab } from "../components/Tabs";
import WoofCard from "../components/WoofCard";
import mary from "../assets/mary.jpg";
import { Link } from "react-router-dom";

function Profile({ handleSignOut }) {
  return (
    <div className="w-full px-4 flex flex-col justify-center items-start md:border md:border-gray-200 md:rounded-xl md:w-3/5 md:ml-72 md:shadow-lg md:p-7 md:mt-10">
      <div className="absolute -z-10 top-0 left-0 md:relative">
        <img
          className="object-cover w-screen h-[15vh] md:rounded-2xl"
          src={profileBanner}
          alt="profile banner"
        />
      </div>
      <div className="flex justify-between w-full items-end mt-20 md:-mt-12 md:px-12">
        <img
          className="h-24 w-24 object-cover rounded-lg border-4 border-white"
          src={profilePicture}
          alt="profile"
        />
        <button className="hidden md:inline-block md:px-4 md:py-2 md:text-sm md:font-medium md:text-gray-900 md:bg-white md:border md:border-gray-200 md:rounded-lg">
          Edit Profile
        </button>
        <div
          className="inline-flex rounded-md shadow-sm md:hidden"
          role="group"
        >
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg "
          >
            Edit Profile
          </button>
          <Link
            to="/"
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md"
            onClick={() => handleSignOut()}
          >
            Sign Out
          </Link>
        </div>
      </div>
      <h5 className="mt-3 text-lg font-medium md:px-12">John Doe</h5>
      <p className="text-gray-500 text-md md:px-12">@johndoe</p>
      <p className="mt-3 text-sm md:px-12">What's happening?!</p>
      <div className="flex gap-4 mt-3 md:px-12">
        <div className="flex gap-1">
          <p className="text-sm font-bold">50</p>
          <p className="uppercase text-sm text-gray-500">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="text-sm font-bold">50</p>
          <p className="uppercase text-sm text-gray-500">Followers</p>
        </div>
      </div>
      <Tabs>
        <Tab label="Woofs">
          <div className="pt-4 pb-24 md:pb-0">
            <div className="w-full bg-white border border-gray-200 rounded-xl">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  <WoofCard
                    profilePicture={profilePicture}
                    name="John Doe"
                    userName="@johndoe"
                    dateTime="45m"
                    content="I love Woofly!"
                    comments="13"
                    rewoofs="20"
                    likes="6"
                  />
                  <WoofCard
                    profilePicture={profilePicture}
                    name="John Doe"
                    userName="@johndoe"
                    dateTime="45m"
                    content="I love Woofly!"
                    comments="13"
                    rewoofs="20"
                    likes="6"
                  />
                  <WoofCard
                    profilePicture={profilePicture}
                    name="John Doe"
                    userName="@johndoe"
                    dateTime="45m"
                    content="I love Woofly!"
                    comments="13"
                    rewoofs="20"
                    likes="6"
                  />
                  <WoofCard
                    profilePicture={profilePicture}
                    name="John Doe"
                    userName="@johndoe"
                    dateTime="45m"
                    content="I love Woofly!"
                    comments="13"
                    rewoofs="20"
                    likes="6"
                  />
                  <WoofCard
                    profilePicture={profilePicture}
                    name="John Doe"
                    userName="@johndoe"
                    dateTime="45m"
                    content="I love Woofly!"
                    comments="13"
                    rewoofs="20"
                    likes="6"
                  />
                  <WoofCard
                    profilePicture={profilePicture}
                    name="John Doe"
                    userName="@johndoe"
                    dateTime="45m"
                    content="I love Woofly!"
                    comments="13"
                    rewoofs="20"
                    likes="6"
                  />
                  <WoofCard
                    profilePicture={profilePicture}
                    name="John Doe"
                    userName="@johndoe"
                    dateTime="45m"
                    content="I love Woofly!"
                    comments="13"
                    rewoofs="20"
                    likes="6"
                  />
                </ul>
              </div>
            </div>
          </div>
        </Tab>
        <Tab label="Likes">
          <div className="pt-4 pb-24 md:pb-0">
            <div className="w-full bg-white border border-gray-200 rounded-xl">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  <WoofCard
                    profilePicture={mary}
                    name="Mary Anne"
                    userName="@maryland"
                    dateTime="45m"
                    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste alias ipsum architecto vitae magni ullam velit error veniam fugit expedita?"
                    comments="1123"
                    rewoofs="24440"
                    likes="600"
                  />
                </ul>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Profile;
