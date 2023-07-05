import { Link, useLocation } from "react-router-dom";
import logo from "../assets/woofly-logo2.png";
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
        console.log(response);
        const articles = response.data.articles;
        const newsData = articles.map((article) => ({
          title: article.title.split(" ").slice(0, 12).join(" "), // Save only the first 40 words
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
    <div className="fixed bottom-0 left-0 bg-white md:w-60 2xl:w-90 md:left-5 2xl:top-0 border border-gray-200 max-w-screen-xl w-screen p-5 flex items-center md:w-60 md:h-250 md:flex-col md:shadow-lg 2xl:right-10 2xl:top-10 md:rounded-xl 2xl:left-auto hidden 2xl:block max-h-[90vh]">
      <h2 className="hidden md:block text-center">Explore the news</h2>
      <div>
        {news
          .filter((article) => article.image)
          .slice(0, 3)
          .map((article) => (
            <div className="py-3" key={article.urlToArticle}>
              <a className="bold font-bold" href={article.urlToArticle}>
                <h9>{article.title}</h9>
              </a>
              <div className="flex justify-center">
                <img
                  className="w-26 max-h-40"
                  src={article.image}
                  alt={article.title}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Explore;
