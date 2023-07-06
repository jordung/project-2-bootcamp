import { useState, useEffect } from "react";
import { Tabs, Tab } from "./Tabs";
import SearchedUserCard from "../components/SearchedUserCard";
import { TbFaceIdError } from "react-icons/tb";

function FollowModal({ setFollowModal, userinfo, userData }) {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    setFollowing([]);
    setFollowers([]);

    if (userinfo.following !== undefined) {
      const userFollowings = Object.keys(userData).filter((userId) => {
        const followingKeys = Object.keys(userinfo.following);
        return followingKeys.includes(userId);
      });

      for (let item of userFollowings) {
        setFollowing((prevState) => [...prevState, userData[item]]);
      }
    }

    if (userinfo.followers !== undefined) {
      const userFollowers = Object.keys(userData).filter((userId) => {
        const followerKeys = Object.keys(userinfo.followers);
        return followerKeys.includes(userId);
      });
      for (let item of userFollowers) {
        setFollowers((prevState) => [...prevState, userData[item]]);
      }
    }
  }, [userData, userinfo]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 mx-2">
        <div className="relative w-full max-w-3xl mx-5 md:w-1/2">
          {/* content */}
          <div className="rounded-lg bg-white">
            {/* header */}
            <div className="flex items-center justify-center px-5 pt-5 pb-0 border-t border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl font-semibold">@{userinfo.username}</h3>
            </div>
            {/* body */}
            <div className="relative px-6 flex-auto ">
              <Tabs>
                <Tab label="Following">
                  <div className="pt-1 md:pb-0 max-sm:min-w-[90vw] overflow-auto max-h-[30vh]">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200">
                        {following.length > 0 ? (
                          following.map((user) => (
                            <SearchedUserCard
                              key={user.userId}
                              userKey={user.userId}
                              profilePicture={user.profilePicture}
                              name={user.name}
                              username={user.username}
                              bio={user.bio}
                            />
                          ))
                        ) : (
                          <li className="py-3">
                            <div className="flex items-center justify-center space-x-1">
                              <TbFaceIdError className="h-6 w-6 text-orange-400" />
                              <p className="text-md font-medium text-gray-900 truncate text-center">
                                Start by following someone!
                              </p>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </Tab>
                <Tab label="Followers">
                  <div className="pt-1 pb-24 md:pb-0 max-sm:min-w-[90vw]">
                    <div className="flow-root">
                      <ul className="divide-y divide-gray-200">
                        {followers.length > 0 ? (
                          followers.map((user) => (
                            <SearchedUserCard
                              key={user.userId}
                              userKey={user.userId}
                              profilePicture={user.profilePicture}
                              name={user.name}
                              username={user.username}
                              bio={user.bio}
                            />
                          ))
                        ) : (
                          <li className="py-3">
                            <div className="flex items-center justify-center space-x-1">
                              <TbFaceIdError className="h-6 w-6 text-orange-400" />
                              <p className="text-md font-medium text-gray-900 truncate text-center">
                                No users found..
                              </p>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
            {/* footer */}
            <div className="flex flex-col items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-400 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setFollowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default FollowModal;
