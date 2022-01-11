import {Row } from "react-bootstrap";

export default function ReviewCard({ text }) {
  const smallText = text.substr(0, 330)

  return (
    <Row className="mx-5 py-5 my-3 review-card col-md-10 col-sm-8">
      <div>
        <p>
          {smallText}{" "}
          <a className="more" href="">
            {" "}
            see more...
          </a>
        </p>
      </div>
      <div className="d-none">
        <p>{text}</p>
      </div>
    </Row>
  );
}
