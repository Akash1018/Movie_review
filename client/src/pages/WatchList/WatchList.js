import axios from "axios";
import { useEffect, useState } from "react";
import SingleData from "../../components/SingleData/SingleData";
import Myloader from "react-spinners/PuffLoader";

const Movies = () => {
  const [treadingContent, setTreadingContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("grey");

  const fetchMovieApi = async () => {
    try {
      const user  = JSON.parse(localStorage.getItem('profile'))
      console.log(user.result.id)
      const { data } = await axios.get(
      ` 
      ${process.env.REACT_APP_API_URL}/movies//watchList/${user.result.id}
      `
      );
      console.log(99, data);
      setTreadingContent(data);
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
  }, [ isLoading ]);

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
                <button className="login-btn">My List</button>
            </div>
            <div className="btn-login">
                <button className="login-btn">Watched</button>
            </div>
          </div>
        <div className="ListContent">
          {isLoading && treadingContent ? (
            treadingContent.map((n) => (
              <SingleData key={n.id} {...n} mediaType="movie" />
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
