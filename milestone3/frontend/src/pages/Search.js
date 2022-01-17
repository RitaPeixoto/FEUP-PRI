import Navbar from "../components/Navbar";
import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import FilterBox from "../components/FilterBox";
import axios from "axios";
import BookCard from "../components/BookCard";
import AuthorCard from "../components/AuthorCard";

import {
  Box,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import { makeStyles, createStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    select: {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  })
);

export default function Search() {
  const [resultList, setResultList] = useState([]);
  const [resultsNumber, setResultsNumber] = useState(0);
  const [bookformatList, setBookformatList] = useState([]);
  const [filters, setFilters] = useState({
    bookformats: [],
    genres: [],
    rating: [0, 5],
    pages: [0, 700],
  });
  const [weights, setWeights] = useState({
    title: { label: "Title", checked: false },
    desc: { label: "Description", checked: false },
    author: { label: "Author", checked: false },
    positive_reviews: { label: "Positive Reviews", checked: false },
    negative_reviews: { label: "Negative Reviews", checked: false },
  });
  const [genreList, setGenreList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousInput, setPreviousInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewOption, setViewOption] = useState("book");

  useEffect(() => {
    axios
      .get("http://localhost:3001/book/filterInfo", {
        params: { field: "genre" },
      })
      .then((res) => {
        setGenreList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://localhost:3001/book/filterInfo", {
        params: { field: "bookformat" },
      })
      .then((res) => {
        setBookformatList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    getResultList(false, 0);
  }, []);

  const getBookResultList = (inputText, pageNumber) => {
    let weight = [];

    for (let key in weights) {
      if (weights[key].checked) weight.push(key);
    }

    axios
      .get(`http://localhost:3001/book/search`, {
        params: {
          inputText,
          pageNumber,
          bookformats: filters.bookformats,
          genres: filters.genres,
          rating: filters.rating,
          pages: filters.pages,
          weights: weight,
        },
      })
      .then((res) => {
        setResultList(res.data.books);
        setResultsNumber(res.data.numFound);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getAuthorResultList = (inputText, pageNumber) => {
    axios
      .get(`http://localhost:3001/author/search`, {
        params: {
          inputText,
          pageNumber,
        },
      })
      .then((res) => {
        setResultList(res.data.authors);
        setResultsNumber(res.data.numFound);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getResultList = (isSearching, pageNumber) => {
    let inputText;
    setCurrentPage(pageNumber + 1);
    if (isSearching) {
      const ele = document.querySelector(".rbt-input-main");
      inputText = ele.value.replace(/ +(?= )/g, "");
      if (inputText === " ") inputText = "";
      setPreviousInput(inputText);
    } else inputText = previousInput;

    if (viewOption === "author") getAuthorResultList(inputText, pageNumber);
    else if (viewOption === "book") getBookResultList(inputText, pageNumber);
  };

  const getTotalPages = () => {
    return Math.round(resultsNumber / 20);
  };

  const clearFilters = () => {
    setFilters({
      bookformats: [],
      genres: [],
      rating: [0, 5],
      pages: [0, 700],
    });
  };

  const updateFilters = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleViewChange = (event) => {
    setIsLoading(true);
    setViewOption(event.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    getResultList(false, 0);
  }, [filters, viewOption]);

  const classes = useStyles();
  return (
    <>
      <Navbar />
      <div className="search-page">
        <div className="search-bar-section">
          <SearchBar
            getResultList={getResultList}
            weights={weights}
            setWeights={setWeights}
          />
        </div>
        <Row className="search-page-body g-0">
          <Col sm={4} className="search-body-col">
            <p> Filter results </p>
            <FilterBox
              title="genres"
              options={genreList}
              filters={filters.genres}
              setFilters={updateFilters}
              filterType="autocomplete"
            />
            <FilterBox
              title="bookformats"
              options={bookformatList}
              filters={filters.bookformats}
              setFilters={updateFilters}
              filterType="autocomplete"
            />
            <FilterBox
              title="rating"
              options={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
              ]}
              filters={filters.rating}
              setFilters={updateFilters}
              step={0.1}
              filterType="number"
            />
            <FilterBox
              title="pages"
              options={[
                { value: 0, label: "0" },
                { value: 700, label: "700+" },
              ]}
              filters={filters.pages}
              setFilters={updateFilters}
              step={10}
              filterType="number"
            />
            <p className="clear-filters" onClick={clearFilters}>
              Clear filters
            </p>
          </Col>
          <Col sm={8} className="search-body-col">
            <Row className="d-flex align-items-center mb-2 mt-0 pt-0">
              <Col sm={2}>
                <span> {resultsNumber} results </span>
              </Col>
              <Col sm={2}>
                <Select
                  className={classes.select}
                  value={viewOption}
                  onChange={handleViewChange}
                >
                  <MenuItem value="show" disabled>
                    show
                  </MenuItem>
                  <MenuItem value="book">books</MenuItem>
                  <MenuItem value="author">authors</MenuItem>
                </Select>
              </Col>
              <Col className="d-flex justify-content-end">
                {resultsNumber !== 0 && (
                  <Pagination
                    count={getTotalPages()}
                    page={currentPage}
                    onChange={(event, value) => getResultList(false, value - 1)}
                    showFirstButton
                    showLastButton
                    shape="rounded"
                  />
                )}
              </Col>
            </Row>
            {isLoading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <Row className="search-results">
                {resultList.map((item) => (
                  <Col xs={12} key={item.id}>
                    {viewOption === "book" && <BookCard book={item} />}
                    {viewOption === "author" && <AuthorCard author={item} />}
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
}
