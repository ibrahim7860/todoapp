import React, {useEffect, useState} from 'react';
import {auth, db} from "../firebase-config";
import {signOut} from 'firebase/auth'
import {useNavigate} from "react-router-dom";
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
import Todo from "./Todo";

function HomePage() {

    const toDoReference = ref(db, 'todos/' + auth.currentUser.uid)
    let canCreateToDo = true, nullQuote = false
    const today = format(new Date())
    const [show, setShow] = useState(false)
    let [isImportant, setIsImportant] = useState(false)
    let [isCompleted, setIsCompleted] = useState(false)
    let [myDay, setMyDay] = useState(false)
    let [allTasks, setAllTasks] = useState(false)
    const [toDoName, setToDoName] = useState("")
    const [toDoList, setToDoList] = useState([])
    const [date, setDate] = useState(new Date())
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false)
    const [active, setActive] = useState(false)
    const [important, setImportant] = useState(false)
    const [quotes, setQuotes] = useState([])
    const navigate = useNavigate()
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)

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
    function format(inputDate) {
        let date, month, year;

        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();

        date = date
            .toString()
            .padStart(2, '0');

        month = month
            .toString()
            .padStart(2, '0');

        return `${month}/${date}/${year}`;
    }
    function getTime(inputDate) {
        let hours = inputDate.getHours();
        let minutes = inputDate.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime
    }
    const createToDo = (e) => {
        e.preventDefault()
        if (toDoName == "") {
            alert("Cannot have empty to do")
        }
        else {
            const formattedDate = format(date)
            const formattedTime = getTime(date)
            onValue(toDoReference, (snapshot) => {
                const todos = snapshot.val()
                for (let id in todos) {
                    if ((toDoName == todos[id].toDoName) && (important == todos[id].importance) && (formattedDate == todos[id].Date) && (formattedTime == todos[id].Time) ) {
                        canCreateToDo = false;
                    }
                }
            })
            if (canCreateToDo == false) {
                alert("This is a duplicate of another todo")
            }
            else {
                push(toDoReference, {
                    toDoName,
                    completed: false,
                    importance: important,
                    Date: formattedDate,
                    Time: formattedTime
                })
            }
            setToDoName("")
        }
    }

    useEffect(() => {
        onValue(toDoReference, (snapshot) => {
            const todos = snapshot.val()
            const toDoList = []
            for (let toDoName in todos) {
                toDoList.push({toDoName, ...todos[toDoName]})
            }
            setToDoList(toDoList)
        })
    }, [])

    useEffect(() => {
        const fetchQuote = async () => {
            await fetch("https://type.fit/api/quotes")
                .then((response) => response.json())
                .then((data) => setQuotes(data));
        };
        fetchQuote();
    }, []);

    useEffect(() => {
        const startingNumber = Math.floor(Math.random() * 1000)
        setStart(startingNumber)
        const endingNumber = startingNumber + 1
        setEnd(endingNumber)
    }, [])

    return (
        <div className="content-box">
            <Navbar style={{borderRadius: '25px', float: 'left', textAlign: 'center', width: '100%'}}>
                <button style={{backgroundColor: 'transparent', border: 'none', marginLeft: '10px'}} data-bs-toggle="offcanvas" data-bs-target="#sidebar">
                    <img src={menu} alt="sidebar" width="45px" height="45px" onClick={handleShow}/>
                </button>
                <Offcanvas show={show} onHide={handleClose} style={{transition: '0.5s', backgroundColor: 'black'}}>
                    <button onClick={handleClose} style={{position: 'absolute', top: 0, right: '0px', marginLeft: '50px', fontSize: '30px', backgroundColor: 'transparent', color: '#818181', border: 'none'}}>X</button>
                    <div style={{color: '#818181', fontSize: '20px', textAlign: 'center', marginTop: '5%'}}>SIGNED IN AS:</div>
                    <div style={{color: '#818181', fontSize: '25px', textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>{auth.currentUser.email}</div>
                    <Offcanvas.Body style={{paddingTop: '25%', paddingBottom: '50%'}}>
                        <button style={{fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', margin: 'auto', backgroundColor: 'transparent', border: 'none', marginBottom: '17%'}} onClick={() => {
                            setMyDay(true)
                            setImportant(false)
                            setIsCompleted(false)
                            setAllTasks(false)
                        }}>My Day</button><br/>
                        <button style={{fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', margin: 'auto', backgroundColor: 'transparent', border: 'none', marginBottom: '17%'}} onClick={() => {
                            setIsImportant(true)
                            setIsCompleted(false)
                            setAllTasks(false)
                            setMyDay(false)
                        }}>Important</button><br/>
                        <button style={{fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', margin: 'auto', backgroundColor: 'transparent', border: 'none', marginBottom: '17%'}} onClick={() => {
                            setIsCompleted(true)
                            setAllTasks(false)
                            setMyDay(false)
                            setIsImportant(false)
                        }}>Completed</button><br/>
                        <button style={{fontSize: '25px', display: 'block', transition: '0.3s', color: '#818181', textDecoration: 'none', margin: 'auto', backgroundColor: 'transparent', border: 'none', marginBottom: '17%'}} onClick={() => {
                            setAllTasks(true)
                            setMyDay(false)
                            setIsImportant(false)
                            setIsCompleted(false)
                        }}>All Tasks</button><br/>
                    </Offcanvas.Body>
                </Offcanvas>
                <Navbar.Brand style={{fontSize: '40px', fontWeight: 'bold', marginLeft: '38%'}}>MY TASKS</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link onClick={signUserOut} style={{marginRight: '10px', fontSize: '20px', borderStyle: 'solid', borderWidth: '4px', backgroundColor: 'red', borderRadius: '15px', fontWeight: 'bold'}}>SIGN OUT</Nav.Link>
                </Nav>
            </Navbar>
            <div className="content-body">
                {quotes.slice(start, end).map((quote) => {
                    if (quote.author == null) {
                        nullQuote = true;
                    }
                    return (
                        <div style={{color: 'lightgreen', marginTop: '5px'}}>
                            <span style={{textAlign: 'center'}}><h4>"{quote.text}"</h4></span>
                            <span style={{textAlign: 'center'}}><h3>{nullQuote ? "" : quote.author}</h3></span>
                        </div>
                    )
                })}
                <Card className="mx-auto" style={{width: '50%', marginTop: '35px'}}>
                    <Card.Body>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <input type="text" placeholder="Add new task" value={toDoName} onChange={handleToDo} required style={{borderColor: 'transparent', width: '100%', outline: 'none'}} />
                            {active ?  <button onClick={onSetActive} style={{backgroundColor: 'transparent', border: 'none'}}><img src={yellowStar} alt="yellow-star" width="35px" height="35px"/></button> :  <button onClick={onSetActive} style={{backgroundColor: 'transparent', border: 'none'}}><img src={whiteStar} alt="white-star" width="35px" height="35px"/></button>}
                            <input type="image" alt="calendar" onClick={openDatePicker} src={calendar} style={{backgroundColor: 'transparent', border: 'none', marginLeft: '10px', width: "55px", height: "45px"}}/>
                            <DatePicker open={datePickerIsOpen} showTimeSelect selected={date} className="date-picker" onClickOutside={openDatePicker} onChange={date => setDate(date)} />
                            <div style={{marginLeft: '10px'}}>
                                <button type="button" className="btn btn-primary" onClick={createToDo}>Add</button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <hr style={{width: '50%', margin: 'auto', marginTop: '30px', marginBottom: '30px', height: '10px', backgroundColor: '#b7d0e2'}}/>
                <div>
                    {myDay ? toDoList.filter((todo) => {
                        if (todo.Date == today) {
                            return todo
                        }
                    }).map((todo) => <Todo todo={todo} />) : isImportant ? toDoList.filter((todo) => {
                        if (todo.importance == true) {
                            return todo
                        }
                    }).map((todo) => <Todo todo={todo} />) : isCompleted ? toDoList.filter((todo) => {
                        if (todo.completed == true) {
                            return todo
                        }
                    }).map((todo) => <Todo todo={todo} />) : allTasks ? toDoList.map((todo) => <Todo todo={todo} />) : toDoList ? toDoList.map((todo) => <Todo todo={todo} />) : ""}
                </div>
            </div>
        </div>
    )
}

export default HomePage;