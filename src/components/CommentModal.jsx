import { BsDot } from "react-icons/bs";
import { GoXCircle, GoCommentDiscussion, GoTrash } from "react-icons/go";
import { PiArrowBendDownLeftBold } from "react-icons/pi";
import { UserContext, UserDataContext, WoofsContext } from "../App";
import { useContext, useState, useEffect } from "react";
import { ref as databaseRef, onValue, push, remove } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";
import formatTime from "../utils/FormatDate";

function CommentModal({ setCommentModal, props }) {
  const navigate = useNavigate();

  const { userinfo } = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const woofs = useContext(WoofsContext);

  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  const DB_WOOFS_KEY = `woofs/${props.woofKey}/comments`;

  useEffect(() => {
    const commentsRef = databaseRef(database, DB_WOOFS_KEY);
    const currentWoof = woofs.filter((woof) => woof.key === props.woofKey)[0]
      .val.comments;
    if (currentWoof !== undefined) {
      onValue(commentsRef, (snapshot) => {
        if (snapshot.val() !== null) {
          const commentsArr = Object.entries(snapshot.val()).map(
            ([key, value]) => ({
              key,
              ...value,
            })
          );
          setCommentsList(commentsArr);
        } else {
          setCommentsList([]);
        }
      });
    }
  }, [props.woofKey, DB_WOOFS_KEY, woofs]);

  const handleComment = (e) => {
    if (comment !== "") {
      push(databaseRef(database, DB_WOOFS_KEY), {
        fromUserId: userinfo.userId,
        comment: comment,
        timestamp: new Date().toLocaleString(),
      })
        .then(() => {
          setComment("");
        })
        .catch((error) => {
          console.log("Error while commenting: ", error);
        });
    }
  };

  const handleDeleteComment = (key) => {
    const commentRef = databaseRef(database, `${DB_WOOFS_KEY}/${key}`);
    remove(commentRef)
      .then(() => {
        if (commentsList.length > 0) {
          setCommentsList((prevCommentsList) =>
            prevCommentsList.filter((comment) => comment.key !== key)
          );
        }
      })
      .catch((error) => {
        console.log("Error deleting comments: ", error);
      });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 mx-2">
        <div className="relative w-full max-w-3xl mx-5 md:w-1/2">
          {/* content */}
          <div className="rounded-lg bg-white">
            {/* header */}
            <div className="flex items-center justify-between border-solid border-slate-200 rounded-b ">
              <h2 className="px-4 py-2 text-gray-800 font-bold uppercase text-xs">
                Woof
              </h2>
              <button
                className="px-2 py-2 text-sm outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setCommentModal(false)}
              >
                <GoXCircle className="h-5 w-5 hover:text-red-400 transition duration-300" />
              </button>
            </div>
            <div className="flex items-center justify-start mx-5 pb-2 border-b border-slate-300 rounded-t max-sm:min-w-[80vw]">
              <div className="flex items-start flex-col w-full">
                <div className="flex items-start w-full">
                  <img
                    className="w-10 h-10 object-cover rounded-full hover:opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
                    src={props.profilePicture}
                    alt="profile"
                    onClick={() => navigate(`/profile/${props.user}`)}
                  />
                  <div className="w-full flex flex-col">
                    <div className="flex items-center">
                      <p className="text-xs mx-5 font-medium text-gray-900 hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out md:text-sm">
                        <span
                          onClick={() => navigate(`/profile/${props.user}`)}
                        >
                          {props.name}
                        </span>
                      </p>
                      <p className="text-xs mr-3 text-gray-500 hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out md:text-sm">
                        <span
                          onClick={() => navigate(`/profile/${props.user}`)}
                        >
                          @{props.userName}
                        </span>
                      </p>
                      <p className="text-xs mr-3 text-gray-500 md:text-sm">
                        <BsDot />
                      </p>
                      <p className="text-xs mr-3 text-gray-500 md:text-sm">
                        {props.dateTime}
                      </p>
                    </div>
                    <p className="text-gray-900 ml-5 mt-1 text-xs md:text-sm">
                      {props.content}
                    </p>
                    {props.image && props.image !== null && (
                      <div className="ml-5 my-2 rounded-2xl max-w-xs self-center md:mt-2">
                        <img
                          className="object-contain rounded-2xl"
                          src={props.image}
                          alt="user post"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* body */}
            <h2 className="px-4 py-2 text-gray-800 font-bold uppercase text-xs">
              Replies
            </h2>
            <div className="relative px-4 overflow-auto max-h-[30vh]">
              {commentsList.length > 0 ? (
                commentsList.map((comment) => (
                  <div
                    className="flex gap-2 mb-2 items-center"
                    key={comment.key}
                  >
                    <img
                      className="h-7 w-7 object-cover rounded-full hover:opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
                      src={userData[comment.fromUserId].profilePicture}
                      alt="user"
                      onClick={() =>
                        navigate(
                          `/profile/${userData[comment.fromUserId].userId}`
                        )
                      }
                    />
                    <div className="flex flex-col">
                      <div className="w-full flex items-center gap-2 justify-between">
                        <div className="flex items-center">
                          <p className="text-xs mr-5 font-medium text-gray-900 hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out md:text-sm">
                            <span
                              onClick={() =>
                                navigate(
                                  `/profile/${
                                    userData[comment.fromUserId].userId
                                  }`
                                )
                              }
                            >
                              {userData[comment.fromUserId].name}
                            </span>
                          </p>
                          <p className="text-xs mr-3 text-gray-500 hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out md:text-sm">
                            <span
                              onClick={() =>
                                navigate(
                                  `/profile/${
                                    userData[comment.fromUserId].userId
                                  }`
                                )
                              }
                            >
                              @{userData[comment.fromUserId].username}
                            </span>
                          </p>
                          <p className="text-xs mr-3 text-gray-500 md:text-sm">
                            <BsDot />
                          </p>
                          <p className="text-xs mr-3 text-gray-500 md:text-sm">
                            {formatTime(new Date(comment.timestamp))}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-900 mt-1 text-xs md:text-sm">
                        {comment.comment}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-auto group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300">
                      <button
                        onClick={() => handleDeleteComment(comment.key)}
                        className="focus:outline-none"
                      >
                        <GoTrash
                          className="w-4 h-4 hover:text-red-400 transition duration-300 
                      ease-in-out cursor-pointer"
                        />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-start space-x-1 my-1">
                  <GoCommentDiscussion className="h-5 w-5 text-orange-400" />
                  <p className="text-xs text-gray-900 text-center">
                    There are currently no comments..
                  </p>
                </div>
              )}
            </div>
            <div className="relative px-4 pb-4 pt-2 flex-auto ">
              <div className="relative ">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <img
                    className="inline-block h-7 w-7 rounded-full shadow"
                    src={userinfo.profilePicture}
                    alt="profile"
                  />
                </div>
                <input
                  type="text"
                  className="block w-full py-4 pl-12 pr-12 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Reply"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  autoFocus
                  maxLength={280}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleComment();
                    }
                  }}
                />
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleComment();
                  }}
                  className="text-white absolute right-2.5 bottom-2.5 bg-orange-400 hover:bg-orange-500 focus:outline-none font-medium rounded-full text-xs p-2"
                >
                  <PiArrowBendDownLeftBold className="h-3 w-3" />
                </button>
              </div>
            </div>
            {/* footer */}
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CommentModal;
