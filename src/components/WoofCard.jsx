import { BsDot } from "react-icons/bs";
import { GoShare, GoComment, GoGitCompare, GoFlame } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { database, storage } from "../firebase";
import { remove, ref as databaseRef } from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";

function WoofCard(props) {
  const navigate = useNavigate();
  const handleDeleteWoof = (woofKey, image) => {
    const woofRef = databaseRef(database, `woofs/${woofKey}`);
    console.log("this is the image", image);
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

  return (
    <li className="py-3 px-5">
      <div className="flex items-start flex-col">
        <div className="flex items-start w-full">
          <img
            className="w-12 h-12 object-cover rounded-full"
            src={props.profilePicture}
            alt="profile"
          />
          <div className="w-full flex flex-col">
            <div className="flex items-center">
              <p className="text-sm mx-5 font-medium text-gray-900 hover:text-orange-400 cursor-pointer">
                <span onClick={() => navigate(`/profile/${props.user}`)}>
                  {props.name}
                </span>
              </p>
              <p className="text-sm mr-3 text-gray-500">@{props.userName}</p>
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
            <div className="mx-5 mt-2 w-70 text-gray-500 flex justify-between md:w-5/6 md:self-center md:mt-5">
              <div className="flex gap-2">
                <GoComment
                  className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out cursor-pointer"
                />
                <p className="text-sm">{props.comments}</p>
              </div>
              <div className="flex gap-2">
                <GoGitCompare
                  className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out cursor-pointer"
                />
                <p className="text-sm">{props.rewoofs}</p>
              </div>
              <div className="flex gap-2">
                <GoFlame
                  className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out cursor-pointer"
                />
                <p className="text-sm">{props.likes}</p>
              </div>
              <GoShare
                className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out cursor-pointer"
              />
              {props.canDelete && (
                <button
                  onClick={() => handleDeleteWoof(props.woofKey, props.image)}
                  className="text-sm text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default WoofCard;
