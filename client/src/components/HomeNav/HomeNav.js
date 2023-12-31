import "./HomeNav.css";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import axios from "axios";
import { useHistory } from "react-router-dom";

const HomeNav = () => {
  const [allContent, setAllContent] = useState([]);
  const history = useHistory();

  const handleClick = (id, media) => {
    history.push(`/movie/${id}/`);
  };
  const items = allContent.map((item) => (
    <div
      key={item.id}
      className="main__nav"
      style={{
        backgroundImage: `url( https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${item.backdrop_path})`,
      }}
    >
      <div className="nav">
        <h3>{item.title || item.name}</h3>

        <p>{item.overview}</p>
        <div className="back__btn">
          <button onClick={() => handleClick(item.id, item.media_type)}>
            LEARN MORE
          </button>
        </div>
      </div>
    </div>
  ));

  const fetchPopularMovieApi = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACK_END}/movie/popular?api_key=${process.env.REACT_APP_API_KEY}`
      );
      const alldata = data.results;
      const filter = alldata.slice(0, 10);
      const red = filter.reverse();

      setAllContent(red);
      // eslint-disable-next-line
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPopularMovieApi();

    // eslint-disable-next-line
  }, []);

  return (
    <AliceCarousel
      infinite
      autoPlay
      disableButtonsControls
      disableDotsControls
      mouseTracking
      autoPlayInterval={1500}
      items={items}
      
    />
  );
};

export default HomeNav;
