import React from "react";
import SignIn from "./SignIn";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUp from "./SignUp";
import HomePage from './HomePage'
import ForgotPassword from "./ForgotPassword";
import {useEffect} from "react";

let color = '#' +  Math.random().toString(16).substr(-6);

function App() {
    useEffect(() => { document.body.style.backgroundColor = color }, [])
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<SignIn/>} />
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
