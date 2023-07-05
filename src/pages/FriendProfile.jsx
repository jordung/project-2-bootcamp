import { Tabs, Tab } from "../components/Tabs";
import WoofCard from "../components/WoofCard";
import mary from "../assets/mary.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext, WoofsContext } from "../App";

import { auth } from "../firebase";
import { ref as databaseRef, update } from "firebase/database";
import { database, storage } from "../firebase";

function FriendProfile() {
  const { user, userinfo } = useContext(UserContext);
  const woofs = useContext(WoofsContext);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id === user.uid) {
      navigate("/profile");
    }
  }, [user.uid, id, navigate]);

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
    <div className="w-full px-4 flex flex-col justify-center items-start md:border md:border-gray-200 md:rounded-xl md:w-3/5 md:ml-72 md:shadow-lg md:p-7 md:mt-10">
      <div className="absolute -z-10 top-0 left-0 md:relative">
        <img
          className="object-cover w-screen h-[15vh] md:rounded-2xl lg:h-[25vh]"
          src={userinfo.profileBanner}
          alt="profile banner"
        />
      </div>
      <div className="flex justify-between w-full items-end mt-20 md:-mt-12 md:px-12">
        <img
          className="h-24 w-24 object-cover rounded-lg border-4 border-white"
          src={user.photoURL}
          alt="profile"
        />
        {/* <button
          className="hidden md:inline-block md:px-4 md:py-2 md:text-sm md:font-medium md:text-gray-900 md:bg-white md:border md:border-gray-200 md:rounded-lg"
          type="button"
          //   onClick={() => setEditProfileModal(true)}
        >
          Edit Profile
        </button> */}

        <div
          className="inline-flex rounded-md shadow-sm md:hidden"
          role="group"
        >
          {/* <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg "
            // onClick={() => setEditProfileModal(true)}
          >
            Edit Profile
          </button> */}
        </div>
      </div>
      <h5 className="mt-3 text-lg font-medium md:px-12">{user.displayName}</h5>
      <p className="text-gray-500 text-md md:px-12">@{userinfo.username}</p>
      <p className="mt-3 text-sm md:px-12">{userinfo.bio}</p>
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
          <div className="pt-1 pb-24 md:pb-0 max-sm:min-w-[90vw]">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {woofs
                  .sort((a, b) => new Date(b.val.date) - new Date(a.val.date))
                  .filter((woof) => woof.val.user === id)
                  .map((woof) => (
                    <WoofCard
                      key={woof.key}
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
        </Tab>
        <Tab label="Likes">
          <div className="pt-1 pb-24 md:pb-0 max-sm:min-w-[90vw]">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {/* <WoofCard
                  profilePicture={mary}
                  name="Mary Anne"
                  userName="maryland"
                  dateTime="45m"
                  content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste alias ipsum architecto vitae magni ullam velit error veniam fugit expedita?"
                  comments="1123"
                  rewoofs="24440"
                  likes="600"
                /> */}
              </ul>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default FriendProfile;
