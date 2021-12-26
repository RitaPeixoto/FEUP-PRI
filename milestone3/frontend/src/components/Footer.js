import { Row, Col } from "react-bootstrap";
import BookCard from "../partials/Card.js";

export default function Footer() {
  return (
    <Row className="footer justify-content-center p-5">
      <Col className="footer-text">
        <h3>Come by</h3>
        <p>10 AM - 6 PM MONDAYS TO SATURDAYS</p>
        <p>1234 Churchill Plaza Sault Ste Marie, ON 4378</p>
      </Col>
      <Col>
        <BookCard
          id="1"
          image="https://i.pinimg.com/564x/cb/64/ee/cb64ee7587039ea7dbe4f626ff661729.jpg"
          number="0"
        />
      </Col>
      <Col>
        <BookCard
          id="2"
          image="https://images.adsttc.com/media/images/613f/591a/c5a0/d71a/3318/0517/newsletter/stanbridgemill-library11848.jpg?1631541621"
          number="0"
        />
      </Col>
      <Col>
        <BookCard
          id="3"
          image="https://i.pinimg.com/564x/85/5c/3d/855c3dd2b5f4be7960dd01c0bfa04689.jpg"
          number="0"
        />
      </Col>
    </Row>
  );
}
