import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ToolTip from "../components/ToolTip";
import { ref as databaseRef, get } from "firebase/database";
import { database } from "../firebase";
import WoofCard from "../components/WoofCard";
import { WoofsContext } from "../App";
import formatTime from "../utils/FormatDate";

function Explore() {
  const location = useLocation();
  const [news, setNews] = useState([]);
  const [showToolTip, setShowToolTip] = useState(false);
  const [mostFollowedWoofers, setMostFollowedWoofers] = useState([]);

  const DB_USERINFO_KEY = "userinfo/";
  const navigate = useNavigate();
  const woofs = useContext(WoofsContext);

  useEffect(() => {
    const fetchUserData = () => {
      const userDataRef = databaseRef(database, DB_USERINFO_KEY);

      get(userDataRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const mostFollowersResults = Object.keys(userData)
            .sort((a, b) => {
              const followersA = userData[a]?.followers;
              const followersB = userData[b]?.followers;

              const followersCountA = followersA
                ? Object.keys(followersA).length
                : 0;
              const followersCountB = followersB
                ? Object.keys(followersB).length
                : 0;

              return followersCountB - followersCountA;
            })
            .slice(0, 3);
          const mostFollowedWoofers = mostFollowersResults.map(
            (item) => userData[item]
          );
          setMostFollowedWoofers(mostFollowedWoofers);
        } else {
          setMostFollowedWoofers([]);
        }
      });
    };

    fetchUserData();
  }, [location]);

  const handleMouseEnter = (index) => {
    setShowToolTip(index);
  };

  const handleMouseLeave = () => {
    setShowToolTip(null);
  };

  useEffect(() => {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=sg&apiKey=${apiKey}&pageSize=30`;

    axios
      .get(url)
      .then((response) => {
        const articles = response.data.articles;
        const newsData = articles.map((article) => ({
          title: article.title.split(" ").slice(0, 12).join(" "), // Save only the first 12 words
          image: article.urlToImage,
          urlToArticle: article.url,
          description: article.description,
        }));
        setNews(newsData);
      })
      .catch((error) => {
        console.error("Error retrieving news", error);
      });
  }, []);

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="w-full px-2 mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 md:shadow-lg md:p-5 md:mt-10 md:pb-5 md:mb-0 md:border md:border-gray-200">
        <p className="px-2 pt-5 pb-1 text-xl font-medium text-gray-900 text-center md:pt-0 md:pb-1">
          Explore
        </p>
        <p className="text-gray-400 text-center text-xs">
          Catch up with the latest happenings in the world!
        </p>
      </div>
      <div className="w-full mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 shadow-lg p-5 md:pb-10 md:mb-0 border border-gray-200">
        <p className="block mb-2 text-md font-medium text-gray-900">
          Most Followed Woofers
        </p>
        <div className="p-4 flex justify-center items-center gap-2 md:pb-4 md:gap-5">
          {mostFollowedWoofers.map((user, index) => (
            <div
              className="flex flex-col items-center cursor-pointer"
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate(`/profile/${user.userId}`)}
            >
              <ToolTip show={showToolTip === index} text={user.username} />
              <img
                className="w-16 h-16 rounded md:h-24 md:w-24"
                src={user.profilePicture}
                alt="Medium avatar"
              />
              <div className="inline-flex px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm mt-2 md:hidden">
                @{user.username}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 shadow-lg p-5 md:pb-10 md:mb-0 border border-gray-200">
        <p className="block mb-2 text-md font-medium text-gray-900">
          Favourite Woofs
        </p>
        <div className="p-4 md:flex md:flex-col md:justify-center md:items-center md:pb-4">
          <ul className="divide-y divide-gray-200">
            {woofs
              .sort(
                (a, b) =>
                  (b.val.likes ? Object.keys(b.val.likes).length : 0) -
                  (a.val.likes ? Object.keys(a.val.likes).length : 0)
              )
              .slice(0, 2)
              .map((woof) => (
                <WoofCard
                  key={woof.key}
                  woofKey={woof.key}
                  user={woof.val.user}
                  profilePicture={woof.val.profilePicture}
                  name={woof.val.name}
                  userName={woof.val.username}
                  dateTime={formatTime(new Date(woof.val.date))}
                  content={woof.val.woof}
                  comments={woof.val.comments ? woof.val.comments : 0}
                  rewoofs={woof.val.rewoofs ? woof.val.rewoofs : 0}
                  likes={woof.val.likes}
                  image={woof.val.url ? woof.val.url : null}
                />
              ))}
          </ul>
        </div>
      </div>
      <div className="w-full mt-3 bg-white rounded-xl flex flex-col md:w-3/5 md:ml-72 shadow-lg p-5 md:pb-10 md:mb-0 border border-gray-200">
        <p className="block mb-2 text-md font-medium text-gray-900">News</p>
        <div className="p-4 md:flex md:flex-col md:justify-center md:items-center md:pb-10">
          <ul className="divide-y divide-gray-200">
            {news
              .filter((article) => article.image)
              .slice(0, 3)
              .map((article) => (
                <div className="py-4 group" key={article.urlToArticle}>
                  <a
                    href={article.urlToArticle}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h6 className="text-xs font-bold py-3 text-gray-500 text-center group-hover:text-orange-400 transition duration-300">
                      {article.title}
                    </h6>
                  </a>
                  <div className="flex justify-center">
                    <img
                      className="w-26 max-h-40 rounded-lg object-cover cursor-pointer saturate-0 group-hover:saturate-100 transition duration-300"
                      src={article.image}
                      alt={article.title}
                    />
                  </div>
                </div>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Explore;
