import { BsDot } from "react-icons/bs";
import { GoShare, GoComment, GoGitCompare, GoFlame } from "react-icons/go";

function WoofCard(props) {
  return (
    <li className="py-3 px-5">
      <div className="flex items-start flex-col">
        <div className="flex items-start">
          <img
            className="w-12 h-12 object-cover rounded-full"
            src={props.profilePicture}
            alt="profile"
          />
          <div>
            <div className="flex items-center">
              <p className="text-sm mx-5 font-medium text-gray-900">
                {props.name}
              </p>
              <p className="text-sm mr-3 text-gray-500">{props.userName}</p>
              <p className="text-sm mr-3 text-gray-500">
                <BsDot />
              </p>
              <p className="text-sm mr-3 text-gray-500">{props.dateTime}</p>
            </div>
            <p className="text-gray-900 ml-5">{props.content}</p>
            {props.image && props.image !== null && (
              <div className="ml-5 my-2 rounded-2xl">
                <img
                  className="object-contain rounded-2xl"
                  src={props.image}
                  alt="user post"
                />
              </div>
            )}
            <div className="mx-5 mt-2 w-70 text-gray-500 flex justify-between">
              <div className="flex gap-2">
                <GoComment
                  className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out"
                />
                <p className="text-sm">{props.comments}</p>
              </div>
              <div className="flex gap-2">
                <GoGitCompare
                  className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out"
                />
                <p className="text-sm">{props.rewoofs}</p>
              </div>
              <div className="flex gap-2">
                <GoFlame
                  className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out"
                />
                <p className="text-sm">{props.likes}</p>
              </div>
              <GoShare
                className="w-5 h-5 hover:text-orange-400 transition duration-300 
                      ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default WoofCard;
