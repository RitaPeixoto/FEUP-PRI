import React, { useEffect, useState } from "react";
import { Card, Col, Row, Modal } from "react-bootstrap";
import BookCard from "../partials/Card.js";
import axios from "axios";

export default function AuthorCard({ author }) {
  const [modalShow, setModalShow] = useState(false);
  const [booksList, setBooksList] = useState([]);

  const getDesc = () => {
    if (author.author_description === "NaN") return "No description available";
    else return author.author_description;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/author/${author.author_name}/books`)
      .then((res) => {
        setBooksList(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Card className="mb-3 search-bookcard" onClick={() => setModalShow(true)}>
        <Row className="g-0">
          <Col lg={2} xs={3}>
            <img
              className="card-img"
              height="250"
              src={author.author_image}
              alt={author.author_name}
            />
          </Col>
          <Col>
            <div className="card-body">
              <h5 className="card-title">{author.author_name}</h5>
              <div className="author-card card-desc">{getDesc()}</div>
            </div>
          </Col>
        </Row>
      </Card>
      <Modal
        scrollable
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {author.author_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={4}>
              <img
                src={author.author_image}
                height="200"
                alt={author.author_name}
              />
            </Col>
            <Col>
              <p>{getDesc()}</p>
            </Col>
          </Row>
          <Row>
            <h3 className="mt-2">Books</h3>
            {booksList.map((item) => (
                <BookCard
                  as={Col}
                  id={item.id}
                  title=""
                  image={item.img}
                  number="0"
                />
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
