import React, {useState} from 'react';
import './SignIn.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap'
import google from './images/google.png'
import facebook from './images/facebook.png'
import github from './images/github.png'
import {
    auth,
    db,
    pushEmailToDatabase,
    signInWithFacebook,
    signInWithGoogle,
    signInWithGithub
} from "../firebase-config";
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import {ref} from "firebase/database";

function SignUp() {

    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const navigate = useNavigate()

    const register = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            navigate('/homepage')
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('An account exists with this email address')
            }
            else if (error.code === 'auth/invalid-email') {
                alert('You have entered an invalid email')
            }
            else if (error.code === 'auth/operation-not-allowed') {
                alert('Email/password accounts are not enabled')
            }
            else if (error.code === 'auth/weak-password') {
                alert("The password you have entered is not strong enough")
            }
            else {
                alert(error.message)
            }
        }
    }

    const handleGoogleSignUp = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            alert(error.message)
        }
    }

    const handleFacebookSignUp = async () => {
        try {
            await signInWithFacebook()
        } catch (error) {
            alert(error.message)
        }
    }

    const handleGithubSignUp = async () => {
        try {
            await signInWithGithub()
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user != null) {
                const emailReference = ref(db, 'user/' + user.uid)
                pushEmailToDatabase(emailReference, user.email)
                navigate('/homepage')
            }
        })
        return () => unsubscribe()
    }, [])


    return (
        <div>
            <h1 className="title">What To Do?</h1>
            <div className="login-box">
                <h1 className="sign-in">SIGN UP</h1>
                <Container fluid style={{paddingLeft: "25%"}}>
                    <Form>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px"}}>Email</Form.Label>
                            <Form.Control type="email" style={{width: "70%", height: "40px"}} onChange={(event) => {
                                setRegisterEmail(event.target.value)
                            }}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px", paddingTop: "25px"}}>Password</Form.Label>
                            <Form.Control type="password" style={{width: "70%", height: "40px"}} onChange={(event) => {
                                setRegisterPassword(event.target.value)
                            }}/>
                        </Form.Group>
                        <Button onClick={register} variant="primary" style={{marginTop: "40px", marginBottom: "44px", width: "70%"}}>SIGN UP</Button>
                    </Form>
                    <Row style={{marginRight: '8%'}}>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={google} alt="google logo" width="50px" height="50px" onClick={handleGoogleSignUp} />
                            </button>
                        </Col>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={facebook} alt="facebook logo" width="50px" height="55px" onClick={handleFacebookSignUp} />
                            </button>
                        </Col>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={github} alt="github logo" width="55px" height="55px" onClick={handleGithubSignUp}/>
                            </button>
                        </Col>
                    </Row>
                </Container>
                <div style={{display: "flex", marginTop: "25px", justifyContent: 'center', fontSize: "20px"}}>
                    <Link to="/" replace>BACK TO SIGN IN</Link>
                </div>
            </div>
        </div>

    );
}

export default SignUp;