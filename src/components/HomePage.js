import React, {useState} from 'react';
import {auth} from "../firebase-config";
import {signOut} from 'firebase/auth'
import {Link, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import {Nav, Navbar, Offcanvas} from "react-bootstrap";
import './HomePage.css'
import menu from './images/menu.png'

function HomePage() {

    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    const signUserOut = () => {
        signOut(auth).then(() => {
            navigate('/')
        }).catch((error) => {
            alert(error.message)
        })
    }

    const handleClose = () => {setShow(false)}
    const handleShow = () => {setShow(true)}

    return (
        <div className="content-box">
            <Navbar bg="white" style={{borderRadius: '25px', float: 'left', textAlign: 'center', width: '100%'}}>
                <button style={{backgroundColor: 'transparent', border: 'none', marginLeft: '10px'}} data-bs-toggle="offcanvas" data-bs-target="#sidebar">
                    <img src={menu} alt="sidebar" width="45px" height="45px" onClick={handleShow}/>
                </button>
                <Offcanvas show={show} onHide={handleClose} style={{transition: '0.5s', backgroundColor: 'black'}}>
                    <button onClick={handleClose} style={{position: 'absolute', top: 0, right: '0px', marginLeft: '50px', fontSize: '30px', backgroundColor: 'transparent', color: '#818181', border: 'none'}}>X</button>
                    <div style={{color: '#818181', fontSize: '20px', textAlign: 'center', marginTop: '5%'}}>SIGNED IN AS:</div>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title style={{color: '#818181', padding: "0px 8px 8px 32px", fontSize: '25px', display: 'block'}}>{auth.currentUser.email}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body style={{paddingTop: '23%', paddingBottom: '50%'}}>
                        <Link style={{padding: "0px 8px 8px", fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', textAlign: 'center'}}>My Day</Link><br/>
                        <Link style={{padding: "25% 8px 8px", fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', textAlign: 'center'}}>Important</Link><br/>
                        <Link style={{padding: "25% 8px 8px", fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', textAlign: 'center'}}>Tasks</Link><br/>
                    </Offcanvas.Body>
                </Offcanvas>
                <Navbar.Brand style={{fontSize: '40px', fontWeight: 'bold', marginLeft: '38%'}}>MY TASKS</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link onClick={signUserOut} style={{marginRight: '10px', fontSize: '20px', borderStyle: 'solid', backgroundColor: 'red', borderRadius: '15px', fontWeight: 'bold'}}>SIGN OUT</Nav.Link>
                </Nav>
            </Navbar>
        </div>
    )
}

export default HomePage;