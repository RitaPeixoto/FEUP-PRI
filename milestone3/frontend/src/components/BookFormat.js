import {Row} from "react-bootstrap";
import {MdPlayArrow} from "react-icons/md";
import BookCard from "../partials/Card.js";

export default function BookFormat() {
    return (
        <Row className="bookformat justify-content-center pb-5 g-0" id="top-20">
            <h3 className="bookformat-title pt-5" style={{color: "#829676"}}>
                {" "}
                Book format <MdPlayArrow size="3rem"/>{" "}
            </h3>

            <BookCard
                id="1"
                title="Paperback"
                image="https://kunzonpublishing.com/wp-content/uploads/2017/07/mass-market-paperback-samples-768x1024.jpg"
                number="0"
            />
            <BookCard
                id="2"
                title="Hardcover"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy01sNWQwUX9d2E3o8B1MwPuGwvjwu0UaA-w&usqp=CAU"
                number="0"
            />
            <BookCard
                id="3"
                title="Ebook"
                image="https://files.tecnoblog.net/wp-content/uploads/2019/05/book-3610618_1280.jpg"
                number="0"
            />
        </Row>
    );
}
