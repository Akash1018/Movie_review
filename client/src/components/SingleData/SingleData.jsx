import { useHistory } from "react-router-dom";
import { img_300, unavailable } from "../../api/config/DefaultImages";
import "./SingleData.css";
import MuiPlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { styled } from "@mui/material/styles";

const PlayArrowRoundedIcon = styled(MuiPlayArrowRoundedIcon)(`

  &.MuiSvgIcon-root{
    color:#abb7c4 ;
  },  &.MuiSvgIcon-root:hover {
    color: #d13131 ;
  }
  
`);
const SingleData = ({
  poster_path,
  title,
  name,
  id,
  rating,
  vote_average,
  mediaType,
  media_type,
  value
}) => {
  const history = useHistory();
  const rate = rating ? rating : vote_average
  const handleClick = () => {
    history.push(`/${mediaType || media_type}/${id}`);
  };
  const setVoteClass = (vote) => {
    if (vote >= 8) {
      return "green";
    } else if (vote >= 6) {
      return "orange";
    } else {
      return "red";
    }
  };

  return (
    <>
      <div
        style={{ color: "white" }}
        className="SingleDataMedia"
        onClick={handleClick}
      >
        <span className={` tag ${setVoteClass(rate)} vote__tag`}>
          {Math.round(rate * 10) / 10}
        </span>

        <img
          src={poster_path ? `${img_300}/${poster_path}` : unavailable}
          alt=""
        />
        <div className="read__more">
          <PlayArrowRoundedIcon
            style={{
              border: "2px solid #abb7c4",
              borderRadius: "50px",
              fontSize: "3.2rem",
              cursor: "pointer",
            }}
            className="play__btn"
          />
          {/* <button >Read More</button> */}
        </div>
        <div className="SingleDataDetails">
          <h6>
            {title || name}
          </h6>
        </div>
      </div>
    </>
  );
};

export default SingleData;
