import React, {useState} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import {firebaseConfig} from "../firebase-config";

function ForgotPassword() {

    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
    const navigate = useNavigate()

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        try {
            await firebase.initializeApp(firebaseConfig)
            await firebase.auth().sendPasswordResetEmail(forgotPasswordEmail)
            alert("Email sent successfully!")
            navigate('/')
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div>
            <h1 className="title">What To Do?</h1>
            <div className="login-box">
                <h1 className="sign-in">FORGOT PASSWORD?</h1>
                <div style={{display: 'flex', justifyContent: 'center', fontSize: "22px", marginTop: "5%"}}>Please enter your email address and we will send you instructions to reset your password</div>
                <Container fluid style={{paddingLeft: "25%"}}>
                    <Form>
                        <Form.Group style={{marginTop: "5%"}}>
                            <Form.Label style={{fontSize: "27px"}}>Email</Form.Label>
                            <Form.Control type="email" style={{width: "67%", height: "40px"}} onChange={(event) => {
                                setForgotPasswordEmail(event.target.value)
                            }}/>
                        </Form.Group>
                        <Button onClick={handlePasswordReset} variant="primary" style={{marginTop: "10%", marginBottom: "15px", width: "67%"}}>RESET PASSWORD</Button>
                    </Form>
                </Container>
                <div style={{display: "flex", marginTop: "45px", justifyContent: 'center', fontSize: "20px"}}>
                    <Link to="/" replace>BACK TO SIGN IN</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;