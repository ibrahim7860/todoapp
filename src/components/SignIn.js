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
    signInWithFacebook,
    signInWithGoogle,
    signInWithGithub
} from "../firebase-config";
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";
import {onValue, ref} from "firebase/database";

function SignIn() {

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            navigate('/homepage')
        } catch (error) {
            if (error.code === 'auth/invalid-email' ) {
                alert("Your email address is not valid")
            }
            else if (error.code === 'auth/user-disabled') {
                alert("The account associated with this email has been disabled")
            }
            else if (error.code === 'auth/user-not-found') {
                alert('There is no user associated with this email')
            }
            else if (error.code === 'auth/wrong-password') {
                alert('The password you have entered is incorrect')
            }
            else {
                alert(error.message)
            }
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            alert(error.message)
        }
    }

    const handleFacebookSignIn = async () => {
        try {
            await signInWithFacebook()
        } catch (error) {
            alert(error.message)
        }
    }

    const handleGithubSignIn = async () => {
        try {
            await signInWithGithub()
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user != null) {
                const reference = ref(db, 'user/')
                onValue(reference, (snapshot) => {
                    const emailList = []
                    snapshot.forEach(function (childSnapshot) {
                        let value = childSnapshot.val()
                        emailList.push(value.emailAddress)
                    })
                     if (!emailList.some(email => email === user.email)) {
                           signOut(auth).then(() => {
                               navigate('/')
                               alert("This email does not have an account associated with it")
                           })
                      }
                      else {
                          navigate('/homepage')
                      }
                })
            }
        })
        return () => unsubscribe();
    }, [])

    return (
        <div>
            <h1 className="title">What To Do?</h1>
            <div className="login-box">
                <h1 className="sign-in">SIGN IN</h1>
                <Container fluid style={{paddingLeft: "25%"}}>
                    <Form>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px"}}>Email</Form.Label>
                            <Form.Control type="email" style={{width: "70%", height: "40px"}} onChange={(event) => {
                                setLoginEmail(event.target.value)
                            }}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px", paddingTop: "25px"}}>Password</Form.Label>
                            <Form.Control type="password" style={{width: "70%", height: "40px"}} onChange={(event) => {
                                setLoginPassword(event.target.value)
                            }}/>
                        </Form.Group>
                        <Button onClick={login} variant="primary" style={{marginTop: "40px", width: "70%"}}>SIGN IN</Button>
                    </Form>
                    <Row style={{marginLeft: '51%', marginTop: "10px", marginBottom: "10px", fontSize: "12pt"}}>
                        <Link to="/forgotpassword" replace>Forgot Password?</Link>
                    </Row>
                    <Row style={{marginRight: '8%'}}>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={google} alt="google logo" width="50px" height="50px" onClick={handleGoogleSignIn} />
                            </button>
                        </Col>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={facebook} alt="facebook logo" width="50px" height="55px" onClick={handleFacebookSignIn} />
                            </button>
                        </Col>
                        <Col>
                            <button  style={{backgroundColor: 'transparent', border: 'none'}}>
                                <img src={github} alt="github logo" width="55px" height="55px" onClick={handleGithubSignIn}/>
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