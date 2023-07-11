import { useNavigate } from "react-router-dom";

function SearchedUserCard(props) {
  const navigate = useNavigate();
  return (
    <li className="py-3" key={props.userKey}>
      <div
        className="flex items-center space-x-4 cursor-pointer group"
        onClick={() => navigate(`/profile/${props.userKey}`)}
      >
        <div className="flex-shrink-0">
          <img
            className="w-10 h-10 rounded-full"
            src={props.profilePicture}
            alt="user profile"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-md font-medium text-xs text-gray-900 group-hover:text-orange-400 transition duration-300">
            {props.name}
          </p>
          <p className="text-md text-gray-500 text-xs group-hover:text-orange-400 transition duration-300">
            {props.username}
          </p>
        </div>
      </div>
    </li>
  );
}

export default SearchedUserCard;
