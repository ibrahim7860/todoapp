import React, {useEffect} from "react";
import Login from "./components/Login";

function App(props) {
    useEffect(() => { document.body.style.backgroundColor = props.backgroundColor }, [])
  return (
    <div className="App">
        <Login />
    </div>
  );
}

export default App;
