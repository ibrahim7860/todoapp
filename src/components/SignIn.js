import React, {useState} from 'react';
import './SignIn.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap'
import google from './images/google.png'
import facebook from './images/facebook.png'
import microsoft from './images/microsoft.png'
import {auth, signInWithFacebook, signInWithGoogle, signInWithMicrosoft} from "../firebase-config";
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";

function SignIn(props) {
    useEffect(() => { document.body.style.backgroundColor = props.backgroundColor }, [])
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            navigate('/homepage')
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div>
            <h1 className="title">What To Do?</h1>
            <div className="login-box">
                <h1 className="sign-in">SIGN IN</h1>
                <Container fluid style={{paddingLeft: "25%"}}>
                    <Form>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px"}}>Email</Form.Label>
                            <Form.Control type="email" style={{width: "75%", height: "40px"}} onChange={(event) => {
                                setLoginEmail(event.target.value)
                            }}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px", paddingTop: "25px"}}>Password</Form.Label>
                            <Form.Control type="text" style={{width: "75%", height: "40px"}} onChange={(event) => {
                                setLoginPassword(event.target.value)
                            }}/>
                        </Form.Group>
                        <Button onClick={login} variant="primary" style={{marginTop: "40px", width: "75%"}}>SIGN IN</Button>
                    </Form>
                    <Row style={{marginLeft: '53%', marginTop: "10px", marginBottom: "10px", fontSize: "12pt"}}>
                        <a href="https://google.com">Forgot Password?</a>
                    </Row>
                    <Row>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={google} alt="google logo" width="50px" height="50px" onClick={signInWithGoogle} />
                            </button>
                        </Col>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={facebook} alt="facebook logo" width="50px" height="55px" onClick={signInWithFacebook} />
                            </button>
                        </Col>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={microsoft} alt="microsoft logo" width="55px" height="55px" onClick={signInWithMicrosoft}/>
                            </button>
                        </Col>
                    </Row>
                </Container>
                <div style={{display: "flex", marginTop: "25px", justifyContent: 'center', fontSize: "20px"}}>
                    <span>Need an account?&nbsp;</span>
                    <Link to="/signup" replace>SIGN UP</Link>
                </div>
            </div>
        </div>

    );
}

export default SignIn;