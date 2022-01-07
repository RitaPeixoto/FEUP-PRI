import Navbar from "../components/Navbar.js";
import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Col, Row} from "react-bootstrap";
import {Divider, Rating} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function Book() {
    const [book, setBook] = useState({});
    const location = useLocation();

    useEffect(() => {
        const bookId = location.pathname.replace('/book/', '');
        axios.get(`http://localhost:3001/book/${bookId}`).then((res) => {
            setBook(res.data);
            console.log(res.data);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    return (
        <>
            <Navbar/>
            <div className="book-page">
                <Row className="g-0">
                    <Col sm={4} className="d-flex justify-content-center">
                        <img src={book.img} alt="" />
                    </Col>
                    <Col>
                        <h2>{book.title}</h2>
                        <p>by {book.author}</p>
                        <p>{book.desc}</p>
                        <Divider />
                        <Row>
                            <Col>
                                <Rating
                                    name="text-feedback"
                                    value={book.rating}
                                    readOnly
                                    precision={0.1}
                                    emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                                />
                                <span>{book.rating} - {book.totalRatings} ratings</span>
                                <p>Format: {book.bookformat}</p>
                                <p>Pages: {book.pages}</p>
                                <p>Isbn: {book.isbn}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    )
}
