import { useNavigate } from "react-router-dom";
import errorPageVector from "../assets/error-page-vector.svg";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="max-sm:bg-white min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center w-[80vw] h-[70vh] rounded-xl max-sm:bg-white bg-opacity-80 md:justify-start md:items-center">
        <img
          className="h-72 w-72 object-contain"
          src={errorPageVector}
          alt="logo"
        />
        <h1 className="text-2xl font-bold py-4 w-full text-center md:text-3xl">
          Error
        </h1>
        <p className="text-md mb-1 text-gray-500 px-5 py-2 text-center">
          The page that you are trying to access is unavailable.
        </p>
        <button
          type="button"
          className="text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-full text-md w-full px-10 py-4 mr-2 mt-4 md:w-[30vw]"
          onClick={() => navigate("/home")}
        >
          Proceed to Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
