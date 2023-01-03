import React from 'react';
import './Login.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap'
import google from './google.png'
import facebook from './facebook.png'
import linkedin from './linkedin.png'

function Login() {
    return (
        <div>
            <h1 className="title">What To Do?</h1>
            <div className="login-box">
                <h1 className="sign-in">SIGN IN</h1>
                <Container fluid style={{paddingLeft: "25%"}}>
                    <Form>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px"}}>Email</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" style={{width: "75%", height: "40px"}}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{fontSize: "27px", paddingTop: "25px"}}>Password</Form.Label>
                            <Form.Control type="text" placeholder="password" style={{width: "75%", height: "40px"}} />
                        </Form.Group>
                    </Form>
                    <Button variant="primary" style={{marginTop: "40px", width: "75%"}}>LOGIN</Button>
                    <Row style={{marginTop: "45px"}}>
                        <Col>
                            <a href="https://google.com">
                                <img src={google} alt="google logo" width="50px" height="50px" />
                            </a>
                        </Col>
                        <Col>
                            <a href="https://facebook.com">
                                <img src={facebook} alt="facebook logo" width="50px" height="55px" />
                            </a>
                        </Col>
                        <Col>
                            <a href="https://linkedin.com">
                                <img src={linkedin} alt="linkedin logo" width="50px" height="50px" />
                            </a>
                        </Col>
                    </Row>
                </Container>
                <div style={{display: "flex", marginTop: "25px", justifyContent: 'center', fontSize: "20px"}}>
                    <span>Need an account?&nbsp;</span>
                    <a href="https://google.com" >SIGN UP</a>
                </div>
            </div>
        </div>

    );
}

export default Login;