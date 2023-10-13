import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { img_300, img_500, unavailable } from "../../api/config/DefaultImages";
import SingleData from "../SingleData/SingleData";
import "./SinglePage.css";
import SingleVideoPage from "./SingleVideoPage";
import Myloader from "react-spinners/ClipLoader";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import Carousel from "../Carousel/Carousel";
import { FaStar } from "react-icons/fa";
import { styles , colors} from './StarRating'

const SinglePage = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [content, setContent] = useState();
  const [similarMovies, setSimilarMovies] = useState();
  const [video, setVideo] = useState();
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(10).fill(0)
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("grey");
  const history = useHistory();
  const { id, mediaType } = useParams();
  const [ star, setStar ] = useState(0);
  const [ checkStar, setCheckStar ] = useState();
  const [ watchList, setWatchList] = useState(false);

  const handleClick = (value) => {
    setCurrentValue(value)
  }

  const handleSubmit = async () => {
    await axios.patch(`${process.env.REACT_APP_API_URL}/movies//updateRating/${id}/${user.result.id}/${currentValue}`)
    setCheckStar(!checkStar);
    setStar(currentValue)
  }

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  }
  const handleChange = async (e) => {
    try {
      if(!watchList){
        await axios.patch(`${process.env.REACT_APP_API_URL}/movies/add/${user.result.id}/${id}`)
      } else {
        await axios.delete(`${process.env.REACT_APP_API_URL}/movies/removeMovie/${user.result.id}/${id}`)
      }
      setWatchList(!watchList);
    } catch (error) {
      console.log(error);
    }
  }
  const handleStar = async (e) => {
    try {
      setCheckStar(!checkStar);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData = async () => {
    try {
      const { data } = await axios.get(` 
      ${process.env.REACT_APP_BACK_END}/${mediaType}/${id}?api_key=${process.env.REACT_APP_API_KEY}&page=1`);
      // eslint-disable-next-line
      setContent(data);
      setIsLoading(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        history.replace("/error");
      }
    }
  };
  const fetchSimilarMovies = async () => {
    try {
      const { data } = await axios.get(` 
     ${process.env.REACT_APP_BACK_END}/${mediaType}/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`);
      // eslint-disable-next-line
      const dataSlice = data.results;
      const filter = dataSlice.slice(0, 7);

      // eslint-disable-next-line
      setSimilarMovies(filter);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackgroundClick = (e) => {
    // Check if the click target is the overlay itself (not its children)
    if (e.target === e.currentTarget) {
      setCheckStar(!checkStar);
    }
  }
  const fetchVideos = async () => {
    try {
      const { data } = await axios.get(` 
     ${process.env.REACT_APP_BACK_END}/${mediaType}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`);

      setVideo(data.results[0].key);
      setIsLoading(true);

      // eslint-disable-next-line
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStar = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/movies/checkRating/${user.result.id}/${id}`);
      if(data.Available){
        setStar(data.value);
        setCurrentValue(data.value)
      } else {
        setStar(0)
      }
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchList = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/movies/checkList/${user.result.id}/${id}`);

      if(data){
        setWatchList(data);
      }
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    window.scroll(0, 0);

    fetchData();
    fetchSimilarMovies();
    fetchVideos();
    fetchStar();
    fetchList();
    // eslint-disable-next-line
  }, [id, setContent, star]);
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure the overlay is on top of other content
  };
  return (
    <>
      {isLoading ? (
        <>
          <div>
            {content && (
              <div
                className="open__modal"
                style={{
                  backgroundImage: `url( https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${content.backdrop_path})`,
                }}
              >
                <img
                  className="poster__img"
                  src={
                    content.poster_path
                      ? `${img_300}/${content.poster_path}`
                      : unavailable
                  }
                  alt=""
                />
                <img
                  className="backdrop__img"
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailable
                  }
                  alt=""
                />

                <div className="open__detailsPage">
                  <h3>{content.original_title || content.name}</h3>
                  <div
                    style={{
                      zIndex: "1000",
                      marginTop: "10px",
                      textAlign: "left",
                    }}
                    className="year"
                  >
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "-----"
                    ).substring(0, 4)}{" "}
                    .
                    <b className="title_me">
                      {mediaType === "tv" ? "Tv Series ." : "Movie ."}
                    </b>
                    <b className="vote_back">
                      <b className="tmdb">Rating</b>
                      <b className="vote_ave">-⭐{content.vote_average}</b>
                    </b>
                  </div>
                  <h5
                    style={{
                      display: "flex",
                      fontSize: "12px",
                    }}
                    className="genreList"
                  >
                    {content.genres.map((n, i) => {
                      return (
                        <p
                          key={n.id}
                          style={{ fontSize: "13px", marginLeft: "6px" }}
                          className="mygenre"
                        >
                          {i > 0 && ", "}
                          {n.name}
                        </p>
                      );
                    })}
                  </h5>

                  <div className="videopage">
                    {content && (
                      <SingleVideoPage trailer={video} title={content.title} />
                    )}
                    { user && (!watchList  ? <button className="login-btn" onClick = {handleChange}>My List</button> : 
                                             <button className="login-btn" onClick = {handleChange}>Remove</button>)}
                    {user && (star ? <IconButton onClick={handleStar} ><StarIcon className="starClass" /></IconButton> : <IconButton onClick={handleStar} ><StarBorderIcon className="starClass" />
                    </IconButton>)}
                    {checkStar && (
                      <div style={overlayStyles} onClick={handleBackgroundClick}>
                            <div style={styles.container}>
                                  <h2> Rate Movie </h2>
                                  <div style={styles.stars}>
                                    {stars.map((_, index) => {
                                      return (
                                        <FaStar
                                          key={index}
                                          size={24}
                                          onClick={() => handleClick(index + 1)}
                                          onMouseOver={() => handleMouseOver(index + 1)}
                                          onMouseLeave={handleMouseLeave}
                                          color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
                                          style={{
                                            marginRight: 10,
                                            cursor: "pointer"
                                          }}
                                        />
                                      )
                                    })}
                                  </div>

                                  <button
                                    style={styles.button}
                                    onClick={handleSubmit}
                                  >
                                    Submit
                                  </button>
                                  
                                </div>
                      </div>
                    )}
                  </div>
                  <div className="tagline">
                    <h5>{content.tagline}</h5>
                  </div>
                  <div className="overview">
                    <p>{content.overview}</p>
                  </div>
                  <div className="other_lists">
                    <ul>
                      <li>
                        DURATION:{" "}
                        <span>
                          {mediaType === "tv"
                            ? `${content.episode_run_time[0]} min episodes`
                            : `${content.runtime} min`}
                        </span>
                      </li>
                      {mediaType === "tv" ? (
                        <li>
                          SEASONS: <span>{content.number_of_seasons}</span>
                        </li>
                      ) : (
                        ""
                      )}

                      <li>
                        STUDIO:
                        {content.production_companies.map((studio, i) => {
                          return (
                            <span key={studio.id}>
                              {" "}
                              {i > 0 && ",  "}
                              {studio.name}
                            </span>
                          );
                        })}
                      </li>
                      {mediaType === "movie" ? (
                        <li>
                          RELEASE DATE: <span>{content.release_date}</span>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        STATUS: <span>{content.status}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="all__cast px-5 pt-5">
            <div className="cast__title">
              <h2>Cast</h2>
            </div>
            <div>
              <Carousel mediaType={mediaType} id={id} />
            </div>
          </div>
          <div className="similar__shows">
            <div className="btn__title">
              <h5>You May Also Like </h5>
            </div>
            <div className="similar">
              {similarMovies &&
                similarMovies.map((n) => (
                  <SingleData key={n.id} {...n} mediaType="movie" />
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="load_app" style={{ height: "500px" }}>
          <Myloader color={color} size={60} />
          <p
            className="pt-4 text-secondary text-loading"
            style={{ textTransform: "capitalize", fontSize: "1rem" }}
          >
            Loading Please Wait...
          </p>
        </div>
      )}
    </>
  );
};

export default SinglePage;
