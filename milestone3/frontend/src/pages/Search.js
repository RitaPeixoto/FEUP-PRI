import Navbar from "../components/Navbar";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import FilterBox from "../components/FilterBox";
import axios from "axios";
import BookCard from "../components/BookCard";

export default function Search() {
    const [resultList, setResultList] = useState([]);
    const [resultsNumber, setResultsNumber] = useState(0);
    const [bookformatList, setBookformatList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const pageNumber = 0;
    let inputText = "";

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

    const search = () => {
        axios.get(`http://localhost:3001/book/search`, {params: {inputText, pageNumber}}).then((res) => {
            setResultList(res.data.books);
            setResultsNumber(res.data.numFound);
        }).catch((error) => {
            console.error(error);
        });
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
                            <Form.Control type="text" onChange={(e) => inputText = e.target.value}/>
                        </Col>
                        <Col>
                            <Button className="search-button" onClick={search}>search</Button>
                        </Col>
                    </Form.Group>
                </div>
                <Row className="search-page-body g-0">
                    <Col sm={4} className="search-body-col">
                        <p> Filter results </p>
                        <FilterBox title="genre" options={genreList} filterType="autocomplete"/>
                        <FilterBox title="bookformat" options={bookformatList} filterType="autocomplete"/>
                        <FilterBox title="rating" options={[{value: 0, label: '0'}, {value: 5, label: '5'}]} step={0.1}
                                   filterType="number"/>
                        <FilterBox title="pages" options={[{value: 0, label: '0'}, {value: 700, label: '700+'}]}
                                   step={10} filterType="number"/>
                    </Col>
                    <Col sm={8} className="search-body-col">
                        <p> {resultsNumber} results </p>
                        <Row className="search-results">
                            {resultList.map((book) => (
                                <Col xs={12} key={book.link}>
                                    <BookCard book={book}/>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    );
}
