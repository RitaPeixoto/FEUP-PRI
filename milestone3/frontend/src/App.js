import React from 'react';
import Home from './pages/Home';
import './style/style.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Search from "./pages/Search";

function App() {
    /*const [message, setMessage] = useState("");
    const sendRequest = () => {
        axios.get(`http://localhost:3001/test`).then((res) => {
            console.log(res.data.message);
            setMessage(res.data.message);
        }).catch((error) => {
            console.error(error);
        });
    };*/
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/search" element={<Search/>}/>
            </Routes>
        </BrowserRouter>);
}

export default App;
