import { Row } from "react-bootstrap";
import { useState } from "react";
import {FaRegThumbsUp, FaRegThumbsDown} from 'react-icons/fa';

export default function ReviewCard({ text, positive }) {
  const smallText = text.substr(0, 330);
  const [fullReview, setFullReview] = useState(false);

  const large = text.length > 330 ? true : false;

  const seeMoreReview = () => {
    setFullReview(true);
  };

  const seeLessReview = () => {
    setFullReview(false);
  };

  return (
    <Row className="mx-5 py-3 px-2 my-3 review-card col-md-10 col-sm-8">
      {positive ? 
        <FaRegThumbsUp className="mt-2"/>
        :
        <FaRegThumbsDown className="mt-2"/>
      }
      <div className={`mt-2 ${fullReview ? "d-none" : "d-flex"} `}>
        <p>
          {smallText}{" "}
          {large && 
            <a className="more" onClick={seeMoreReview}>
              {" "}
              see more...
            </a>
          }
        </p>
      </div>
      {large &&  (
        <div className={`mt-2  ${fullReview ? "d-flex" : "d-none"} `}>
          <p>
            {text}
            <a className="more" onClick={seeLessReview}>
              {" "}
              see less...
            </a>
          </p>
        </div>
      )}
    </Row>
  );
}
