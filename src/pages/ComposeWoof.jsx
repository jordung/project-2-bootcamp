import { useEffect, useState, useContext } from "react";
import { GoArrowLeft, GoImage, GoTrash } from "react-icons/go";
// import { HiOutlineGif } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";

function ComposeWoof() {
  const { user, userinfo } = useContext(UserContext);

  const [textInput, setTextInput] = useState("");
  const [inputCounter, setInputCounter] = useState(280);
  const [imageInput, setImageInput] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const DB_WOOFS_KEY = "woofs";
  const STORAGE_KEY = "images/";

  const handleChange = (e) => {
    setTextInput(e.target.value);
  };

  useEffect(() => {
    setInputCounter(280 - textInput.length);
  }, [textInput]);

  const writeData = (url) => {
    const woofRef = ref(database, DB_WOOFS_KEY);
    const newWoofRef = push(woofRef);

    set(newWoofRef, {
      user: user.uid,
      name: user.displayName,
      profilePicture: user.photoURL,
      username: userinfo.username,
      woof: textInput,
      date: new Date().toLocaleString(),
      url: url,
    });

    setTextInput("");
    setImageInput(null);
    setImageName("");
    setImageFile(null);
  };

  const handleSubmit = () => {
    console.log(textInput);
    console.log(imageInput);

    if (!imageInput) {
      //post woof without image
      writeData(null);
    } else {
      const fullStorageRef = storageRef(storage, STORAGE_KEY + imageName);

      uploadBytes(fullStorageRef, imageFile).then((snapshot) => {
        getDownloadURL(fullStorageRef).then((url) => {
          writeData(url);
        });
      });
    }
  };

  return (
    <div className="h-screen p-5 flex flex-col w-full md:h-auto">
      {/* header section */}
      <div className="mb-10 md:hidden">
        <Link to="/home">
          <GoArrowLeft className="text-black text-2xl" />
        </Link>
      </div>

      {/* body */}
      <div className="flex items-start gap-5">
        <div>
          <img
            src={user.photoURL}
            alt="profile"
            className="h-16 w-16 object-cover rounded-full md:h-auto"
          />
        </div>
        <div className="md:w-full">
          <textarea
            className="resize-none auto-rows-auto text-lg focus:outline-none h-fit md:w-full"
            rows={5}
            cols={25}
            placeholder="What's happening?!"
            autoFocus
            maxLength="280"
            value={textInput}
            onChange={handleChange}
          />
          {imageInput && (
            <div className="mb-5 flex flex-col">
              <img
                className="max-h-40 max-w-40 mb-2 rounded-lg object-contain md:max-h-96 md:max-w-96"
                src={imageInput}
                alt="user upload"
              />
              <button
                type="button"
                className="bg-gray-400 rounded-full absolute p-2 m-2"
                onClick={() => setImageInput(null)}
              >
                <GoTrash className="text-white text-xl" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          {/* Image Uploader */}
          <div>
            <label htmlFor="image-input">
              <GoImage
                type="file"
                className="h-8 w-8 text-gray-400 hover:text-orange-400 trasition-all ease-in-out cursor-pointer"
              />
            </label>
            <input
              id="image-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                console.log(e.target.files[0]);
                if (e.target.files) {
                  setImageName(e.target.files[0].name);
                  setImageFile(e.target.files[0]);
                  setImageInput(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </div>

          {/* <HiOutlineGif className="h-8 w-8 text-gray-400 hover:text-orange-400" /> */}
        </div>
        <p
          className={`ml-auto mr-5 ${
            inputCounter <= 20 ? "text-red-400 " : "text-gray-400"
          }`}
        >
          {inputCounter}
        </p>
        <button
          type="submit"
          className="text-white bg-orange-400 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2"
          onClick={handleSubmit}
        >
          Woof
        </button>
      </div>
    </div>
  );
}

export default ComposeWoof;
