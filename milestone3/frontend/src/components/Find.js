import { Row } from "react-bootstrap";

export default function Find() {
  const height = window.innerHeight;
  return (
    <Row
      className="find  align-items-center text-center"
      style={{ height: { height } }}
    >
      <h4 className="find-text">Find your perfect book!</h4>
      <h6 className="find-text">
        Find any book you're looking for with our amazing search system{" "}
        <a>here.</a>{" "}
      </h6>
    </Row>
  );
}
