import Navbar from "../components/Navbar";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import FilterBox from "../components/FilterBox";
import axios from "axios";
import BookCard from "../components/BookCard";
import {Box, CircularProgress, Pagination} from "@mui/material";

export default function Search() {
    const [resultList, setResultList] = useState([]);
    const [resultsNumber, setResultsNumber] = useState(0);
    const [bookformatList, setBookformatList] = useState([]);
    const [filters, setFilters] = useState({bookformats: [], genres: [], rating: [0, 5], pages: [0, 700]});
    const [genreList, setGenreList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previousInput, setPreviousInput] = useState("");

    useEffect(() => {
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
    }, [])

    const getResultList = (event, isSearching, pageNumber) => {
        event.preventDefault();

        let inputText;
        setIsLoading(true);
        if (isSearching) {
            const ele = document.getElementById('search-input');
            inputText = ele.value;
            setPreviousInput(inputText);
        }
        else
            inputText = previousInput;

        axios.get(`http://localhost:3001/book/search`, {params: {inputText, pageNumber}}).then((res) => {
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

    const setGenreFilters = (values) => {
        setFilters({...filters, genres: values});
    }

    const setBookformatFilters = (values) => {
        setFilters({...filters, bookformats: values});
    }

    const setRatingFilters = (values) => {
        setFilters({...filters, rating: values});
    }

    const setPagesFilters = (values) => {
        setFilters({...filters, pages: values});
    }

    return (
        <>
            <Navbar/>
            <div className="search-page">
                <div className="search-bar-section">
                    <Form.Group as={Row}>
                        <Form.Label column sm="3" className="search-bar-label">
                            What are you looking for?
                        </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text" id="search-input"/>
                        </Col>
                        <Col>
                            <Button className="search-button" onClick={(event) => getResultList(event, true, 0)}>search</Button>
                        </Col>
                    </Form.Group>
                </div>
                <Row className="search-page-body g-0">
                    <Col sm={4} className="search-body-col">
                        <p> Filter results </p>
                        <FilterBox title="genre" options={genreList} filters={filters.genres} setFilters={setGenreFilters} filterType="autocomplete"/>
                        <FilterBox title="bookformat" options={bookformatList} filters={filters.bookformats} setFilters={setBookformatFilters} filterType="autocomplete"/>
                        <FilterBox title="rating" options={[{value: 0, label: '0'}, {value: 5, label: '5'}]} filters={filters.rating} setFilters={setRatingFilters} step={0.1}
                                   filterType="number"/>
                        <FilterBox title="pages" options={[{value: 0, label: '0'}, {value: 700, label: '700+'}]} filters={filters.pages} setFilters={setPagesFilters}
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
                                                onChange={(event, value) => getResultList(event, false, value-1)} showFirstButton
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
                                        <Col xs={12} key={book.link}>
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
