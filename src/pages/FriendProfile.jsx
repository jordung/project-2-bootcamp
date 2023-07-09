import { Tabs, Tab } from "../components/Tabs";
import WoofCard from "../components/WoofCard";
// import mary from "../assets/mary.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserDataContext, WoofsContext } from "../App";
import { ref as databaseRef, onValue, update } from "firebase/database";
import { database } from "../firebase";
import FollowModal from "../components/FollowModal";

function FriendProfile() {
  const { user } = useContext(UserContext);
  const woofs = useContext(WoofsContext);
  const userData = useContext(UserDataContext);

  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState({});
  const [following, setFollowing] = useState();
  const [followModal, setFollowModal] = useState(false);

  const { id } = useParams();
  const DB_USERINFO_KEY = `userinfo/`;

  useEffect(() => {
    const friendInfoRef = databaseRef(database, DB_USERINFO_KEY + id);
    onValue(friendInfoRef, (snapshot) => {
      setProfileInfo(snapshot.val());
    });

    const fetchFollowingData = databaseRef(
      database,
      `${DB_USERINFO_KEY}${user.uid}/following/${id}`
    );
    onValue(fetchFollowingData, (snapshot) => {
      setFollowing(snapshot.val());
    });
  }, [id, DB_USERINFO_KEY, user]);

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

  const handleFollow = () => {
    if (!following) {
      console.log("followed!");
      // Add to "following" list of user.uid
      update(databaseRef(database, DB_USERINFO_KEY + user.uid), {
        [`following/${id}`]: true,
      });

      // Add to "followers" list of id
      update(databaseRef(database, DB_USERINFO_KEY + id), {
        [`followers/${user.uid}`]: true,
      });
    } else {
      console.log("unfollowed");
      // Remove from "following" list of user.uid
      update(databaseRef(database, DB_USERINFO_KEY + user.uid), {
        [`following/${id}`]: null,
      });

      // Remove from "followers" list of id
      update(databaseRef(database, DB_USERINFO_KEY + id), {
        [`followers/${user.uid}`]: null,
      });
    }
  };

  useEffect(() => {
    // listening for changes in following, then search db for latest following status
    const fetchFollowingData = databaseRef(
      database,
      `${DB_USERINFO_KEY}${user.uid}/following/${id}`
    );
    onValue(fetchFollowingData, (snapshot) => {
      setFollowing(snapshot.val());
    });
  }, [following, id, user, DB_USERINFO_KEY]);

  return (
    <div className="w-full px-4 flex flex-col justify-center items-start md:border md:border-gray-200 md:rounded-xl md:w-3/5 md:ml-72 md:shadow-lg md:p-7 md:mt-10">
      <div className="absolute -z-10 top-0 left-0 md:relative">
        <img
          className="object-cover w-screen h-[15vh] md:rounded-2xl lg:h-[25vh]"
          src={profileInfo.profileBanner}
          alt="profile banner"
        />
      </div>
      <div className="flex justify-between w-full items-end mt-20 md:-mt-12 md:px-12">
        <img
          className="h-24 w-24 object-cover rounded-lg border-4 border-white"
          src={profileInfo.profilePicture}
          alt="profile"
        />
        <div className="inline-flex rounded-md shadow-sm -mb-3">
          {/* Follow Button for */}
          <button
            type="button"
            className={`w-24 py-2 text-sm font-medium border-2 rounded-lg bg-white text-gray-900 transition duration-300 ease-in-out ${
              following ? "border-orange-400" : "border-gray-200"
            }`}
            onClick={handleFollow}
          >
            {following !== null ? "Following" : "Follow"}
          </button>
        </div>
      </div>
      <h5 className="mt-3 text-lg font-medium md:px-12">{profileInfo.name}</h5>
      <p className="text-gray-500 text-md md:px-12">@{profileInfo.username}</p>
      <p className="mt-3 text-sm md:px-12">{profileInfo.bio}</p>
      <div className="flex gap-4 mt-3 md:px-12">
        <div className="flex gap-1">
          <p
            className="text-sm font-bold cursor-pointer hover:text-orange-400 transition duration-300"
            onClick={() => setFollowModal(true)}
          >
            {profileInfo.following === undefined
              ? 0
              : Object.keys(profileInfo.following).length}
          </p>
          <p className="uppercase text-sm text-gray-500">Following</p>
        </div>
        <div className="flex gap-1">
          <p
            className="text-sm font-bold cursor-pointer hover:text-orange-400 transition duration-300"
            onClick={() => setFollowModal(true)}
          >
            {profileInfo.followers === undefined
              ? 0
              : Object.keys(profileInfo.followers).length}
          </p>
          <p className="uppercase text-sm text-gray-500">Followers</p>
        </div>
      </div>
      {followModal && (
        <FollowModal
          setFollowModal={setFollowModal}
          userinfo={profileInfo}
          userData={userData}
        />
      )}
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
                      woofKey={woof.key}
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
                {woofs
                  .sort((a, b) => new Date(b.val.date) - new Date(a.val.date))
                  .filter(
                    (woof) =>
                      woof.val.likes && Object.keys(woof.val.likes).includes(id)
                  )
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
                      rewoofs={woof.val.rewoofs ? woof.val.rewoofs : 0}
                      likes={woof.val.likes}
                      image={woof.val.url ? woof.val.url : null}
                      canDelete={woof.val.user === id}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default FriendProfile;
