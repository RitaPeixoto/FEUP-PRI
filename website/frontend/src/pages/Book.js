import Navbar from "../components/Navbar.js";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import { Divider } from "@mui/material";
import { FaHashtag } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import ReviewCard from "../components/ReviewCard.js";
import BookInfoCard from "../components/BookInfoCard";

export default function Book() {
  const [book, setBook] = useState(undefined);
  const [fullDesc, setFullDesc] = useState(false);
  const location = useLocation();

  const getAuthors = () => {
    return book.author.replaceAll(',', ', ');
  }

  useEffect(() => {
    const bookId = location.pathname.replace("/book/", "");
    axios
      .get(`http://localhost:3001/book/${bookId}`)
      .then((res) => {
        setBook(res.data);
      })
      .catch((error) => {
        console.log(error);
      });   
  }, []);

  const seeMoreDesc = () => {
    setFullDesc(true)
  }
  const seeLessDesc = () => {
    setFullDesc(false)
  }

  return (
    <>
      <Navbar />
      <div className="book-page">
        {book !== undefined && (
        <Row className="g-0">
          <Col sm={4} className=" justify-content-center">
            <Row>
              <img
                src={book.img}
                alt=""
                style={{"width":"20rem", "height": "25rem"}}
              />
            </Row>
            <BookInfoCard isbn={book.isbn} genres={book.genres} bookformat={book.bookformat} pages={book.pages}/>
          </Col>
          <Col>
            <h2>{book.title}</h2>
            <h6 className="author">by {getAuthors()}</h6>
            <div className={`mt-4 ${fullDesc? "d-none":"d-flex"} `}>
              <p>
                {book.desc.substr(0, 740)}
                <a className="more" onClick={seeMoreDesc}>
                  {" "}
                  see more...
                </a>
              </p>
            </div>
            <div className={`mt-4  ${fullDesc? "d-flex":"d-none"} `} >
              <p>{book.desc}
                <a className="more" onClick={seeLessDesc}>
                    {" "}
                    see less...
                  </a>
              </p>
              
            </div>
            <Divider className="my-4" />
            <Row>
              <div className="justify-content-center d-flex">
                <p className="rating">
                  <AiFillStar
                    className="mb-1 star-rating"
                    size="2rem"
                  />
                  {book.rating}
                </p>
              </div>
              <Col>
                <Row className="justify-content-center align-items-center d-flex">
                  <Col md={2}>
                    {" "}
                    <FaHashtag size="1rem" className="mb-1" /> <span>{book.totalratings} ratings</span>
                  </Col>
                  <Col md={2}>
                    {" "}
                    <FaHashtag size="1rem" className="mb-1"/> <span>{book.reviews} reviews</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            {book.positive_reviews && book.positive_reviews.map((item, index)=>{
              return <ReviewCard key={`positive-${index}`} text={item} positive={true} />
            })}
            {book.negative_reviews && book.negative_reviews.map((item, index)=>{
              return <ReviewCard key={`positive-${index}`} text={item} positive={false} />
            })}
          </Col>
        </Row>
        )}
      </div>
    </>
  );
}
