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
  const [book, setBook] = useState({});
  const [fullDesc, setFullDesc] = useState(false);
  const [reviews, setReviews] = useState([]);
  const location = useLocation();
  const author = "by Lisa Sachs";
  const title = "The cats' book of romance";
  const description =
    "Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now!";
  const smallDesc = description.substr(0, 740);
  const text =
    "Award-winning poet Norman Ornelas is dropping by on March 10, 7PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7 PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now! Award-winning poet Norman Ornelas is dropping by on March 10, 7PM. He will be reading from his new collection, Spring, and signing copies. Buy tickets now!";
  const isbn = "012457845914";
  const genres = ["Animals", "cats"];
  const bookformat = "Hardcover";
  const pages = 550;
  const rating = 4.56;
  const n_ratings = 8;
  const n_reviews = 159;
  const img_source = "https://images-na.ssl-images-amazon.com/images/I/51T50JQECKL.jpg"



  useEffect(() => {
    const bookId = location.pathname.replace("/book/", "");
    axios
      .get(`http://localhost:3001/book/${bookId}`)
      .then((res) => {
        setBook(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

      let reviews = []
      for (let i = 0; i<=4; i++){
        reviews.push(text)
      }
      
      setReviews(reviews)
    
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
        <Row className="g-0">
          <Col sm={4} className=" justify-content-center">
            <Row>
              <img
                src={img_source}
                alt=""
                style={{"width":"20rem", "height": "25rem"}}
              />
            </Row>
            <BookInfoCard isbn={isbn} genres={genres} bookformat={bookformat} pages={pages}/>
          </Col>
          <Col>
            <h2>{title}</h2>
            <h6 className="author">{author}</h6>
            <div className={`mt-4 ${fullDesc? "d-none":"d-flex"} `}>
              <p>
                {smallDesc}
                <a className="more" onClick={seeMoreDesc}>
                  {" "}
                  see more...
                </a>
              </p>
            </div>
            <div className={`mt-4  ${fullDesc? "d-flex":"d-none"} `} >
              <p>{text}
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
                  {rating}
                </p>
              </div>
              <Col>
                <Row className="justify-content-center align-items-center d-flex">
                  <Col md={2}>
                    {" "}
                    <FaHashtag size="1rem" className="mb-1" /> <span>{n_ratings} ratings</span>
                  </Col>
                  <Col md={2}>
                    {" "}
                    <FaHashtag size="1rem" className="mb-1"/> <span>{n_reviews} reviews</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            {reviews.map((item)=>{
              return <ReviewCard text={item}/>
            })}
  
          </Col>
        </Row>
      </div>
    </>
  );
}
