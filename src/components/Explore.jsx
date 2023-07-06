import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Explore() {
  const location = useLocation();
  const [news, setNews] = useState([]);

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

  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/newProfile" ||
    location.pathname === "/404"
  ) {
    return null;
  }

  return (
    // <div className="fixed bottom-0 left-0 bg-white 2xl:w-90 border border-gray-200 max-w-screen-xl w-screen p-5 flex items-center md:w-60 md:h-250 md:flex-col md:shadow-lg 2xl:right-10 2xl:top-10 md:rounded-xl 2xl:left-auto 2xl:block max-h-[90vh]">
    <div className="mb-24 rounded-xl md:flex md:flex-col md:items-center md:mt-10 md:w-3/5 md:ml-72 md:shadow-lg md:p-5  md:pb-0 bg-white bottom-0 border border-gray-200 w-full px-2 py-2 justify-center items-start lg:mt-0 lg:w-[17.5vw] lg:fixed lg:flex lg:flex-col lg:top-10 lg:right-[6%] lg:justify-start lg:shadow-lg lg:min-h-fit lg:rounded-xl">
      <h2 className="px-2px pt-5 pb-1 text-xl font-medium text-gray-900 text-center md:pt-0 md:pb-4">
        Explore
      </h2>
      <p className="text-gray-400 text-center text-xs">
        Catch up with the latest news on Woofly
      </p>
      <div className="p-4 md:flex md:flex-col md:justify-center md:items-center md:pb-10">
        <ul className="divide-y divide-gray-200">
          {news
            .filter((article) => article.image)
            .slice(0, 3)
            .map((article) => (
              <div
                className="py-4 hover:text-orange-400 transition duration-300 saturate-0 hover:saturate-100"
                key={article.urlToArticle}
              >
                <a href={article.urlToArticle} target="_blank" rel="noreferrer">
                  <h6 className="text-xs font-bold py-3 text-gray-500 text-center">
                    {article.title}
                  </h6>
                </a>
                <div className="flex justify-center">
                  <img
                    className="w-26 max-h-40 rounded-lg object-cover cursor-pointer"
                    src={article.image}
                    alt={article.title}
                  />
                </div>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Explore;
