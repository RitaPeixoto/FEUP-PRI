import React from "react";
import {useNavigate} from "react-router-dom";
import {Card, Col} from "react-bootstrap";

export default function BookCard({id, title, number, image}) {
    const navigate = useNavigate();
    const width = number === "0" ? "13rem" : "12rem";
    const height = number === "0" ? "auto" : "12rem";

    return (
        <Card
            card-id={id}
            className="bookcard m-4 mt-1"
            style={{width: width, height: height, padding: "0", cursor: 'pointer'}}
            onClick={() => navigate(`/book/${id}`)}
        >
            <Card.Img className="card-image" variant="top" src={image}/>
            {title !== undefined ? (
                <Card.ImgOverlay
                    className="d-flex align-items-end"
                    style={{opacity: 0.8}}
                >
                    <Col className="text-center">
                        <Card.Title>{title}</Card.Title>
                        {number !== "0" ? <p>#{number}</p> : null}
                    </Col>
                </Card.ImgOverlay>
            ) : null}
        </Card>
    );
}
