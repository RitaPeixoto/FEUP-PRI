import mainImage from "../assets/home.png";
import {CgArrowDownO} from "react-icons/cg";

export default function MainImage() {
    return (
        <>
            <img src={mainImage} className="img-fluid" alt="mainImage"/>
            <div>
                <a href="#top-20" className="arrow-down">
                    <CgArrowDownO size="3rem"/>
                </a>
            </div>
        </>
    );
}
