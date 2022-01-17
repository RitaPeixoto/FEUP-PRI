import {Col, Row} from "react-bootstrap";
import BookCard from "../partials/Card.js";

export default function Gender() {
    return (
        <Row className="gender d-flex align-items-center g-0" id="top-20">
            <Col className="col-3 woman-reading"/>
            <Col className="col-9">
                <Row>
                    <BookCard
                        id="1"
                        title="Young Adult"
                        number="1"
                        image="https://64.media.tumblr.com/tumblr_m0y4mxFBPT1rrqfz1o1_1280.jpg"
                    />
                    <BookCard
                        id="2"
                        title="Sci-Fi & Fantasy"
                        number="2"
                        image="https://1.bp.blogspot.com/-tjstYasWRIk/XeT8NHk9IwI/AAAAAAABJvU/pNnbukQniVYdKHtv10LKrSTwDuPAiVxrACLcBGAsYHQ/s1600/tumblr_42ff2b96be136fab4d2189f2711a5452_e35b0ec7_1280.jpg"
                    />
                    <BookCard
                        id="3"
                        title="Non-Fiction"
                        number="3"
                        image="https://images.unsplash.com/photo-1496861083958-175bb1bd5702?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Ftb21pbGV8ZW58MHx8MHx8&w=1000&q=80"
                    />
                    <BookCard
                        id="4"
                        title="History"
                        number="4"
                        image="https://image.freepik.com/free-photo/top-view-book-line_23-2147978166.jpg"
                    />
                </Row>
                <Row className="my-4 pb-5">
                    <BookCard
                        id="5"
                        title="Romance"
                        number="5"
                        image="https://i.pinimg.com/474x/84/dd/7e/84dd7ed144fad4d0307dc110ccb3a0f6.jpg"
                    />
                    <BookCard
                        id="6"
                        title="Drama"
                        number="6"
                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2aMP7XA6KlTuQQCg_q-0QGSdyxOLaGa7B5m-AY4qa7VGInk_HP_ND77uGwmgRooUWLGk&usqp=CAU"
                    />
                    <BookCard
                        id="7"
                        title="Childrens"
                        number="7"
                        image="https://i.pinimg.com/564x/f4/b5/c6/f4b5c604454ab68557f31faa02a91243.jpg"
                    />
                    <BookCard
                        id="8"
                        title="all genres"
                        number="8"
                        image="https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/03/15/Pictures/greece-museum-library_eca0e60e-284d-11e8-9f95-06a811d7e716.jpg"
                    />
                </Row>
            </Col>
        </Row>
    );
}
