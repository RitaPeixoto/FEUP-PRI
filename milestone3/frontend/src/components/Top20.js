import { Row } from "react-bootstrap";
import { MdPlayArrow } from "react-icons/md";
import BookCard from "../partials/Card.js";

export default function Top20() {
  const height = window.innerHeight;
  return (
    <Row
      className="top-20 justify-content-center pb-5"
      id="top-20"
      style={{ height: { height } }}
    >
      <h2 className="top-20-title py-5">
        If you are more about the basics ...
      </h2>
      <BookCard
        id="1"
        title="The Fault in Our Stars"
        image="https://ccld.lib.ny.us/wp-content/uploads/2014/09/tfios.jpg"
        number="0"
      />
      <BookCard
        id="2"
        title="Divergent"
        image="https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Divergent.jpg/220px-Divergent.jpg"
        number="0"
      />
      <BookCard
        id="3"
        title="Fifty Shades of Grey"
        image="https://images-na.ssl-images-amazon.com/images/I/71VPGQoxPRL.jpg"
        number="0"
      />
      <h3 className="top-20-redirect " style={{ color: "white" }}>
        {" "}
        Top 20 Books <MdPlayArrow size="3rem" />{" "}
      </h3>
    </Row>
  );
}
