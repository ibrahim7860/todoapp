import React from "react";
import SignIn from "./SignIn";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUp from "./SignUp";
import HomePage from './HomePage'
import ForgotPassword from "./ForgotPassword";

let color = '#' +  Math.random().toString(16).substr(-6);

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<SignIn backgroundColor={color}/>} />
              <Route path="/signup" element={<SignUp backgroundColor={color}/>} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
