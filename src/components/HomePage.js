import React, {useEffect, useState} from 'react';
import {auth, toDoReference} from "../firebase-config";
import {signOut} from 'firebase/auth'
import {Link, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import {Card, Nav, Navbar, Offcanvas} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {push, ref, onValue} from 'firebase/database'
import 'react-datepicker/dist/react-datepicker.css'
import './HomePage.css'
import menu from './images/menu.png'
import calendar from './images/calendar.png'
import whiteStar from './images/whitestar.png'
import yellowStar from './images/yellowstar.png'

function HomePage() {

    const [show, setShow] = useState(false)
    const [toDoName, setToDoName] = useState("")
    const [todoList, setToDoList] = useState([])
    const [date, setDate] = useState(new Date())
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false)
    const [active, setActive] = useState(false)
    const [important, setImportant] = useState(false)
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
    const openDatePicker = () => {setDatePickerIsOpen(!datePickerIsOpen)}
    const onSetActive = () => {
        setActive(!active)
        setImportant(!active)
    }
    const handleToDo = (e) => {
        setToDoName(e.target.value)
    }
    const createToDo = (e) => {
        e.preventDefault()
        push(toDoReference, {
            toDoName,
            completed: false,
            importance: important,
            Date: date.toDateString()
        })
    }

    useEffect(() => {
        onValue(toDoReference, (snapshot) => {
            const todos = snapshot.val()
            for (let toDoName in todos) {
                todoList.push({toDoName, ...todos[toDoName]})
            }
            setToDoList(todoList)
            for (let i = 0; i < todoList.length; i++) {
                console.log(todoList[i].toDoName)
            }
        })
    }, [])

    return (
        <div className="content-box">
            <Navbar bg="white" style={{borderRadius: '25px', float: 'left', textAlign: 'center', width: '100%'}}>
                <button style={{backgroundColor: 'transparent', border: 'none', marginLeft: '10px'}} data-bs-toggle="offcanvas" data-bs-target="#sidebar">
                    <img src={menu} alt="sidebar" width="45px" height="45px" onClick={handleShow}/>
                </button>
                <Offcanvas show={show} onHide={handleClose} style={{transition: '0.5s', backgroundColor: 'black'}}>
                    <button onClick={handleClose} style={{position: 'absolute', top: 0, right: '0px', marginLeft: '50px', fontSize: '30px', backgroundColor: 'transparent', color: '#818181', border: 'none'}}>X</button>
                    <div style={{color: '#818181', fontSize: '20px', textAlign: 'center', marginTop: '5%'}}>SIGNED IN AS:</div>
                    <div style={{color: '#818181', fontSize: '25px', textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>{auth.currentUser.email}</div>
                    <Offcanvas.Body style={{paddingTop: '25%', paddingBottom: '50%'}}>
                        <Link style={{padding: "0px 8px 8px", fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', textAlign: 'center'}}>My Day</Link><br/>
                        <Link style={{padding: "15% 8px 8px", fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', textAlign: 'center'}}>Important</Link><br/>
                        <Link style={{padding: "15% 8px 8px", fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', textAlign: 'center'}}>Completed</Link><br/>
                        <Link style={{padding: "15% 8px 8px", fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', textAlign: 'center'}}>All Tasks</Link><br/>
                    </Offcanvas.Body>
                </Offcanvas>
                <Navbar.Brand style={{fontSize: '40px', fontWeight: 'bold', marginLeft: '38%'}}>MY TASKS</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link onClick={signUserOut} style={{marginRight: '10px', fontSize: '20px', borderStyle: 'solid', borderWidth: '4px', backgroundColor: 'red', borderRadius: '15px', fontWeight: 'bold'}}>SIGN OUT</Nav.Link>
                </Nav>
            </Navbar>
            <div className="content-body">
                <Card className="mx-auto" style={{width: '50%', marginTop: '15px'}}>
                    <Card.Body>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <input type="text" placeholder="Add new task" value={toDoName} onChange={handleToDo} required style={{borderColor: 'transparent', width: '100%', outline: 'none'}} />
                            {active ?  <img src={yellowStar} alt="yellow-star" width="35px" height="35px" onClick={onSetActive}/> :  <img src={whiteStar} alt="white-star" width="35px" height="35px" onClick={onSetActive}/>}
                            <input type="image" alt="calendar" onClick={openDatePicker} src={calendar} style={{backgroundColor: 'transparent', border: 'none', marginLeft: '10px', width: "55px", height: "45px"}}/>
                            <DatePicker open={datePickerIsOpen} className="date-picker" onClickOutside={openDatePicker} onChange={date => setDate(date)} />
                            <div style={{marginLeft: '10px'}}>
                                <button type="button" className="btn btn-primary" onClick={createToDo}>Add</button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <hr style={{width: '50%', margin: 'auto', marginTop: '30px', marginBottom: '30px'}}/>
            </div>
        </div>
    )
}

export default HomePage;