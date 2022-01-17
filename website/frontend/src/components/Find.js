import {Row} from "react-bootstrap";

export default function Find() {
    const height = window.innerHeight;
    return (
        <Row
            className="find align-items-center text-center g-0"
            style={{height: height}}
        >
            <h4 className="find-text">Find your perfect book!</h4>
            <h5 className="find-text">
                Find any book you're looking for with our amazing search system
                <a className="find-text-link" href="/search"> here.</a>
            </h5>
        </Row>
    );
}
