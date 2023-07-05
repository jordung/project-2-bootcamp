import { useContext, useEffect, useState } from "react";
import { UserContext, WoofsContext } from "../App";
import { Tabs, Tab } from "../components/Tabs";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "../firebase";
import SearchedUserCard from "../components/SearchedUserCard";
import { TbFaceIdError } from "react-icons/tb";
import { BiSolidDog } from "react-icons/bi";
import WoofCard from "../components/WoofCard";

function Search() {
  const { user, userinfo } = useContext(UserContext);
  const woofs = useContext(WoofsContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [userData, setUserData] = useState();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedWoofs, setSearchedWoofs] = useState([]);

  const DB_USERINFO_KEY = "userinfo/";

  useEffect(() => {
    const friendInfoRef = databaseRef(database, DB_USERINFO_KEY);
    onValue(friendInfoRef, (snapshot) => {
      setUserData(snapshot.val());
    });
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();

    // reset search results
    setSearchedUsers([]);
    setSearchedWoofs([]);

    if (searchQuery !== "") {
      // user search results
      const userSearchResults = Object.keys(userData).filter((userId) => {
        const { username, name } = userData[userId];
        const formattedSearchQuery = searchQuery.toLowerCase();
        const formattedUsername = username.toLowerCase();
        const formattedName = name.toLowerCase();
        return (
          formattedName.includes(formattedSearchQuery) ||
          formattedUsername.includes(formattedSearchQuery)
        );
      });
      for (let item of userSearchResults) {
        setSearchedUsers((prevState) => [...prevState, userData[item]]);
      }

      // woof search results
      const woofsSearchResults = Object.keys(woofs).filter((woofId) => {
        const { woof } = woofs[woofId].val;
        const formattedWoof = woof.toLowerCase();
        const formattedSearchQuery = searchQuery.toLowerCase();
        return formattedWoof.includes(formattedSearchQuery);
      });
      for (let item of woofsSearchResults) {
        setSearchedWoofs((prevState) => [...prevState, woofs[item]]);
      }
    }
    setSearchedQuery(searchQuery);
    setSearchQuery("");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full px-2 mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 md:shadow-lg md:p-5 md:mt-10 md:pb-10 md:mb-0 md:border md:border-gray-200">
        <p className="px-2 pt-5 pb-1 text-xl font-medium text-gray-900 text-center md:pt-0 md:pb-4">
          Search
        </p>
        <form>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            Search
          </label>
          <div className="relative ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
              placeholder="Find other users!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button
              type="submit"
              onClick={handleSearch}
              className="text-white absolute right-2.5 bottom-2.5 bg-orange-400 hover:bg-orange-500 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </button>
          </div>
        </form>
        {searchedQuery && (
          <div className="flex items-center mt-2 gap-2 md:mt-5">
            <p className="uppercase text-gray-500 text-xs pl-2 md:text-sm">
              Searched:
            </p>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full md:text-sm">
              {searchedQuery}
            </span>
          </div>
        )}
      </div>
      <div className="w-full px-2 mb-24 mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 md:shadow-lg md:p-5 md:mt-5 md:pb-10 border md:border-gray-200">
        <Tabs>
          <Tab label="Woofs">
            <div className="pt-1 md:pb-0 max-sm:min-w-[90vw]">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {searchedWoofs.length > 0 ? (
                    searchedWoofs.map((woof) => (
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
                        rewoofs={woof.val.rewoofs ? woof.val.rewoofs : 0}
                        likes={woof.val.likes ? woof.val.likes : 0}
                        image={woof.val.url ? woof.val.url : null}
                        canDelete={woof.val.user === user.uid}
                      />
                    ))
                  ) : (
                    <li className="py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <BiSolidDog className="h-6 w-6 text-orange-400" />
                        <p className="text-md font-medium text-gray-900 text-center">
                          No woofs found..
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Tab>
          <Tab label="Users">
            <div className="pt-1 md:pb-0 max-sm:min-w-[90vw]">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {searchedUsers.length > 0 ? (
                    searchedUsers.map((user) => (
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
    </div>
  );
}

export default Search;
