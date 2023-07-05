import { useContext, useState } from "react";
import { GoTrash } from "react-icons/go";
import { updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth, storage, database } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref as databaseRef, set } from "firebase/database";
import { UserContext } from "../App";

function NewProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState("");
  const [profilePictureValue, setProfilePictureValue] = useState("");

  const { user, userinfo } = useContext(UserContext);

  const STORAGE_AVATAR_KEY = "avatar/";
  const STORAGE_BANNER_KEY = "banner/";
  const DB_USERINFO_KEY = "userinfo/";

  const navigate = useNavigate();

  const handleSetNewProfile = (e) => {
    e.preventDefault();
    if (profilePictureFile.name !== undefined) {
      const storageRefInstance = storageRef(
        storage,
        STORAGE_AVATAR_KEY + profilePictureFile.name
      );
      uploadBytes(storageRefInstance, profilePictureFile).then((snapshot) => {
        getDownloadURL(storageRefInstance, profilePictureFile.name)
          .then((url) => {
            console.log("Profile Picture uploaded successfully: ", url);
            updateProfile(auth.currentUser, {
              displayName: `${firstName} ${lastName}`,
              photoURL: url,
            })
              .then(() => {
                console.log("Profile Updated!");
                setFirstName("");
                setLastName("");
                setProfilePictureFile("");
                setProfilePictureValue("");
                navigate("/profile");
              })
              .catch((error) => {
                console.log("Error in Updating Profile Picture:", error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      const storageRefInstance = storageRef(
        storage,
        STORAGE_AVATAR_KEY + "default-profile-picture.png"
      );
      getDownloadURL(storageRefInstance, "default-profile-picture.png").then(
        (url) => {
          console.log("Default profile picture uploaded successfully: ", url);
          updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`,
            photoURL: url,
          })
            .then(() => {
              console.log("Profile Updated!");
              setFirstName("");
              setLastName("");
              setProfilePictureFile("");
              setProfilePictureValue("");
              navigate("/profile");
            })
            .catch((error) => {
              console.log("Error in Updating Profile Picture:", error);
            });
        }
      );
    }

    console.log(user.uid);
    // set(databaseRef(database, DB_USERINFO_KEY + user.uid), {
    //   username: userName,
    // });
    setUserName("");

    const storageRefInstance = storageRef(
      storage,
      STORAGE_BANNER_KEY + "default-banner-picture.jpeg"
    );

    getDownloadURL(storageRefInstance, "default-banner-picture.jpeg").then(
      (url) => {
        set(databaseRef(database, DB_USERINFO_KEY + user.uid), {
          profileBanner: url,
          username: userName,
        });
      }
    );
  };

  const handleProfilePictureChange = (e) => {
    let image = e.target.files[0];
    if (image) {
      setProfilePictureFile(image);
      setProfilePictureValue(e.target.files);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow ">
        <h2 className="text-3xl mb-5 font-bold">Set Your Profile</h2>
        <form className="flex flex-col items-center">
          <div>
            <label htmlFor="image-input">
              {profilePictureFile ? (
                <div className="mb-1 flex flex-col">
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={URL.createObjectURL(profilePictureFile)}
                    alt="user upload"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
              )}
            </label>
            {profilePictureFile && (
              <button
                type="button"
                className="bg-gray-400 rounded-full absolute p-2 ml-24 top-56 md:top-64"
                onClick={() => setProfilePictureFile(null)}
              >
                <GoTrash className="text-white text-md" />
              </button>
            )}
            <input
              id="image-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>
          <div className="w-72 mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              First Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
              value={firstName}
              required
              name="firstname"
              type="text"
              placeholder="Chandler"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-72 mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Last Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
              value={lastName}
              required
              name="lastname"
              type="text"
              placeholder="Bing"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="w-72 mt-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-orange-500 block w-full p-2.5"
              value={userName}
              required
              name="username"
              type="text"
              placeholder="chandlerbing"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <button
            className={
              "text-white w-44 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-5 mb-2 transition-all duration-300 ease-in-out bg-orange-400"
            }
            onClick={handleSetNewProfile}
          >
            Let's Get Woofin!
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewProfile;
