import { useContext, useEffect, useState } from "react";
import { GoXCircle, GoTrash } from "react-icons/go";
import { BsChatRightDots } from "react-icons/bs";
import { PiArrowBendDownLeftBold } from "react-icons/pi";
import { ChatDataContext, UserContext, UserDataContext } from "../App";
import { push, ref as databaseRef, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";

function ChatModal({ setSelectedChat, chat }) {
  const { userinfo } = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const chatData = useContext(ChatDataContext);

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const DB_CHAT_KEY = `chats/${chat.key}/replies`;

  useEffect(() => {
    const messagesRef = databaseRef(database, DB_CHAT_KEY);
    const currentChatReplies = chatData[chat.key].replies;

    if (currentChatReplies !== undefined) {
      onValue(messagesRef, (snapshot) => {
        if (snapshot.val() !== null) {
          const messagesArr = Object.entries(snapshot.val()).map(
            ([key, value]) => ({
              key,
              ...value,
            })
          );
          setMessageList(messagesArr);
        } else {
          setMessageList([]);
        }
      });
    }
  }, [DB_CHAT_KEY, chatData, chat]);

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

  const handleMessage = () => {
    if (message !== "") {
      push(databaseRef(database, DB_CHAT_KEY), {
        fromUserId: userinfo.userId,
        message: message,
        timestamp: new Date().toLocaleString(),
      })
        .then(() => {
          setMessage("");
        })
        .catch((error) => {
          console.log("Error while messaging: ", error);
        });
    }
  };

  const handleDeleteMessage = (key) => {
    const messageRef = databaseRef(database, `${DB_CHAT_KEY}/${key}`);
    remove(messageRef)
      .then(() => {
        if (messageList.length > 0) {
          setMessageList((prevMessageList) =>
            prevMessageList.filter((message) => message.key !== key)
          );
        }
      })
      .catch((error) => {
        console.log("Error deleting message: ", error);
      });
  };

  const handleDeleteChat = (key) => {
    const chatRef = databaseRef(database, `chats/${chat.key}`);
    remove(chatRef).then(() => {
      navigate("/chatterbox");
    });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 mx-2">
        <div className="relative w-full max-w-3xl mx-5 md:w-1/2">
          {/* content */}
          <div className="rounded-lg bg-white">
            {/* header */}
            <div className="flex items-center justify-between border-solid border-slate-200 rounded-b pb-3 border-b">
              <div className="px-4 pt-2">
                <h2 className="text-gray-800 font-bold uppercase text-xs">
                  # {chat.topic}
                </h2>
                <p className="text-xs font-normal text-gray-500">
                  Started {formatTime(new Date(chat.timestamp))} ago by{" "}
                  {userData[chat.user].username === userinfo.username
                    ? "you"
                    : userData[chat.user].username}
                </p>
              </div>
              <div className="flex items-center">
                {userData[chat.user].username === userinfo.username && (
                  <button
                    className="py-1 px-2 text-xs bg-red-400 rounded-lg text-white hover:bg-red-500 transition duration-300"
                    onClick={() => handleDeleteChat(chat.key)}
                  >
                    Delete Chat
                  </button>
                )}
                <button
                  className="px-2 py-2 text-sm outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setSelectedChat(null)}
                >
                  <GoXCircle className="h-5 w-5 hover:text-red-400 transition duration-300" />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="relative mt-4 px-4 overflow-auto max-h-[30vh]">
              {messageList.length > 0 ? (
                messageList.map((message) => (
                  <div
                    className="flex gap-2 mb-2 items-center"
                    key={message.key}
                  >
                    <img
                      className="h-7 w-7 object-cover rounded-full hover:opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
                      src={userData[message.fromUserId].profilePicture}
                      alt="user"
                      onClick={() =>
                        navigate(
                          `/profile/${userData[message.fromUserId].userId}`
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
                                    userData[message.fromUserId].userId
                                  }`
                                )
                              }
                            >
                              {userData[message.fromUserId].name}
                            </span>
                          </p>
                          <p className="text-xs mr-3 text-gray-500 hover:text-orange-400 cursor-pointer transition-all duration-300 ease-in-out font-normal">
                            <span
                              onClick={() =>
                                navigate(
                                  `/profile/${
                                    userData[message.fromUserId].userId
                                  }`
                                )
                              }
                            >
                              @{userData[message.fromUserId].username}
                            </span>
                          </p>
                          <p className="text-xs mr-3 text-gray-500 font-normal">
                            {formatTime(new Date(message.timestamp))}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-900 mt-1 text-xs md:text-sm font-normal">
                        {message.message}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-auto group hover:bg-gray-50 p-1 rounded-lg cursor-pointer transition-all duration-300">
                      <button
                        onClick={() => handleDeleteMessage(message.key)}
                        className="focus:outline-none"
                      >
                        <GoTrash
                          className="w-4 h-4 group-hover:text-red-400 transition duration-300 
                  ease-in-out cursor-pointer"
                        />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center space-x-1 my-1">
                  <BsChatRightDots className="h-5 w-5 text-orange-400" />
                  <p className="text-sm text-gray-900 text-center font-normal">
                    There are currently no messages..
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
                  className="block w-full py-4 pl-12 pr-12 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none font-normal"
                  placeholder="Reply"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                  maxLength={280}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleMessage();
                    }
                  }}
                />
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMessage();
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

export default ChatModal;
