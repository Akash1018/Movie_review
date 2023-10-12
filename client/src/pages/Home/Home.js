import axios from "axios";
import { useEffect, useState } from "react";
import SingleData from "../../components/SingleData/SingleData";
import "./Home.css";
import { Link } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import Navbar from "../../components/HomeNav/HomeNav";
import Myloader from "react-spinners/PuffLoader";

const Home = () => {
  const [allContent, setAllContent] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [random, setRandom] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("grey");

  // const history = useHistory();

  const fetchPopularMovieApi = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/movies/popular`);
      console.log(data)
      const alldata = data.movies;
      console.log(data);
      const filter = alldata.slice(0, 6);
      setAllContent(filter);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTopRatedApi = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/movies/top_rated`);
      const alldata = data.movies;
      const filter = alldata.slice(0, 6);
      setTopRated(filter);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUpcomingApi = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/movies/upcoming`);
      const alldata = data.movies;
      const filter = alldata.slice(0, 6);
      setRandom(filter);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    window.scroll(0, 0);

    fetchPopularMovieApi();
    fetchTopRatedApi();
    fetchUpcomingApi();
    return () => {
      setAllContent();
      // setTheTrailers();
    };
  }, []);



  return (
    <>
      {isLoading ? (
        <>
          <div style={{ marginTop: "-10px" }} className="bg__home">
            <Navbar />
          </div>
          <div className="TreadingHome3 pt-2">
            <div className="title__home">
              <div className="btn__home">
              <Link to="/all-movies" style={{ textDecoration: "none" }}>
                <h6>
                  Movies On Air &#160;
                  <span style={{ paddingTop: "10px" }}>&#11166;</span>
                </h6></Link>
              </div>
              <div className="view__more">
                <Link to="/all-movies" style={{ textDecoration: "none" }}>
                  <p>View more &#187;</p>
                </Link>
              </div>
            </div>

            <div className="ListContent2">
              {allContent &&
                allContent.map((n) => (
                  <SingleData key={n.id} {...n} mediaType="movie" />
                ))}
            </div>
          </div>
          <div className="TreadingHome3">
            <div className="title__home">
              <div className="btn__home" style={{ width: "160px" }}>
              <Link to="/all-movies" style={{ textDecoration: "none" }}>
                <h6>
                  Top Rated &#160;
                  <span style={{ paddingTop: "10px" }}>&#11166;</span>
                </h6></Link>
              </div>
              <div className="view__more">
                <Link to="/all-movies" style={{ textDecoration: "none" }}>
                  <p>View more &#187;</p>
                </Link>
              </div>
            </div>
            <div className="ListContent2">
              {topRated &&
                topRated.map((n) => (
                  <SingleData key={n.id} mediaType="movie" {...n} />
                ))}
            </div>
          </div>
          <div className="TreadingHome3">
            <div className="title__home">
              <div className="btn__home" style={{ width: "160px" }}>
              <Link to="/all-movies" style={{ textDecoration: "none" }}>
                <h6>
                  Random&#160;
                  <span style={{ paddingTop: "10px" }}>&#11166;</span>
                </h6></Link>
              </div>
              <div className="view__more">
                <Link to="/all-movies" style={{ textDecoration: "none" }}>
                  <p>View more &#187;</p>
                </Link>
              </div>
            </div>
            <div className="ListContent2">
              {random &&
                random.map((n) => (
                  <SingleData key={n.id} mediaType="movie" {...n} />
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="major" style={{ height: "600px" }}>
          <Myloader color={color} size={60} />
        </div>
      )}
    </>
  );
};

export default Home;
