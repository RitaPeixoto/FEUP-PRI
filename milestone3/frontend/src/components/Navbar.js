import {Container, Navbar} from "react-bootstrap";

export default function NavBar() {
    return (
        <Navbar className="nav-bar" expand="lg">
            <Container>
                <Navbar.Brand className="brand" href="/">
                    bookgarden
                </Navbar.Brand>
                {/*<Navbar.Toggle aria-controls="basic-navbar-nav" />*/}
            </Container>
        </Navbar>
    );
}
