import { GoPencil } from "react-icons/go";
import { useState, useEffect, useContext } from "react";
import { onValue, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import NewChatModal from "../components/NewChatModal";
import ChatModal from "../components/ChatModal";
import { ChatDataContext, UserContext, UserDataContext } from "../App";

function Chatterbox() {
  const [newChatModal, setNewChatModal] = useState(false); // modal for creating NEW chats
  const [chatsList, setChatsList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // modal to open up selected chat

  const userData = useContext(UserDataContext);
  const { userinfo } = useContext(UserContext);
  const chatData = useContext(ChatDataContext);

  const DB_CHATS_KEY = `chats/`;

  useEffect(() => {
    if (chatData !== undefined) {
      const chatsRef = databaseRef(database, DB_CHATS_KEY);
      onValue(chatsRef, (snapshot) => {
        if (snapshot.val() !== null) {
          const chatsArr = Object.entries(snapshot.val()).map(
            ([key, value]) => ({
              key,
              ...value,
            })
          );
          setChatsList(chatsArr);
        } else {
          setChatsList([]);
        }
      });
    }
  }, [DB_CHATS_KEY, chatData]);

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

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full px-2 mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 md:shadow-lg md:p-5 md:mt-10 md:pb-5 md:mb-0 md:border md:border-gray-200">
        <p className="px-2 pt-5 pb-1 text-xl font-medium text-gray-900 text-center md:pt-0 md:pb-1">
          Chatterbox
        </p>
        <p className="text-gray-400 text-center text-xs">
          Join in the hottest topics
        </p>
      </div>
      <div className="w-full mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 shadow-lg p-5 md:pb-10 md:mb-0 border border-gray-200">
        <div className="flex justify-between items-center pb-4">
          <p className="inline-block text-md font-medium text-gray-900">
            Chats
          </p>
          <button
            onClick={() => setNewChatModal(true)}
            className="text-white bg-orange-400 hover:bg-orange-500 focus:outline-none font-medium rounded-lg text-xs px-3 py-2"
          >
            <GoPencil className="h-4 w-4" />
          </button>
        </div>
        {newChatModal && <NewChatModal setNewChatModal={setNewChatModal} />}
        <ul className="mt-1 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[65vh] overflow-y-auto">
          {chatsList.map((chat) => (
            <div className="flex justify-between" key={chat.key}>
              <li
                className="w-full px-4 py-2 border-gray-200 cursor-pointer group"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-800 text-sm group-hover:text-orange-400 transition duration-300 ease-in-out">
                    # {chat.topic}
                  </h4>
                  <p className="text-xs text-gray-500 font-normal group-hover:opacity-70 transition duration-300">
                    Started {formatTime(new Date(chat.timestamp))}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-500 font-normal group-hover:opacity-70 ">
                    {chat.replies === undefined
                      ? 0
                      : Object.keys(chat.replies).length}{" "}
                    messages
                  </p>
                  <p className="text-xs text-gray-500 font-normal group-hover:opacity-70 transition duration-300">
                    by{" "}
                    {userData[chat.user].username === userinfo.username
                      ? "you"
                      : `@${userData[chat.user].username}`}
                  </p>
                </div>
              </li>
              {selectedChat && selectedChat.key === chat.key && (
                <ChatModal
                  setSelectedChat={setSelectedChat}
                  chat={selectedChat}
                />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Chatterbox;
