import React, {useState} from 'react';
import axios from 'axios';
import { Button } from "react-bootstrap";

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
    <div className="App">
      <Button onClick={sendRequest}>CLICK ME</Button>
      <p>{message}</p>
    </div>
  );
}

export default App;
