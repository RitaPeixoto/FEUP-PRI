import MainImage from "../components/MainImage.js";
import Navbar from "../components/Navbar.js";
import Top20 from "../components/Top20.js";
import BookFormat from "../components/BookFormat";
import Gender from "../components/Gender.js";
import Find from "../components/Find.js";
import Footer from "../components/Footer.js";

export default function NavBar() {
    return (
        <>
            <Navbar/>
            <div style={{overflowX: 'hidden'}}>
                <MainImage/>
                <Top20/>
                <BookFormat/>
                <Gender/>
                <Find/>
            </div>
            <Footer/>
        </>);
}
