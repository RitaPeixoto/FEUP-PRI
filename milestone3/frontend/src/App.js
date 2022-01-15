import React from 'react';
import './style/style.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Search from "./pages/Search";
import Book from "./pages/Book";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Search/>}/>
                <Route exact path="/book/:title" element={<Book/>}/>
            </Routes>
        </BrowserRouter>);
}

export default App;
