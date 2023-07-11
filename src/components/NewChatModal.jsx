import { push, ref as databaseRef } from "firebase/database";
import { useContext, useState } from "react";
import { GoXCircle } from "react-icons/go";
import { database } from "../firebase";
import { UserContext } from "../App";

function NewChatModal({ setNewChatModal }) {
  const { userinfo } = useContext(UserContext);
  const [newChat, setNewChat] = useState("");

  const DB_CHATS_KEY = `chats/`;

  const handleNewChat = () => {
    console.log(newChat);
    push(databaseRef(database, DB_CHATS_KEY), {
      topic: newChat,
      timestamp: new Date().toLocaleString(),
      user: userinfo.userId,
    })
      .then(() => {
        setNewChat("");
        setNewChatModal(false);
      })
      .catch((error) => {
        console.log("Error while adding new chat: ", error);
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
                Create New Chat
              </h2>
              <button
                className="px-2 py-2 text-sm outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setNewChatModal(false)}
              >
                <GoXCircle className="h-5 w-5 hover:text-red-400 transition duration-300" />
              </button>
            </div>
            {/* body */}
            <div className="relative px-4 pb-4 flex-auto">
              <div className="w-full pb-2 flex flex-col items-center justify-center">
                <label className="block mb-1 text-sm font-medium self-start text-gray-900">
                  Topic
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:border-orange-500 block w-full p-2.5"
                  required
                  autoFocus
                  type="text"
                  placeholder="TheBigBangTheory"
                  onChange={(e) => setNewChat(e.target.value)}
                  value={newChat}
                  onKeyDown={(e) => {
                    if (e.code === "Space") {
                      e.preventDefault();
                    }
                    if (e.code === "Enter") {
                      e.preventDefault();
                      handleNewChat();
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewChat();
                }}
                className="text-white w-full bg-orange-400 hover:bg-orange-500 focus:outline-none font-medium rounded-lg text-xs py-2 px-3 flex justify-center"
              >
                Add New Topic
              </button>
            </div>
            {/* footer */}
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default NewChatModal;
