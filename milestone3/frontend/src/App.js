import React, {useState} from 'react';
import axios from 'axios';
import Home from './pages/Home';
import './style/style.css';

function App() {
    const [message, setMessage] = useState("");
    const sendRequest = () => {
        axios.get(`http://localhost:3001/test`).then((res) => {
            console.log(res.data.message);
            setMessage(res.data.message);
        }).catch((error) => {
            console.error(error);
        });
    };
  return (
    <>
    <Home/>
    </>
    
  );
}

export default App;
