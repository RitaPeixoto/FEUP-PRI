import { Row } from "react-bootstrap";

export default function BookInfoCard({ isbn, genres, bookformat, pages }) {
  return (
    <Row
      className="mt-5 px-5 py-5 info-card"
      style={{width: "20rem" }}
    >
      <p>
        <b>ISBN: </b> {isbn}
      </p>
      <p>
        <b>Genres: </b> {genres}
      </p>
      <p>
        <b>Book format: </b> {bookformat}
      </p>
      <p>
        <b>Number of pages: </b> {pages}
      </p>
    </Row>
  );
}
