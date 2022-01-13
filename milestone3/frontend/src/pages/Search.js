import Navbar from "../components/Navbar";
import {Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import FilterBox from "../components/FilterBox";
import axios from "axios";
import BookCard from "../components/BookCard";
import {Box, CircularProgress, Pagination} from "@mui/material";
import SearchBar from "../components/SearchBar";

export default function Search() {
    const [resultList, setResultList] = useState([]);
    const [resultsNumber, setResultsNumber] = useState(0);
    const [bookformatList, setBookformatList] = useState([]);
    const [filters, setFilters] = useState({bookformats: [], genres: [], rating: [0, 5], pages: [0, 700]});
    const [weights, setWeights] = useState({
        title: {label: 'Title', checked: false},
        desc: {label: 'Description', checked: false},
        author: {label: 'Author', checked: false},
        positive_reviews: {label: 'Positive Reviews', checked: false},
        negative_reviews: {label: 'Negative Reviews', checked: false},
    });
    const [genreList, setGenreList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previousInput, setPreviousInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        document.title = 'search';
        axios.get("http://localhost:3001/book/filterInfo", {params: {field: "genre"}}).then((res) => {
            setGenreList(res.data);
        }).catch((error) => {
            console.log(error);
        })
        axios.get("http://localhost:3001/book/filterInfo", {params: {field: "bookformat"}}).then((res) => {
            setBookformatList(res.data);
        }).catch((error) => {
            console.log(error);
        })
        getResultList(false, 0);
    }, [])

    const getResultList = (isSearching, pageNumber) => {
        let inputText;
        setIsLoading(true);
        setCurrentPage(pageNumber + 1);
        if (isSearching) {
            const ele = document.querySelector('.rbt-input-main');  
            inputText = ele.value.replace(/ +(?= )/g, '');
            if (inputText === " ") inputText = "";
            setPreviousInput(inputText);
        } else
            inputText = previousInput;

        let weight = [];

        for (let key in weights) {
            if (weights[key].checked) weight.push(key);
        }

        axios.get(`http://localhost:3001/book/search`, {
            params: {
                inputText,
                pageNumber,
                bookformats: filters.bookformats,
                genres: filters.genres,
                rating: filters.rating,
                pages: filters.pages,
                weights: weight
            }
        }).then((res) => {
            setResultList(res.data.books);
            setResultsNumber(res.data.numFound);
            setIsLoading(false);
        }).catch((error) => {
            console.error(error);
        });
    }

    const getTotalPages = () => {
        return Math.round(resultsNumber / 20);
    }

    const clearFilters = () => {
        setFilters({bookformats: [], genres: [], rating: [0, 5], pages: [0, 700]});
    }

    const updateFilters = (key, value) => {
        setFilters({...filters, [key]: value});
    }

    useEffect(() => {
        getResultList(false, 0);
    }, [filters]);

    return (
        <>
            <Navbar/>
            <div className="search-page">
                <div className="search-bar-section">
                    <SearchBar getResultList={getResultList} weights={weights} setWeights={setWeights}/>
                </div>
                <Row className="search-page-body g-0">
                    <Col sm={4} className="search-body-col">
                        <p> Filter results </p>
                        <FilterBox title="genres" options={genreList} filters={filters.genres}
                                   setFilters={updateFilters} filterType="autocomplete"/>
                        <FilterBox title="bookformats" options={bookformatList} filters={filters.bookformats}
                                   setFilters={updateFilters} filterType="autocomplete"/>
                        <FilterBox title="rating" options={[{value: 0, label: '0'}, {value: 5, label: '5'}]}
                                   filters={filters.rating} setFilters={updateFilters} step={0.1}
                                   filterType="number"/>
                        <FilterBox title="pages" options={[{value: 0, label: '0'}, {value: 700, label: '700+'}]}
                                   filters={filters.pages} setFilters={updateFilters}
                                   step={10} filterType="number"/>
                        <p className="clear-filters" onClick={clearFilters}>Clear filters</p>
                    </Col>
                    <Col sm={8} className="search-body-col">
                        <Row>
                            <Col>
                                <p> {resultsNumber} results </p>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                {resultsNumber !== 0 && (
                                    <Pagination count={getTotalPages()}
                                                page={currentPage}
                                                onChange={(event, value) => getResultList(false, value - 1)}
                                                showFirstButton
                                                showLastButton shape="rounded"/>
                                )}
                            </Col>
                        </Row>
                        {isLoading ? (
                                <Box sx={{display: 'flex'}}>
                                    <CircularProgress color="inherit"/>
                                </Box>
                            ) :
                            (
                                <Row className="search-results">
                                    {resultList.map((book) => (
                                        <Col xs={12} key={book.id}>
                                            <BookCard book={book}/>
                                        </Col>
                                    ))}
                                </Row>
                            )
                        }
                    </Col>
                </Row>
            </div>
        </>
    );
}
