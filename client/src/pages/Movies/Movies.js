import axios from "axios";
import { useEffect, useState } from "react";
import Pagination2 from "../../components/Pagination/Pagination";
import LocalSearch from "../../components/Search/LocalSearch";
import SingleData from "../../components/SingleData/SingleData";
import Myloader from "react-spinners/PuffLoader";
import Genre from "../../components/Genres/Genre";
import useGenre from "../../components/Genres/UseGenre";

const Movies = () => {
  const [treadingContent, setTreadingContent] = useState([]);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterGenre, setFilterGenre] = useState([]);
  const [genreTitle, setGenreTitle] = useState();
  const [color, setColor] = useState("grey");
  const genreforURL = useGenre(filterGenre);

  const fetchMovieApi = async () => {
    try {
      const { data } = await axios.get(
        ` 
      ${process.env.REACT_APP_BACK_END}/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&page=${page}&language=en-US&sort_by=popularity.desc&with_genres=${genreforURL}
      `
      );
      setTreadingContent(data.results);
      setNumOfPages(100);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSearchApi = async () => {
    if (searchTerm) {
      const SEARCH_API = `${process.env.REACT_APP_API_URL}/movies/search/${searchTerm}`;
      const { data } = await axios.get(SEARCH_API);
      console.log(data);
      setTreadingContent(data);
      setNumOfPages(data.total_pages);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (searchTerm) {
      fetchSearchApi();
    } else {
      fetchMovieApi();
    }
    return () => {
      setTreadingContent();
    };
  }, [page, isLoading, genreforURL]);

  return (
    <>
      <main className="all__movies">
        <div className="my__main">
          <div className="TreadingHome">
            <h3>{genreTitle && genreTitle.name} Movies:</h3>
          </div>
          <LocalSearch
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            fetchSearchApi={fetchSearchApi}
            numOfpages={numOfPages}
            setIsLoading={setIsLoading}
            media="movies"
            placehold="Search Movies"
            isLoading={isLoading}
            treadingContent={treadingContent}
          />
        </div>
        <div className="sec__main ">
          <span className="all_genres ">
            <Genre
              media="movie"
              setFilterGenre={setFilterGenre}
              filterGenre={filterGenre}
              setTreadingContent={setTreadingContent}
              setPage={setPage}
              numOfpages={numOfPages}
              page={page}
              genreTitle={genreTitle}
              setGenreTitle={setGenreTitle}
              treadingContent={treadingContent}
            />
          </span>
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
              <Myloader color={color} size={50} />
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
        <Pagination2
          setPage={setPage}
          numOfPages={numOfPages}
          media="movies"
          searchTerm={searchTerm}
          setIsLoading={setIsLoading}
          page={page}
        />
      </main>
    </>
  );
};

export default Movies;
