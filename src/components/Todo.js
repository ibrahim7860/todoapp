import React, {useState} from 'react';
import {Card} from "react-bootstrap";
import checkmark from './images/checkmark.png'
import edit from './images/edit.png'
import deleteImage from './images/delete.png'
import {onValue, ref} from "firebase/database";
import {auth, db} from "../firebase-config";
import {update, remove} from 'firebase/database'
import './Todo.css'
import calendar from './images/calendar.png'
import whiteStar from './images/whitestar.png'
import yellowStar from './images/yellowstar.png'
import DatePicker from "react-datepicker";

function Todo(props) {

    const todo = props.todo
    const [newToDoName, setNewToDoName] = useState("")
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false)
    const [date, setDate] = useState(new Date())
    let active = todo.importance
    let duplicate = false;
    const formattedDate = format(date)

    let childKey = ""
    const toDoReference = ref(db, `todos/${auth.currentUser.uid}/`)
    onValue(toDoReference, (snapshot) => {
        const snap = snapshot.val()
        snapshot.forEach(childSnapshot => {
            if ((todo.toDoName == "" || todo.toDoName == snap[childSnapshot.key].toDoName) && (todo.importance == snap[childSnapshot.key].importance) && (todo.Date == snap[childSnapshot.key].Date)) {
                childKey = childSnapshot.key
            }
        })
    })
    const toDoChildReference = ref(db, `/todos/${auth.currentUser.uid}/${childKey}/`)

    const openDatePicker = () => {
        setDatePickerIsOpen(!datePickerIsOpen)
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

    const openDatePickerSubmit = () => {
        setDatePickerIsOpen(!datePickerIsOpen)
        onValue(toDoReference, (snapshot) => {
            const todos = snapshot.val()
            for (let id in todos) {
                if ((todo.toDoName == todos[id].toDoName) && (todo.importance == todos[id].importance) && (formattedDate == todos[id].Date)) {
                    duplicate = true;
                }
            }
        })
        if (duplicate) {
            alert("This is a duplicate of another todo")
        }
        else {
            update(toDoChildReference, {
                Date: formattedDate
            })
        }
    }

    const onSetActive = () => {
        active = !active
        const important = active
        onValue(toDoReference, (snapshot) => {
            const todos = snapshot.val()
            for (let id in todos) {
                if ((todo.toDoName == todos[id].toDoName) && (important == todos[id].importance) && (todo.Date == todos[id].Date)) {
                    duplicate = true;
                }
            }
        })
        if (duplicate) {
            alert("This is a duplicate of another todo")
        }
        else {
            update(toDoChildReference, {
                importance: important
            })
        }
    }

    const completeTodo = () => {
        update(toDoChildReference, {
            completed: !todo.completed
        })
    }

    const editTodo = () => {
        onValue(toDoReference, (snapshot) => {
            const todos = snapshot.val()
            for (let id in todos) {
                if ((newToDoName == todos[id].toDoName) && (todo.importance == todos[id].importance) && (todo.Date == todos[id].Date)) {
                    duplicate = true;
                }
            }
        })
        if (duplicate) {
            alert("This is a duplicate of another todo")
        }
        else {
            update(toDoChildReference, {
                toDoName: newToDoName
            })
        }
    }

    const deleteTodo = () => {
        remove(toDoChildReference)
    }

    const handleChange = (e) => {
        if (todo.completed === true) {
            setNewToDoName(todo.toDoName)
        }
        else {
            todo.toDoName = ""
            setNewToDoName(e.target.value)
        }
    }

    return (
        <Card className="mx-auto" style={{width: '50%', marginTop: '15px', marginBottom: '15px', backgroundColor: 'black', borderStyle: 'solid', borderColor: 'red', borderWidth: '5px'}}>
            <Card.Body>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={completeTodo}><img src={checkmark} alt="complete" width="25px" height="25px"/></button>
                    <input type="text" value={todo.toDoName === "" ? newToDoName : todo.toDoName} className={todo.completed ? "complete" : "list-item"} onChange={handleChange} />
                    <div style={{color: 'white'}}>{todo.Date}</div>
                    <button style={{backgroundColor: 'transparent', border: 'none', paddingBottom: '10px', marginLeft: '10px'}} onClick={editTodo}><img src={edit} alt="complete" width="25px" height="25px"/></button>
                    <button style={{backgroundColor: 'transparent', border: 'none', paddingBottom: '10px'}} onClick={deleteTodo}><img src={deleteImage} alt="complete" width="25px" height="25px"/></button>
                    {active ?  <button onClick={onSetActive} style={{backgroundColor: 'transparent', border: 'none', paddingBottom: '10px'}}><img src={yellowStar} alt="yellow-star" width="30px" height="30px"/></button> :  <button onClick={onSetActive} style={{backgroundColor: 'transparent', border: 'none', paddingBottom: '10px'}}><img src={whiteStar} alt="white-star" width="30px" height="30px"/></button>}
                    <input type="image" alt="calendar" onClick={openDatePicker} src={calendar} style={{backgroundColor: 'transparent', border: 'none', width: "45px", height: "45px", paddingBottom: '7px'}}/>
                    <DatePicker open={datePickerIsOpen} className="date-picker" onClickOutside={openDatePickerSubmit} onChange={date => setDate(date)} />
                </div>
            </Card.Body>
        </Card>
    );
}

export default Todo;