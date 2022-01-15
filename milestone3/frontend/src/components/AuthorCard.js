import React from "react";
import { Card, Col, Row } from "react-bootstrap";

export default function AuthorCard({ author }) {
const getDesc = () => {
    if(author.author_description === 'NaN') return "No description available";
    else return author.author_description;
}

  return (
    <Card className="mb-3 search-bookcard">
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
  );
}
