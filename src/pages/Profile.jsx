import { Tabs, Tab } from "../components/Tabs";
import WoofCard from "../components/WoofCard";
import mary from "../assets/mary.jpg";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext, WoofsContext } from "../App";

import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { ref as databaseRef, update } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

function Profile({ handleSignOut }) {
  const { user, userinfo } = useContext(UserContext);
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

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState("");
  const [profilePictureValue, setProfilePictureValue] = useState("");
  const [bannerPictureFile, setBannerPictureFile] = useState("");
  const [bannerPictureValue, setBannerPictureValue] = useState("");
  const [userBio, setUserBio] = useState("");

  const STORAGE_AVATAR_KEY = "avatar/";
  const STORAGE_BANNER_KEY = "banner/";
  const DB_USERINFO_KEY = "userinfo/";
  const DB_WOOFS_KEY = "woofs/";

  const DEFAULT_PROFILE_PICTURE =
    "https://firebasestorage.googleapis.com/v0/b/woofly-d08c1.appspot.com/o/avatar%2Fdefault-profile-picture.png?alt=media&token=7f139b1b-19d4-4e7a-8486-d16a79a73839";
  const DEFAULT_PROFILE_BANNER =
    "https://firebasestorage.googleapis.com/v0/b/woofly-d08c1.appspot.com/o/banner%2Fdefault-banner-picture.jpeg?alt=media&token=a507d2b8-c653-4dbf-8c33-70640858abf9";

  const handleProfilePictureChange = (e) => {
    let image = e.target.files[0];
    if (image) {
      setProfilePictureFile(image);
      setProfilePictureValue(e.target.files);
    }
  };

  const handleBannerPictureChange = (e) => {
    let bannerImage = e.target.files[0];
    if (bannerImage) {
      setBannerPictureFile(bannerImage);
      setBannerPictureValue(e.target.files);
    }
  };

  const myWoofs = woofs.filter((woof) => woof.val.user === user.uid);
  const myWoofsKeys = [];
  for (let woof of myWoofs) {
    myWoofsKeys.push(woof.key);
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (firstName !== "" && lastName !== "") {
      updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
      }).then(() => {
        for (let key of myWoofsKeys) {
          update(databaseRef(database, DB_WOOFS_KEY + key), {
            name: `${firstName} ${lastName}`,
          });
        }
      });
      // update(databaseRef(database, DB_WOOFS_KEY +))
    } else if (firstName !== "" && lastName === "") {
      updateProfile(auth.currentUser, {
        displayName: `${firstName} ${user.displayName.split(" ")[1]}`,
      }).then(() => {
        for (let key of myWoofsKeys) {
          update(databaseRef(database, DB_WOOFS_KEY + key), {
            name: `${firstName} ${user.displayName.split(" ")[1]}`,
          });
        }
      });
    } else if (lastName !== "" && firstName === "") {
      updateProfile(auth.currentUser, {
        displayName: `${user.displayName.split(" ")[0]} ${lastName}`,
      }).then(() => {
        for (let key of myWoofsKeys) {
          update(databaseRef(database, DB_WOOFS_KEY + key), {
            name: `${user.displayName.split(" ")[0]} ${lastName}`,
          });
        }
      });
    }

    if (userName !== "") {
      update(databaseRef(database, DB_USERINFO_KEY + user.uid), {
        username: userName,
      }).then(() => {
        for (let key of myWoofsKeys) {
          update(databaseRef(database, DB_WOOFS_KEY + key), {
            username: userName,
          });
        }
      });
    }

    if (userBio !== "") {
      update(databaseRef(database, DB_USERINFO_KEY + user.uid), {
        bio: userBio,
      });
    }

    if (bannerPictureFile.name !== undefined) {
      const storageRefInstance = storageRef(
        storage,
        STORAGE_BANNER_KEY + bannerPictureFile.name
      );

      // Delete the old image if it exists
      const currentBannerPicture = userinfo.profileBanner;

      if (
        currentBannerPicture &&
        currentBannerPicture !== DEFAULT_PROFILE_BANNER
      ) {
        const oldBannerRef = storageRef(storage, currentBannerPicture);
        deleteObject(oldBannerRef)
          .then(() => {
            console.log("Old banner picture deleted successfully.");
          })
          .catch((error) => {
            console.log("Error deleting old banner picture:", error);
          });
      }

      // Upload the new banner picture
      uploadBytes(storageRefInstance, bannerPictureFile).then((snapshot) => {
        getDownloadURL(storageRefInstance, bannerPictureFile.name)
          .then((url) => {
            console.log("New banner picture uploaded successfully: ", url);
            update(databaseRef(database, DB_USERINFO_KEY + user.uid), {
              profileBanner: url,
            });
          })
          .then(() => {
            console.log("Banner Updated!");
          })
          .catch((error) => {
            console.log("Error in Updating Banner Picture:", error);
          });
      });
    }

    if (profilePictureFile.name !== undefined) {
      const storageRefInstance = storageRef(
        storage,
        STORAGE_AVATAR_KEY + profilePictureFile.name
      );
      // Delete the old image if it exists
      const currentProfilePicture = user.photoURL;
      if (
        currentProfilePicture &&
        currentProfilePicture !== DEFAULT_PROFILE_PICTURE
      ) {
        const oldImageRef = storageRef(storage, currentProfilePicture);
        deleteObject(oldImageRef)
          .then(() => {
            console.log("Old profile picture deleted successfully.");
          })
          .catch((error) => {
            console.log("Error deleting old profile picture:", error);
          });
      }

      // Upload the new profile picture
      uploadBytes(storageRefInstance, profilePictureFile)
        .then((snapshot) => {
          getDownloadURL(storageRefInstance, profilePictureFile.name)
            .then((url) => {
              console.log("New profile picture uploaded successfully: ", url);
              updateProfile(auth.currentUser, {
                photoURL: url,
              });
              for (let key of myWoofsKeys) {
                update(databaseRef(database, DB_WOOFS_KEY + key), {
                  profilePicture: url,
                });
              }
            })
            .then(() => {
              console.log("Profile Updated!");
            })
            .catch((error) => {
              console.log("Error in Updating Profile Picture:", error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setEditProfileModal(false);
  };

  const handleEditProfileModalClose = (e) => {
    setFirstName("");
    setLastName("");
    setProfilePictureFile("");
    setProfilePictureValue("");
    setUserName("");
    setUserBio("");
    setEditProfileModal(false);
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
        <button
          className="hidden md:inline-block md:px-4 md:py-2 md:text-sm md:font-medium md:text-gray-900 md:bg-white md:border md:border-gray-200 md:rounded-lg"
          type="button"
          onClick={() => setEditProfileModal(true)}
        >
          Edit Profile
        </button>

        {editProfileModal && (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-5 max-w-3xl md:w-full ">
                {/*content*/}
                <div className="rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-center justify-between p-5 border-t border-solid border-slate-200 rounded-t">
                    <h3 className="text-2xl font-semibold">Edit Profile</h3>
                  </div>
                  {/*body*/}
                  <div className="relative px-6 py-5 flex-auto">
                    <form className="flex flex-col items-center">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Profile Banner
                        </label>
                        <label htmlFor="banner-input">
                          {bannerPictureFile !== "" ? (
                            <img
                              className="rounded-md object-cover w-screen h-[15vh]"
                              src={URL.createObjectURL(bannerPictureFile)}
                              alt="user upload"
                            />
                          ) : (
                            <div className="mb-1 flex flex-col">
                              <img
                                className="rounded-md object-cover w-screen h-[15vh]"
                                src={userinfo.profileBanner}
                                alt="user upload"
                              />
                            </div>
                          )}
                        </label>
                        <input
                          id="banner-input"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleBannerPictureChange}
                        />
                      </div>

                      <div className="w-full flex flex-col mt-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Profile Picture
                        </label>
                        <label htmlFor="image-input">
                          {profilePictureFile !== "" ? (
                            <div className="mb-1 flex flex-col items-center">
                              <img
                                className="h-24 w-24 rounded-full object-cover md:h-48 md:w-48"
                                src={URL.createObjectURL(profilePictureFile)}
                                alt="user upload"
                              />
                            </div>
                          ) : (
                            <div className="mb-1 flex flex-col items-center">
                              <img
                                className="h-24 w-24 rounded-full object-cover md:h-48 md:w-48"
                                src={user.photoURL}
                                alt="user upload"
                              />
                            </div>
                          )}
                        </label>
                        <input
                          id="image-input"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                        />
                      </div>
                      <div className="md:flex md:gap-4 md:w-5/6">
                        <div className="w-72 mt-5 md:w-full">
                          <label className="block mb-2 text-sm font-medium text-gray-900">
                            First Name
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
                            defaultValue={user.displayName.split(" ")[0]}
                            required
                            name="firstname"
                            type="text"
                            placeholder="Chandler"
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="w-72 mt-5 md:w-full">
                          <label className="block mb-2 text-sm font-medium text-gray-900">
                            Last Name
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
                            defaultValue={user.displayName.split(" ")[1]}
                            required
                            name="lastname"
                            type="text"
                            placeholder="Bing"
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="w-72 mt-5 md:w-5/6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Username
                        </label>
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
                          defaultValue={userinfo.username}
                          required
                          name="username"
                          type="text"
                          placeholder="chandlerbing"
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                      <div className="w-72 mt-5 md:w-5/6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Bio
                        </label>
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
                          defaultValue={userinfo.bio}
                          name="userbio"
                          type="text"
                          placeholder="What's happening?!"
                          onChange={(e) => setUserBio(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                  {/*footer*/}
                  <div className="flex flex-col items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b">
                    <p className="text-xs w-5/6 italic text-gray-400 text-center mb-2 md:text-sm">
                      Please note that it may take a few minutes for your
                      profile updates to take effect.
                    </p>
                    <button
                      className="bg-orange-400 text-white active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:w-5/6"
                      type="button"
                      onClick={handleUpdateProfile}
                    >
                      Update Profile
                    </button>
                    <button
                      className="text-red-400 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleEditProfileModalClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
          </>
        )}

        <div
          className="inline-flex rounded-md shadow-sm md:hidden"
          role="group"
        >
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg "
            onClick={() => setEditProfileModal(true)}
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
                  .filter((woof) => woof.val.user === user.uid)
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

export default Profile;
