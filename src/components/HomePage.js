import React, {useEffect, useState} from 'react';
import {auth, db} from "../firebase-config";
import {signOut} from 'firebase/auth'
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import {Card, Nav, Navbar, Offcanvas, ProgressBar} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {onValue, push, ref} from 'firebase/database'
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
    const todayDate = format(new Date())
    const [showSidebar, setShowSidebar] = useState(false)
    let [isImportant, setIsImportant] = useState(false)
    let [isCompleted, setIsCompleted] = useState(false)
    let [myDay, setMyDay] = useState(false)
    let [allTasks, setAllTasks] = useState(false)
    const [toDoName, setToDoName] = useState("")
    const [toDoList, setToDoList] = useState([])
    const myDayCompletionPercent = getProgress()
    const [date, setDate] = useState(new Date())
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false)
    const [toggleStars, setToggleStars] = useState(false)
    const [important, setImportant] = useState(false)
    const [quotes, setQuotes] = useState([])
    const navigate = useNavigate()
    const [startingIndex, setStartingIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(0)

    const signUserOut = () => {
        signOut(auth).then(() => {
            navigate('/')
        }).catch((error) => {
            alert(error.message)
        })
    }

    const handleClose = () => {setShowSidebar(false)}

    const handleShow = () => {setShowSidebar(true)}

    const openDatePicker = () => {setDatePickerIsOpen(!datePickerIsOpen)}

    const onSetActive = () => {
        setToggleStars(!toggleStars)
        setImportant(!toggleStars)
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
        return hours + ':' + minutes + ' ' + ampm
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
                    Time: formattedTime,
                    fullDate: date.toString()
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
            toDoList.sort(function(a,b) {
                if (a.Date == b.Date) {
                    return new Date(a.fullDate) - new Date(b.fullDate)
                }
                else {
                    return new Date(a.Date) - new Date(b.Date)
                }
            })
            setToDoList(toDoList)
        })
    }, [])

    function getProgress() {
        let numCompleted = 0, numToday = 0
        toDoList.map((todo) => {
            if (todo.Date == todayDate) {
                numToday++
            }
            if (todo.completed == true && todo.Date == todayDate) {
                numCompleted++
            }
        })
        if (numCompleted == 0) {
            return 0
        }
        else if (Number.isInteger((numCompleted / numToday) * 100)) {
            return (numCompleted / numToday) * 100
        }
        else {
            return ((numCompleted / numToday) * 100).toFixed(2)
        }
    }

    function getVariant(completionPercent) {
        completionPercent /= 100
        if (completionPercent < 0.25) {
            return 'danger'
        }
        else if (completionPercent < 0.5) {
            return 'primary'
        }
        else if (completionPercent > 0.5) {
            return 'success'
        }
    }

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
        setStartingIndex(startingNumber)
        const endingNumber = startingNumber + 1
        setEndIndex(endingNumber)
    }, [])

    return (
        <div className="content-box">
            <Navbar style={{borderRadius: '25px', float: 'left', textAlign: 'center', width: '100%'}}>
                <button style={{backgroundColor: 'transparent', border: 'none', marginLeft: '10px'}} data-bs-toggle="offcanvas" data-bs-target="#sidebar">
                    <img src={menu} alt="sidebar" width="45px" height="45px" onClick={handleShow}/>
                </button>
                <Offcanvas show={showSidebar} onHide={handleClose} style={{transition: '0.5s', backgroundColor: 'black'}}>
                    <button onClick={handleClose} style={{position: 'absolute', top: 0, right: '0px', marginLeft: '50px', fontSize: '30px', backgroundColor: 'transparent', color: '#818181', border: 'none'}}>X</button>
                    <div style={{color: '#818181', fontSize: '20px', textAlign: 'center', marginTop: '5%'}}>SIGNED IN AS:</div>
                    <div style={{color: '#818181', fontSize: '25px', textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>{auth.currentUser.email}</div>
                    <div style={{color: '#818181', fontSize: '25px', textAlign: 'center', marginTop: '2%'}}>{todayDate}</div>
                    <Offcanvas.Body style={{paddingTop: '20%', paddingBottom: '50%'}}>
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
                <Navbar.Brand className="my-tasks">MY TASKS</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link onClick={signUserOut} style={{marginRight: '10px', fontSize: '20px', borderStyle: 'solid', borderWidth: '3px', backgroundColor: 'red', borderRadius: '15px', fontWeight: 'bold'}}>SIGN OUT</Nav.Link>
                </Nav>
            </Navbar>
            <div className="content-body">
                {quotes.slice(startingIndex, endIndex).map((quote) => {
                    if (quote.author == null) {
                        nullQuote = true;
                    }
                    return (
                        <div className="quote-container">
                            <span className="quote-text"><h2>"{quote.text}"</h2></span>
                            <span className="quote-author"><h2>{nullQuote ? "" : quote.author}</h2></span>
                        </div>
                    )
                })}
                {myDay ? <ProgressBar style={{backgroundColor: 'lightgray', margin: '0 20% 0 20%', height: '30px'}} className="rounded-pill" animated now={myDayCompletionPercent} label={`${myDayCompletionPercent}%`} variant={getVariant(myDayCompletionPercent)} /> : ""}
                <Card className="mx-auto" style={{width: '50%', marginTop: '35px', marginBottom: '35px'}}>
                    <Card.Body style={{backgroundColor: 'black', borderRadius: '5px'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <input type="text" placeholder="Add new task" value={toDoName} onChange={handleToDo} required style={{borderColor: 'transparent', width: '100%', outline: 'none', backgroundColor: 'transparent', color: 'white'}} />
                            {toggleStars ?  <button onClick={onSetActive} style={{backgroundColor: 'transparent', border: 'none'}}><img src={yellowStar} alt="yellow-star" width="35px" height="35px"/></button> :  <button onClick={onSetActive} style={{backgroundColor: 'transparent', border: 'none'}}><img src={whiteStar} alt="white-star" width="35px" height="35px"/></button>}
                            <input type="image" alt="calendar" onClick={openDatePicker} src={calendar} style={{backgroundColor: 'transparent', border: 'none', marginLeft: '4px', width: "55px", height: "45px"}}/>
                            <DatePicker open={datePickerIsOpen} showTimeSelect selected={date} className="date-picker" onClickOutside={openDatePicker} onChange={date => setDate(date)} />
                            <div style={{marginLeft: '10px'}}>
                                <button type="button" className="btn btn-primary" onClick={createToDo}>Add</button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <div>
                    {myDay ? toDoList.filter((todo) => {
                        if (todo.Date == todayDate) {
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