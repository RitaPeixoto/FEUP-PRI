import React from 'react';
import {Card, Col, Row} from "react-bootstrap";
import {Rating} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

export default function BookCard({book}) {

    const getAuthors = () => {
        return book.author.replaceAll(',', ', ');
    }

    const getGenres = () => {
        return book.genre.replaceAll(',', ', ');
    }

    return (
        <Card className="mb-3 search-bookcard">
            <Row className="g-0">
                <Col lg={2} xs={3}>
                    <img className="card-img" height="250" src={book.img} alt={book.title}/>
                </Col>
                <Col>
                    <div className="card-body">
                        <h5 className="card-title">{book.title}</h5>
                        <div className="card-desc">
                            {book.desc}
                        </div>
                        <div className="card-authors">
                            <p className="mt-0 pt-0 mb-0 pb-0"><strong>Author:</strong> {getAuthors()}</p>
                        </div>
                        <div className="card-genres">
                            <p className="mt-0 pt-0 mb-0 pb-0"><strong>Genre:</strong> {getGenres()}</p>
                        </div>
                        <Row className="card-info d-flex align-items-center">
                            <Col>
                                <Rating
                                    name="text-feedback"
                                    value={book.rating}
                                    readOnly
                                    precision={0.1}
                                    emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                                />
                            </Col>
                            <Col>
                                {book.totalratings} total ratings
                            </Col>
                            <Col>
                                {book.pages} pages
                            </Col>
                            <Col>
                                {book.bookformat}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Card>
    )
}
