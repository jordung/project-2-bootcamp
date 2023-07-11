import { BsDot } from "react-icons/bs";
import { GoComment, GoFlame, GoTrash } from "react-icons/go";
import { HiArrowUturnRight } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import { database, storage } from "../firebase";
import { remove, ref as databaseRef, update } from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import CommentModal from "./CommentModal";

function WoofCard(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [liked, setLiked] = useState(
    props.likes && props.likes[user.uid] ? true : false
  );
  const [commentModal, setCommentModal] = useState(false);
  const [rewoof, setRewoof] = useState(
    props.rewoofs && props.rewoofs[user.uid] ? true : false
  );
  const DB_WOOFS_KEY = "/woofs";

  const handleLocation = () => {
    if (location.pathname === "/profile") {
      return true;
    }
  };

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

  const handleRewoof = () => {
    if (!rewoof) {
      console.log("rewoof!!");
      update(databaseRef(database, DB_WOOFS_KEY + `/${props.woofKey}`), {
        [`rewoofs/${user.uid}`]: true,
      })
        .then(() => {
          setRewoof(true);
        })
        .catch((error) => {
          console.log("Error while rewoofing: ", error);
        });
    } else {
      console.log("unrewoofed");
      remove(
        databaseRef(
          database,
          DB_WOOFS_KEY + `/${props.woofKey}/rewoofs/${user.uid}`
        )
      )
        .then(() => {
          setRewoof(false);
        })
        .catch((error) => {
          console.log("Error while un-rewoofing.: ", error);
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
            {props.rewoofs &&
            handleLocation() &&
            Object.keys(props.rewoofs).includes(user.uid) ? (
              <span className="flex gap-2 ml-5 my-1">
                <HiArrowUturnRight className="w-4 h-4 text-orange-400" />
                <p className="text-xs mr-3 text-orange-400">You rewoofed</p>
              </span>
            ) : props.rewoofs &&
              props.profileUsername &&
              props.profileId &&
              Object.keys(props.rewoofs).includes(props.profileId) ? (
              <span className="flex gap-2 ml-5 my-1">
                <HiArrowUturnRight className="w-4 h-4 text-orange-400" />
                <p className="text-xs mr-3 text-orange-400">
                  @{props.profileUsername} rewoofed
                </p>
              </span>
            ) : null}
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
              <div
                className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300"
                onClick={() => handleRewoof()}
              >
                <HiArrowUturnRight
                  className={`w-5 h-5 transition duration-300 ease-in-out cursor-pointer group-hover:text-green-700 ${
                    props.rewoofs && props.rewoofs[user.uid]
                      ? "text-green-700"
                      : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-sm cursor-pointer transition-all duration-300 ease-in-out group-hover:text-green-700 ${
                    props.rewoofs && props.rewoofs[user.uid]
                      ? "text-green-700"
                      : "text-gray-400"
                  }`}
                >
                  {props.rewoofs ? Object.keys(props.rewoofs).length : 0}
                </p>
              </div>

              <div
                className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300"
                onClick={() => handleLike()}
              >
                <GoFlame
                  className={`w-5 h-5 transition duration-300 ease-in-out cursor-pointer group-hover:text-orange-400 ${
                    props.likes && props.likes[user.uid]
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-sm cursor-pointer transition-all duration-300 ease-in-out group-hover:text-orange-400 ${
                    props.likes && props.likes[user.uid]
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  {props.likes ? Object.keys(props.likes).length : 0}
                </p>
              </div>
              {props.canDelete && (
                <div className="flex gap-2 group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300">
                  <button
                    onClick={() => handleDeleteWoof(props.woofKey, props.image)}
                    className="focus:outline-none"
                  >
                    <GoTrash
                      className="w-5 h-5 group-hover:text-red-400 transition duration-300 
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
