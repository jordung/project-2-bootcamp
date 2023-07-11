import { useState, useEffect } from "react";
import { Tabs, Tab } from "./Tabs";
import SearchedUserCard from "../components/SearchedUserCard";
import { TbFaceIdError } from "react-icons/tb";
import { GoXCircle } from "react-icons/go";

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
            <div className="flex items-center justify-between border-solid border-slate-200 rounded-b ">
              <h2 className="px-4 py-2 text-gray-800 font-bold uppercase text-xs">
                @{userinfo.username}
              </h2>
              <button
                className="px-2 py-2 text-sm outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setFollowModal(false)}
              >
                <GoXCircle className="h-5 w-5 hover:text-red-400 transition duration-300" />
              </button>
            </div>
            {/* body */}
            <div className="relative px-6 flex-auto ">
              <Tabs>
                <Tab label="Following" className="text-xs">
                  <div className="pt-1 md:pb-0 max-sm:min-w-[80vw] overflow-auto max-h-[30vh]">
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
                              <p className="text-xs font-medium text-gray-900 truncate text-center">
                                Currently not following anyone..
                              </p>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </Tab>
                <Tab label="Followers">
                  <div className="pt-1 md:pb-0 max-sm:min-w-[80vw] overflow-auto max-h-[30vh]">
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
                              <p className="text-xs font-medium text-gray-900 truncate text-center">
                                No followers found..
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
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default FollowModal;
