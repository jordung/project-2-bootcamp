import { BsDot } from "react-icons/bs";
import {
  GoShare,
  GoComment,
  GoGitCompare,
  GoFlame,
  GoTrash,
} from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { database, storage } from "../firebase";
import { remove, ref as databaseRef, update } from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import CommentModal from "./CommentModal";

function WoofCard(props) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [liked, setLiked] = useState(
    props.likes && props.likes[user.uid] ? true : false
  );
  const [commentModal, setCommentModal] = useState(false);

  const DB_WOOFS_KEY = "/woofs";

  const handleDeleteWoof = (woofKey, image) => {
    const woofRef = databaseRef(database, `woofs/${woofKey}`);
    remove(woofRef)
      .then(() => {
        if (image) {
          console.log("image detected");
          const imageRef = storageRef(storage, image);
          deleteObject(imageRef)
            .then(() => {
              console.log("Image deleted!");
            })
            .catch((error) => {
              console.log("Error deleting image:", error);
            });
        }
      })
      .catch((error) => {
        console.log("Error deleting woof:", error);
      });
  };

  const handleLike = () => {
    if (!liked) {
      console.log("liked!");
      update(databaseRef(database, DB_WOOFS_KEY + `/${props.woofKey}`), {
        [`likes/${user.uid}`]: true,
      })
        .then(() => {
          setLiked(true);
        })
        .catch((error) => {
          console.log("Error while liking: ", error);
        });
    } else {
      console.log("unliked");
      remove(
        databaseRef(
          database,
          DB_WOOFS_KEY + `/${props.woofKey}/likes/${user.uid}`
        )
      )
        .then(() => {
          setLiked(false);
        })
        .catch((error) => {
          console.log("Error while unliking: ", error);
        });
    }
  };

  return (
    <li className="py-3 px-5">
      <div className="flex items-start flex-col">
        <div className="flex items-start w-full">
          <img
            className="w-12 h-12 object-cover rounded-full hover:opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
            src={props.profilePicture}
            alt="profile"
            onClick={() => navigate(`/profile/${props.user}`)}
          />
          <div className="w-full flex flex-col">
            <div className="flex items-center">
              <p className="text-sm mx-5 font-medium text-gray-900 hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out">
                <span onClick={() => navigate(`/profile/${props.user}`)}>
                  {props.name}
                </span>
              </p>
              <p className="text-sm mr-3 text-gray-500 hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out">
                <span onClick={() => navigate(`/profile/${props.user}`)}>
                  @{props.userName}
                </span>
              </p>
              <p className="text-sm mr-3 text-gray-500">
                <BsDot />
              </p>
              <p className="text-sm mr-3 text-gray-500">{props.dateTime}</p>
            </div>
            <p className="text-gray-900 ml-5">{props.content}</p>
            {props.image && props.image !== null && (
              <div className="ml-5 my-2 rounded-2xl max-w-xs md:max-w-md self-center md:mt-2">
                <img
                  className="object-contain rounded-2xl"
                  src={props.image}
                  alt="user post"
                />
              </div>
            )}
            <div className="mx-5 mt-2 mb-2 w-70 text-gray-500 flex justify-between md:w-5/6 md:self-center md:mt-3">
              <div
                className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300"
                onClick={() => setCommentModal(true)}
              >
                <GoComment
                  className="w-5 h-5 group-hover:text-sky-700 transition duration-300 
                      ease-in-out cursor-pointer"
                />
                <p className="text-sm group-hover:text-sky-700 cursor-pointer transition-all duration-300 ease-in-out">
                  {Object.keys(props.comments).length}
                </p>
              </div>
              {commentModal && (
                <CommentModal setCommentModal={setCommentModal} props={props} />
              )}
              <div className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300">
                <GoGitCompare
                  className="w-5 h-5 group-hover:text-emerald-700 transition duration-300 
                  ease-in-out cursor-pointer"
                />
                <p className="text-sm group-hover:text-emerald-700 cursor-pointer transition-all duration-300 ease-in-out">
                  {props.rewoofs}
                </p>
              </div>
              <div
                className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300"
                onClick={() => handleLike()}
              >
                <GoFlame
                  style={
                    props.likes && props.likes[user.uid]
                      ? { color: "#fb923c" }
                      : {}
                  }
                  className="w-5 h-5 group-hover:text-orange-400 transition duration-300 
                  ease-in-out cursor-pointer"
                />
                <p
                  style={
                    props.likes && props.likes[user.uid]
                      ? { color: "#fb923c" }
                      : {}
                  }
                  className="text-sm group-hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out"
                >
                  {props.likes ? Object.keys(props.likes).length : 0}
                </p>
              </div>
              <div className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300">
                <GoShare
                  className="w-5 h-5 group-hover:text-pink-300 transition duration-300 
                ease-in-out cursor-pointer"
                />
              </div>
              {props.canDelete && (
                <div className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300">
                  <button
                    onClick={() => handleDeleteWoof(props.woofKey, props.image)}
                    className="focus:outline-none"
                  >
                    <GoTrash
                      className="w-5 h-5 hover:text-red-400 transition duration-300 
                      ease-in-out cursor-pointer"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default WoofCard;
