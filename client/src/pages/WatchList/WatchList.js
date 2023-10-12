import axios from "axios";
import { useEffect, useState } from "react";
import SingleData from "../../components/SingleData/SingleData";
import Myloader from "react-spinners/PuffLoader";

const Movies = () => {
  const [treadingContent, setTreadingContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("grey");
  const [view, setView] = useState(0);

  const fetchMovieApi = async () => {
    try {
      const user  = JSON.parse(localStorage.getItem('profile'))
      if(!view){
        const { data } = await axios.get(` ${process.env.REACT_APP_API_URL}/movies//watchList/${user.result.id}`);
        setTreadingContent(data);
      } else {
        const { data } = await axios.get(` ${process.env.REACT_APP_API_URL}/movies//watchedList/${user.result.id}`);
        setTreadingContent(data);
      }
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchMovieApi();
    return () => {
      setTreadingContent();
    };
  }, [ isLoading, view ]);

  return (
    <>
      <main className="all__movies">
        <div className="my__main">
          <div className="TreadingHome">
            <h3> Movies:</h3>
          </div>
        </div>
        
        <div className="myList">
            <div className="btn-login">
                <button className={`login-btn ${!view ? 'active' : ''}`} onClick={() => setView(0)} >My List</button>
            </div>
            <div className="btn-login">
                <button className={`login-btn ${view ? 'active' : ''}`} onClick={() => setView(1)} >Watched</button>
            </div>
        </div>
        <div className="ListContent">
          {isLoading && treadingContent ? (
            treadingContent.map((n) => (
              <SingleData key={n.id} {...n} value ="watchList" mediaType="movie" />
            ))
          ) : (
            <div
              className="loading  "
              style={{
                display: "flex",
                height: "450px",

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Myloader color={color} size={60} />
              <p
                style={{
                  color: "grey",
                  fontSize: "13px",
                  marginLeft: "10px",
                  marginTop: "10px",
                }}
              >
                fetching data ...
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Movies;
