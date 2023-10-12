import Heading from "../Header/Heading";
import "./MainNav.css";
import React, {useState, useEffect} from "react";
import { Link, useHistory, useLocation  } from "react-router-dom";
import HomeIcon from "../../images/home-icon.svg";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MovieIcon from "../../images/movie-icon.svg";
import TheatersIcon from "../../images/series-icon.svg";
import decode from 'jwt-decode'

const MainNav = () => {
  const[user ,setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const history = useHistory();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();

    history.push('/');

    setUser(null);
  }
  console.log(55, user)
  useEffect(() => {
    const token = user?.token;

    // JWT
    if(token) {
      const decodeToken = decode(token);

      if(decodeToken.exp * 1000 < new Date().getTime()){
        logout();
      }
    }

    setUser(JSON.parse(localStorage.getItem('profile')))
  },[location])
  return (
    <>
      <nav className="navbar navbar-expand navbar-light fixed-top">
        <Link className="navbar-brand" to="/">
          <Heading />
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active  nav__link">
              <Link className="nav-link" to="/">
                <img
                  src={HomeIcon}
                  style={{
                    fontSize: "17px",
                    marginBottom: "5px",
                    marginRight: "0px",
                  }}
                  alt=""
                />
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item  nav__link">
              <Link className="nav-link" to="/trending">
                <WhatshotIcon
                  style={{
                    fontSize: "17px",
                    marginBottom: "5px",

                    marginRight: "2px",
                  }}
                />
                Trending
              </Link>
            </li>
            <li className="nav-item  nav__link">
              <Link className="nav-link" to="/all-movies">
                <img
                  src={MovieIcon}
                  style={{
                    fontSize: "17px",
                    marginBottom: "2px",
                    marginRight: "1px",
                  }}
                  alt=""
                />
                Movies
              </Link>
            </li>
          </ul>
          {
          user ? <div className="all__right">
          <div className="btn-logout">
            <Link to={`/user/watchList/${user.result.id}`}>
              <FavoriteBorderIcon className="watchList" style={{
                    fontSize: "28px",
                    color: "white",
                  }} />
            </Link>
              <button className=" login-btn" onClick={logout}>logout</button>
          </div> </div> :
          <div className="all__right">
            <div className="btn-login">
              <Link to="/login">
                <button className="login-btn">login</button>
              </Link>
            </div>
          </div>
          }
        </div>
      </nav>
    </>
  );
};

export default MainNav;
