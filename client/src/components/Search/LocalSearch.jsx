import * as React from "react";
import "./LocalSearch.css";
import "./../../pages/PagesStyles.css";
import { useEffect } from "react";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme, ThemeProvider } from "@material-ui/core";

export default function LocalSearch({ setSearchTerm, fetchSearchApi }) {
  // eslint-disable-next-line
  const [page, setPage] = useState(1);
  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#abb7c4;",
      },
    },
  });

  const handleSearch = () => {
    fetchSearchApi();
  };
  const handleChange = (e) => {
    e.preventDefault();
    console.log(1);
    setSearchTerm(e.target.value);
    handleSearch()
  };
  useEffect(() => {
    fetchSearchApi();

    return () => {};
    // eslint-disable-next-line
  }, [page]);
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div className="search">
          <div className="form_search">
            <input
              type="search"
              placeholder="Search Movies Here ..."
              onChange={handleChange}
            />
            <SearchIcon className="icon" label="ss" />
            <div
              className="btn btn-primary brn-sm search__icon"
              onClick={handleSearch}
              style={{textAlign: "center"}}
            >
              Search
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
